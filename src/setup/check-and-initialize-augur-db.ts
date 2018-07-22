import Augur from "augur.js";
import * as Knex from "knex";
import * as path from "path";
import * as sqlite3 from "sqlite3";
import { promisify, format } from "util";
import { copyFile, rename, existsSync, readFile, writeFile } from "fs";
import { setOverrideTimestamp } from "../blockchain/process-block";
import { postProcessDatabaseResults } from "../server/post-process-database-results";
import { monitorEthereumNodeHealth } from "../blockchain/monitor-ethereum-node-health";
import { logger } from "../utils/logger";
import { ConnectOptions, ErrorCallback } from "../types";

interface NetworkIdRow {
  networkId: string;
  overrideTimestamp: number|null;
}

// WARNING: Update this only if this release requires destroying all existing Augur Node Databases
const DB_VERSION = 2;

const DB_FILE_SYNCING = "augur-%s-syncing-%s.db";
const DB_FILE_BULK_SYNC = "augur-%s-%s.db";

function getDatabasePathFromNetworkId(networkId: string, filenameTemplate: string = DB_FILE_SYNCING, databaseDir: string|undefined) {
  return path.join(databaseDir || path.join(__dirname, "../../"), format(filenameTemplate, networkId, DB_VERSION));
}

function getUploadBlockPathFromNetworkId(networkId: string, databaseDir: string|undefined, filenameTemplate: string = "upload-block-%s") {
  return path.join(databaseDir || path.join(__dirname, "../../"), format(filenameTemplate, networkId));
}

function createKnex(networkId: string, dbPath: string): Knex {
  logger.info(dbPath);
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
        filename: dbPath,
      },
      acquireConnectionTimeout: 5 * 60 * 1000,
      useNullAsDefault: true,
      postProcessResponse: postProcessDatabaseResults,
    });
  }
}

async function renameDatabaseFile(networkId: string, dbPath: string) {
  const backupDbPath = getDatabasePathFromNetworkId(networkId, path.dirname(dbPath), `backup-augur-%s-${new Date().getTime()}.db`);
  logger.info(`Moving database ${dbPath} to ${backupDbPath}`);
  await promisify(rename)(dbPath, backupDbPath);
}

async function getFreshDatabase(db: Knex|null, networkId: string, dbPath: string): Promise<Knex> {
  if (db != null) db.destroy();
  await renameDatabaseFile(networkId, dbPath);
  return createKnex(networkId, dbPath);
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

async function checkAndUpdateContractUploadBlock(augur: Augur, networkId: string, databaseDir?: string): Promise<void> {
  const oldUploadBlockNumberFile = getUploadBlockPathFromNetworkId(networkId, databaseDir);
  let oldUploadBlockNumber = 0;
  if (existsSync(oldUploadBlockNumberFile)) {
    oldUploadBlockNumber = Number(await promisify(readFile)(oldUploadBlockNumberFile));
  }
  const currentUploadBlockNumber = augur.contracts.uploadBlockNumbers[augur.rpc.getNetworkID()];
  if (currentUploadBlockNumber !== oldUploadBlockNumber) {
    console.log(`Deleting existing DB for this configuration as the upload block number is not equal: OLD: ${oldUploadBlockNumber} NEW: ${currentUploadBlockNumber}`);
    const dbPath = getDatabasePathFromNetworkId(networkId, DB_FILE_BULK_SYNC, databaseDir);
    renameDatabaseFile(networkId, dbPath);
    await promisify(writeFile)(oldUploadBlockNumberFile, currentUploadBlockNumber);
  }
}

export async function createDbAndConnect(errorCallback: ErrorCallback|undefined, augur: Augur, network: ConnectOptions, databaseDir?: string): Promise<Knex> {
  return new Promise<Knex>((resolve, reject) => {
    const connectOptions = Object.assign(
      { ethereumNode: { http: network.http, ws: network.ws }, startBlockStreamOnConnect: false },
      network.propagationDelayWaitMillis != null ? { propagationDelayWaitMillis: network.propagationDelayWaitMillis } : {},
      network.maxRetries != null ? { maxRetries: network.maxRetries } : {},
    );
    augur.connect(connectOptions, async (err) => {
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

export async function renameBulkSyncDatabaseFile(networkId: string, databaseDir?: string) {
  return renameDatabaseFile(networkId, getDatabasePathFromNetworkId(networkId, DB_FILE_BULK_SYNC, databaseDir));
}

export async function swapBulkSyncForSyncingDatabase(db: Knex, networkId: string, databaseDir?: string): Promise<Knex> {
  if (db != null) db.destroy();
  const databasePathBulkSync = getDatabasePathFromNetworkId(networkId, DB_FILE_BULK_SYNC, databaseDir);
  const databasePathSyncing = getDatabasePathFromNetworkId(networkId, DB_FILE_SYNCING, databaseDir);
  logger.info(`Copying bulk sync database to snapshot ${databasePathBulkSync} to ${databasePathSyncing}`);
  await promisify(copyFile)(databasePathBulkSync, databasePathSyncing);
  return createKnex(networkId, databasePathSyncing);
}

export async function checkAndInitializeAugurDb(augur: Augur, networkId: string, databaseDir?: string): Promise<Knex> {
  const databasePathBulkSync = getDatabasePathFromNetworkId(networkId, DB_FILE_BULK_SYNC, databaseDir);
  if (existsSync(databasePathBulkSync)) {
    logger.info(`Found prior bulk-sync database: ${databasePathBulkSync}`);
  }
  let db: Knex = createKnex(networkId, databasePathBulkSync);
  const databaseDamaged = await isDatabaseDamaged(db);
  if (databaseDamaged) db = await getFreshDatabase(db, networkId, databasePathBulkSync);
  await db.migrate.latest({ directory: path.join(__dirname, "../migrations") });
  await initializeNetworkInfo(db, augur);
  return db;
}
