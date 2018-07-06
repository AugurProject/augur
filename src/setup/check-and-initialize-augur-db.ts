import Augur from "augur.js";
import * as Knex from "knex";
import * as path from "path";
import * as sqlite3 from "sqlite3";
import { promisify, format } from "util";
import { rename, fstat, existsSync, unlinkSync, readFileSync, writeFileSync } from "fs";
import { NetworkConfiguration } from "augur-core";
import { setOverrideTimestamp } from "../blockchain/process-block";
import { postProcessDatabaseResults } from "../server/post-process-database-results";
import { monitorEthereumNodeHealth } from "../blockchain/monitor-ethereum-node-health";
import { logger } from "../utils/logger";

interface NetworkIdRow {
  networkId: string;
  overrideTimestamp: number|null;
}

function getDatabasePathFromNetworkId(networkId: string, databaseDir: string|undefined, filenameTemplate: string = "augur-%s.db") {
  return path.join(databaseDir || path.join(__dirname, "../../"), format(filenameTemplate, networkId));
}

function getUploadBlockPathFromNetworkId(networkId: string, databaseDir: string|undefined, filenameTemplate: string = "upload-block-%s") {
  return path.join(databaseDir || path.join(__dirname, "../../"), format(filenameTemplate, networkId));
}

function createKnex(networkId: string, databaseDir?: string): Knex {
  const augurDbPath = getDatabasePathFromNetworkId(networkId, databaseDir);
  logger.info(augurDbPath);
  if (process.env.DATABASE_URL) {
    // Be careful about non-serializable transactions. We expect database writes to be processed from the blockchain, serially, in block order.
    return Knex({
      client: "pg",
      connection: process.env.DATABASE_URL,
    });
  } else {
    sqlite3.verbose();
    return Knex({
      client: "sqlite3",
      connection: {
        filename: augurDbPath,
      },
      acquireConnectionTimeout: 5 * 60 * 1000,
      useNullAsDefault: true,
      postProcessResponse: postProcessDatabaseResults,
    });
  }
}

export async function createDbAndConnect(augur: Augur, network: NetworkConfiguration, databaseDir?: string): Promise<Knex> {
  return new Promise<Knex>((resolve, reject) => {
    augur.connect({ ethereumNode: { http: network.http, ws: network.ws }, startBlockStreamOnConnect: false }, async (err) => {
      if (err) return reject(new Error(`Could not connect via augur.connect ${err}`));
      const networkId: string = augur.rpc.getNetworkID();
      if (networkId == null) return reject(new Error("could not get networkId"));
      try {
        monitorEthereumNodeHealth(augur);
        await checkAndUpdateContractUploadBlock(augur, networkId);
        const db = await checkAndInitializeAugurDb(augur, networkId, databaseDir);
        resolve(db);
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function checkAndUpdateContractUploadBlock(augur: Augur, networkId: string, databaseDir?: string): Promise<void> {
  const oldUploadBlockNumberFile = getUploadBlockPathFromNetworkId(networkId, databaseDir);
  let oldUploadBlockNumber = 0;
  if (existsSync(oldUploadBlockNumberFile)) {
    oldUploadBlockNumber = Number(readFileSync(oldUploadBlockNumberFile));
  }
  const currentUploadBlockNumber = augur.contracts.uploadBlockNumbers[augur.rpc.getNetworkID()];
  if (currentUploadBlockNumber !== oldUploadBlockNumber) {
    console.log(`Deleting existing DB for this configuration as the upload block number is not equal: OLD: ${oldUploadBlockNumber} NEW: ${currentUploadBlockNumber}`);
    const dbPath = getDatabasePathFromNetworkId(networkId, databaseDir);
    if (existsSync(dbPath)) {
      unlinkSync(dbPath);
    }
    writeFileSync(oldUploadBlockNumberFile, currentUploadBlockNumber);
  }
}

async function isDatabaseDamaged(db: Knex): Promise<boolean> {
  try {
    const errorRow: { error: undefined|null|string } = await db("network_id").first(["error"]).whereNotNull("error");
    return errorRow.error != null;
  } catch {
    // Database does not exist
    return false;
  }
}

async function initializeNetworkInfo(db: Knex, augur: Augur): Promise<void> {
  const networkId: string = augur.rpc.getNetworkID();
  const networkRow: NetworkIdRow = await db.first(["networkId", "overrideTimestamp"]).from("network_id");
  if (networkRow == null) {
    await db.insert({ networkId }).into("network_id");
  } else {
    const lastNetworkId: string = networkRow.networkId;
    if (networkId === lastNetworkId) {
      await db("network_id").update({ lastLaunched: db.fn.now() });
      if (networkRow.overrideTimestamp == null) return;
      await promisify(setOverrideTimestamp)(db, networkRow.overrideTimestamp);
    } else {
      throw new Error(`NetworkId mismatch: current: ${networkId}, expected ${lastNetworkId}`);
    }
  }
}

async function moveDatabase(db: Knex, networkId: string, databaseDir?: string): Promise<Knex> {
  db.destroy();
  const augurDbPath = getDatabasePathFromNetworkId(networkId, databaseDir);
  const backupDbPath = getDatabasePathFromNetworkId(networkId, databaseDir, `backup-augur-%s-${new Date().getTime()}.db`);
  logger.info("move", augurDbPath, backupDbPath);
  await promisify(rename)(augurDbPath, backupDbPath);
  return createKnex(networkId);
}

export async function checkAndInitializeAugurDb(augur: Augur, networkId: string, databaseDir?: string): Promise<Knex> {
  let db: Knex = createKnex(networkId, databaseDir);
  const databaseDamaged = await isDatabaseDamaged(db);
  if (databaseDamaged) db = await moveDatabase(db, networkId, databaseDir);
  await db.migrate.latest({ directory: path.join(__dirname, "../migrations") });
  await initializeNetworkInfo(db, augur);
  return db;
}
