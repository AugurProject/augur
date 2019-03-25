import Knex from "knex";
import * as path from "path";
import PouchDB from "pouchdb";
import * as sqlite3 from "sqlite3";
import { format, promisify } from "util";
import { existsSync, readFile, rename, writeFile } from "fs";
import { setOverrideTimestamp } from "../blockchain/process-block";
import { postProcessDatabaseResults } from "../server/post-process-database-results";
import { logger } from "../utils/logger";
import { Augur, ErrorCallback } from "../types";
import { DB_FILE, DB_VERSION, POUCH_DB_DIR } from "../constants";
import { ConnectOptions } from "./connectOptions";
import { UploadBlockNumbers } from "@augurproject/artifacts";

interface NetworkIdRow {
  networkId: string;
  overrideTimestamp: number|null;
}

function getDatabasePathFromNetworkId(networkId: string, filenameTemplate: string = DB_FILE, databaseDir: string|undefined) {
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
      postProcessResponse: postProcessDatabaseResults,
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
  const backupDbPath = getDatabasePathFromNetworkId(networkId, `backup-augur-%s-%s-${new Date().getTime()}.db`, path.dirname(dbPath));
  logger.info(`Moving database ${dbPath} to ${backupDbPath}`);
  await promisify(rename)(dbPath, backupDbPath);
}

async function getFreshDatabase(db: Knex|null, networkId: string, dbPath: string): Promise<Knex> {
  if (db != null) await db.destroy();
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
  const networkId: string = augur.networkId;
  if (networkId == null) throw new Error("Got null from augur.rpc.getNetworkID()");
  const networkRow: NetworkIdRow = await db.first(["networkId", "overrideTimestamp"]).from("network_id");
  if (networkRow == null || networkRow.networkId == null) {
    await db.insert({ networkId }).into("network_id");
  } else {
    const lastNetworkId: string = networkRow.networkId;
    if (networkId === lastNetworkId) {
      await db("network_id").update({ lastLaunched: db.fn.now() });
      if (networkRow.overrideTimestamp == null) return;
      return setOverrideTimestamp(db, networkRow.overrideTimestamp);
    } else {
      throw new Error(`NetworkId mismatch: current: ${networkId}, expected ${lastNetworkId}`);
    }
  }
}

async function checkAndUpdateContractUploadBlock(augur: Augur, networkId: string, databaseDir?: string): Promise<void> {
  const oldUploadBlockNumberFile = getUploadBlockPathFromNetworkId(networkId, databaseDir);
  const dbPath = getDatabasePathFromNetworkId(networkId, DB_FILE, databaseDir);
  const currentUploadBlockNumber = UploadBlockNumbers[augur.networkId];
  if (existsSync(dbPath) && existsSync(oldUploadBlockNumberFile)) {
    const oldUploadBlockNumber = Number(await promisify(readFile)(oldUploadBlockNumberFile));
    if (currentUploadBlockNumber !== oldUploadBlockNumber) {
      console.log(`Deleting existing DB for this configuration as the upload block number is not equal: OLD: ${oldUploadBlockNumber} NEW: ${currentUploadBlockNumber}`);
      await renameDatabaseFile(networkId, dbPath);
    }
  }
  await promisify(writeFile)(oldUploadBlockNumberFile, currentUploadBlockNumber);
}

export async function renameBulkSyncDatabaseFile(networkId: string, databaseDir?: string) {
  const dbPath = getDatabasePathFromNetworkId(networkId, DB_FILE, databaseDir);
  if (existsSync(dbPath)) return renameDatabaseFile(networkId, dbPath);
}

interface KnexAndPouch {
  knex: Knex;
  pouch: PouchDB.Database;
}

export async function createDbAndConnect(errorCallback: ErrorCallback|undefined, augur: Augur, network: ConnectOptions, databaseDir?: string) {
  return new Promise<KnexAndPouch>((resolve, reject) => {
    const connectOptions = Object.assign(
      { ethereumNode: { http: network.http, ws: network.ws }, startBlockStreamOnConnect: false },
      network.propagationDelayWaitMillis != null ? { propagationDelayWaitMillis: network.propagationDelayWaitMillis } : {},
      network.maxRetries != null ? { maxRetries: network.maxRetries } : {},
    );

    resolve(checkAndInitializeAugurDb(augur, databaseDir));
  });
}

export async function checkAndInitializeAugurDb(augur: Augur, databaseDir?: string): Promise<KnexAndPouch> {
  const networkId = augur.networkId;
  const knexDatabasePath = getDatabasePathFromNetworkId(networkId, DB_FILE, databaseDir);
  const pouchDatabasePath = getDatabasePathFromNetworkId(networkId, POUCH_DB_DIR, databaseDir);
  if (existsSync(knexDatabasePath)) {
    logger.info(`Found prior database: ${knexDatabasePath}`);
  }
  let db: Knex = createKnex(networkId, knexDatabasePath);
  const databaseDamaged = await isDatabaseDamaged(db);
  if (databaseDamaged) db = await getFreshDatabase(db, networkId, knexDatabasePath);
  await db.migrate.latest({ directory: path.join(__dirname, "../migrations") });
  await initializeNetworkInfo(db, augur);
  return {
    knex: db,
    pouch: new PouchDB(pouchDatabasePath),
  };
}
