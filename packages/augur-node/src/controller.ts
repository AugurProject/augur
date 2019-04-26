import { Augur, ErrorCallback, GenericCallback } from "./types";
import { UploadBlockNumbers } from "@augurproject/artifacts";

import Knex from "knex";
import * as path from "path";
import { EventEmitter } from "events";
import { runServer, RunServerResult, shutdownServers } from "./server/run-server";
import { startAugurListeners } from "./blockchain/start-augur-listeners";
import { createDbAndConnect, renameBulkSyncDatabaseFile } from "./setup/check-and-initialize-augur-db";
import { ControlMessageType, DB_FILE, DB_VERSION, NETWORK_NAMES } from "./constants";
import { logger } from "./utils/logger";
import { format } from "util";
import { getFileHash } from "./sync/file-operations";
import { BackupRestore } from "./sync/backup-restore";
import { ConnectOptions } from "./setup/connectOptions";
import { LoggerInterface } from "./utils/logger/logger";
import { clearOverrideTimestamp } from "./blockchain/process-block";
import { BlockAndLogStreamerListener } from "@augurproject/state/build/db/BlockAndLogStreamerListener";
import { bulkSyncAugurNodeWithBlockchain } from "./blockchain/bulk-sync-augur-node-with-blockchain";

export interface SyncedBlockInfo {
  lastSyncBlockNumber: number;
  uploadBlockNumber: number;
  highestBlockNumber: number;
}

export class AugurNodeController {
  private augur: Augur;
  private networkConfig: ConnectOptions;
  private isWarpSync: boolean;
  private databaseDir: string;
  private running: boolean;
  private controlEmitter: EventEmitter;
  private db: Knex | undefined;
  private serverResult: RunServerResult | undefined;
  private errorCallback: ErrorCallback | undefined;
  private logger = logger;
  private blockAndLogsQueue: BlockAndLogStreamerListener | undefined;

  constructor(augur: Augur, networkConfig: ConnectOptions, databaseDir: string = ".", isWarpSync: boolean = false) {
    this.augur = augur;
    this.networkConfig = networkConfig;
    this.isWarpSync = isWarpSync;
    this.databaseDir = databaseDir;
    this.running = false;
    this.controlEmitter = new EventEmitter();
  }

  public async start(errorCallback: ErrorCallback | undefined) {
    this.running = true;
    this.errorCallback = errorCallback;
    try {
      ({knex: this.db } = await createDbAndConnect(errorCallback, this.augur, this.networkConfig, this.databaseDir));
      this.controlEmitter.emit(ControlMessageType.BulkSyncStarted);

      const handoffBlockNumber = await bulkSyncAugurNodeWithBlockchain(this.db, this.augur, 720);
      this.controlEmitter.emit(ControlMessageType.BulkSyncFinished);

      this.serverResult = runServer(this.db, this.augur, this.controlEmitter);
      this.logger.info("Bulk sync with blockchain complete.");
      // We received a shutdown so just return.
      if (!this.isRunning()) return;
      this.logger.info("Bulk orphaned orders check with blockchain complete.");
      // We received a shutdown so just return.
      if (!this.isRunning()) return;
      this.blockAndLogsQueue = await startAugurListeners(this.augur);

      this.blockAndLogsQueue.startBlockStreamListener();
    } catch (err) {
      if (this.errorCallback) this.errorCallback(err);
    }
  }

  public async warpSync(filename: string, errorCallback: ErrorCallback | undefined, infoCallback: GenericCallback<string>) {
    try {
      this.logger.info(format("importing warp sync file %s", filename));
      if (this.isRunning()) await this.shutdown();
      const baseName = path.basename(filename);
      const split = baseName.split("-");
      const fileNetworkId = split[1];
      const networkId = parseInt(fileNetworkId, 10);
      const networkName = NETWORK_NAMES[networkId];
      const fileHash = getFileHash(filename);
      if (baseName.startsWith(fileHash)) {
        await renameBulkSyncDatabaseFile(fileNetworkId, this.databaseDir);
        infoCallback(null, format("importing file %s for network %s", baseName, networkName));
        await BackupRestore.import(DB_FILE, fileNetworkId, DB_VERSION, filename, this.databaseDir);
        infoCallback(null, format("Finished importing warp sync file for network %s", networkName));
      } else if (errorCallback) {
        this.logger.error("Error, import warp sync file hash mismatch");
        errorCallback(new Error("file hash and contents hashed do not match"));
      }
    } catch (err) {
      this.logger.error("Fatal Error, import warp sync file failed", err);
      if (errorCallback) errorCallback(err);
    }
  }

  public async shutdown() {
    try {
      await this._shutdown();
    } catch (err) {
      if (this.errorCallback) this.errorCallback(err);
    }
  }

  public isRunning() {
    return this.running && this.db != null;
  }

  public async requestLatestSyncedBlock(): Promise<SyncedBlockInfo> {
    if (!this.running || this.db == null) throw new Error("Not running");
    const row: { highestBlockNumber: number } = await this.db("blocks")
      .max("blockNumber as highestBlockNumber")
      .first();
    const lastSyncBlockNumber = row.highestBlockNumber;
    const currentBlock = await this.augur.provider.getBlockNumber();
    if (currentBlock === null) {
      throw new Error("No Current Block");
    }
    const highestBlockNumber = parseInt(`${await this.augur.provider.getBlockNumber()}`, 16);
    const uploadBlockNumber = UploadBlockNumbers[this.augur.networkId];
    return {lastSyncBlockNumber, uploadBlockNumber, highestBlockNumber};
  }

  public async resetDatabase(id: string, errorCallback: ErrorCallback | undefined) {
    let networkId = id || "1";
    try {
      if (this.augur != null && this.augur.networkId) {
        networkId = this.augur.networkId;
      }
      if (this.isRunning()) await this._shutdown();
      await renameBulkSyncDatabaseFile(networkId, this.databaseDir);
    } catch (err) {
      if (errorCallback) errorCallback(err);
    }
  }

  public addLogger(logger: LoggerInterface) {
    this.logger.addLogger(logger);
  }

  public clearLoggers() {
    this.logger.clear();
  }

  private _shutdownCallback(err: Error | null) {
    if (err == null) return;
    this.logger.error("Fatal Error, shutting down servers", err);
    if (this.errorCallback) this.errorCallback(err);
    if (this.serverResult !== undefined) shutdownServers(this.serverResult.servers);
    process.exit(1);
  }

  private async _shutdown() {
    if (!this.running) return;
    this.running = false;
    this.logger.info("Stopping Augur Node Server");
    if (this.blockAndLogsQueue !== undefined) {
      this.blockAndLogsQueue = undefined;
    }
    if (this.serverResult !== undefined) {
      const servers = this.serverResult.servers;
      shutdownServers(servers);
      this.serverResult = undefined;
    }
    if (this.db !== undefined) {
      await this.db.destroy();
      this.db = undefined;
    }
    clearOverrideTimestamp();
    this.logger.clear();
  }
}
