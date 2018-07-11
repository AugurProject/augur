import Augur from "augur.js";
import * as Knex from "knex";
import * as path from "path";
import * as sqlite3 from "sqlite3";
import { promisify, format } from "util";
import { rename, copyFile, existsSync, unlinkSync, readFile, writeFile} from "fs";
import { NetworkConfiguration } from "augur-core";
import { setOverrideTimestamp } from "../blockchain/process-block";
import { postProcessDatabaseResults } from "../server/post-process-database-results";
import { monitorEthereumNodeHealth } from "../blockchain/monitor-ethereum-node-health";
import { logger } from "../utils/logger";
import { ErrorCallback } from "../types";

interface NetworkIdRow {
  networkId: string;
  overrideTimestamp: number|null;
}

// WARNING: Update this only if this release requires destroying all existing Augur Node Databases
const DB_VERSION = 1;

const DB_FILE_SYNCING = "augur-%s-syncing-%s.db";
const DB_FILE_BULK_SYNC = "augur-%s-%s.db";

function getDatabasePathFromNetworkId(networkId: string, databaseDir: string|undefined, filenameTemplate: string = DB_FILE_SYNCING) {
  return path.join(databaseDir || path.join(__dirname, "../../"), format(filenameTemplate, networkId, DB_VERSION));
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

export async function createDbAndConnect(errorCallback: ErrorCallback | undefined, augur: Augur, network: NetworkConfiguration, databaseDir?: string): Promise<Knex> {
  return new Promise<Knex>((resolve, reject) => {
    augur.connect({ ethereumNode: { http: network.http, ws: network.ws }, startBlockStreamOnConnect: false }, async (err) => {
      if (err) return reject(new Error(`Could not connect via augur.connect ${err}`));
      const networkId: string = augur.rpc.getNetworkID();
      if (networkId == null) return reject(new Error("could not get networkId"));
      try {
        monitorEthereumNodeHealth(errorCallback, augur);
        await checkAndUpdateContractUploadBlock(augur, networkId, databaseDir);
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
    oldUploadBlockNumber = Number(await promisify(readFile)(oldUploadBlockNumberFile));
  }
  const currentUploadBlockNumber = augur.contracts.uploadBlockNumbers[augur.rpc.getNetworkID()];
  if (currentUploadBlockNumber !== oldUploadBlockNumber) {
    console.log(`Deleting existing DB for this configuration as the upload block number is not equal: OLD: ${oldUploadBlockNumber} NEW: ${currentUploadBlockNumber}`);
    const dbPath = getDatabasePathFromNetworkId(networkId, databaseDir);
    if (existsSync(dbPath)) {
      unlinkSync(dbPath);
    }
    await promisify(writeFile)(oldUploadBlockNumberFile, currentUploadBlockNumber);
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

export async function renameDatabaseFile(networkId: string, databaseDir?: string) {
  const augurDbPath = getDatabasePathFromNetworkId(networkId, databaseDir);
  const backupDbPath = getDatabasePathFromNetworkId(networkId, databaseDir, `backup-augur-%s-${new Date().getTime()}.db`);
  logger.info(`Moving database ${augurDbPath} to ${backupDbPath}`);
  await promisify(rename)(augurDbPath, backupDbPath);
}

async function getFreshDatabase(db: Knex|null, networkId: string, databaseDir?: string): Promise<Knex> {
  if (db != null) db.destroy();
  await renameDatabaseFile(networkId, databaseDir);
  return createKnex(networkId);
}

export async function saveBulkSyncDatabase(networkId: string, databaseDir?: string) {
  const databasePathBulkSync = getDatabasePathFromNetworkId(networkId, databaseDir, DB_FILE_BULK_SYNC);
  const databasePathSyncing = getDatabasePathFromNetworkId(networkId, databaseDir, DB_FILE_SYNCING);
  logger.info(`Saving bulk sync database ${databasePathSyncing} to ${databasePathBulkSync}`);
  return promisify(copyFile)(databasePathSyncing, databasePathBulkSync);
}

export async function checkAndInitializeAugurDb(augur: Augur, networkId: string, databaseDir?: string): Promise<Knex> {
  const databasePathSyncing = getDatabasePathFromNetworkId(networkId, databaseDir, DB_FILE_SYNCING);
  if (existsSync(databasePathSyncing)) {
    logger.info(`Removing sync-only database: ${databasePathSyncing}`);
    unlinkSync(databasePathSyncing);
  }
  const databasePathBulkSync = getDatabasePathFromNetworkId(networkId, databaseDir, DB_FILE_BULK_SYNC);
  if (existsSync(databasePathBulkSync)) {
    logger.info(`Found prior bulk-sync database: ${databasePathBulkSync}`);
    await promisify(copyFile)(databasePathBulkSync, getDatabasePathFromNetworkId(networkId, databaseDir));
  }
  let db: Knex = createKnex(networkId, databaseDir);
  const databaseDamaged = await isDatabaseDamaged(db);
  if (databaseDamaged) db = await getFreshDatabase(db, networkId, databaseDir);
  await db.migrate.latest({ directory: path.join(__dirname, "../migrations") });
  await initializeNetworkInfo(db, augur);
  return db;
}
