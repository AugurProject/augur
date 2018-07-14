import Augur from "augur.js";
import * as Knex from "knex";
import { NetworkConfiguration } from "augur-core";
import { runServer, RunServerResult, shutdownServers } from "./server/run-server";
import { bulkSyncAugurNodeWithBlockchain } from "./blockchain/bulk-sync-augur-node-with-blockchain";
import { startAugurListeners } from "./blockchain/start-augur-listeners";
import { createDbAndConnect, renameDatabaseFile, saveBulkSyncDatabase } from "./setup/check-and-initialize-augur-db";
import { clearOverrideTimestamp } from "./blockchain/process-block";
import { processQueue } from "./blockchain/process-queue";
import { ConnectOptions, ErrorCallback } from "./types";
import { EventEmitter } from "events";
import { ControlMessageType } from "./constants";
import { logger } from "./utils/logger";
import { LoggerInterface } from "./utils/logger/logger";

export interface SyncedBlockInfo {
  lastSyncBlockNumber: number;
  uploadBlockNumber: number;
  highestBlockNumber: number;
}

export class AugurNodeController {
  private augur: Augur;
  private networkConfig: NetworkConfiguration;
  private databaseDir: string | undefined;
  private running: boolean;
  private controlEmitter: EventEmitter;
  private db: Knex | undefined;
  private serverResult: RunServerResult | undefined;
  private errorCallback: ErrorCallback | undefined;
  private logger = logger;

  constructor(augur: Augur, networkConfig: ConnectOptions, databaseDir?: string) {
    this.augur = augur;
    this.networkConfig = networkConfig;
    this.databaseDir = databaseDir;
    this.running = false;
    this.controlEmitter = new EventEmitter();
  }

  public async start(errorCallback: ErrorCallback | undefined) {
    this.running = true;
    this.errorCallback = errorCallback;
    try {
      this.db = await createDbAndConnect(errorCallback, this.augur, this.networkConfig, this.databaseDir);
      this.controlEmitter.emit(ControlMessageType.BulkSyncStarted);
      const handoffBlockNumber = await bulkSyncAugurNodeWithBlockchain(this.db, this.augur);
      await saveBulkSyncDatabase(this.augur.rpc.getNetworkID(), this.databaseDir);
      this.controlEmitter.emit(ControlMessageType.BulkSyncFinished);
      this.logger.info("Bulk sync with blockchain complete.");
      processQueue.kill();
      this.serverResult = runServer(this.db, this.augur, this.controlEmitter);
      startAugurListeners(this.db, this.augur, handoffBlockNumber + 1, this.shutdownCallback.bind(this));
      processQueue.resume();
    } catch (err) {
      if (this.errorCallback) this.errorCallback(err);
    }
  }

  public shutdown(errorCallback: ErrorCallback | undefined) {
    try {
      if (!this.running) return;
      this.running = false;
      this.logger.info("Stopping Augur Node Server");
      processQueue.pause();
      if (this.serverResult !== undefined) {
        const servers = this.serverResult.servers;
        shutdownServers(servers);
        this.serverResult = undefined;
      }
      if (this.db !== undefined) {
        this.db.destroy();
        this.db = undefined;
      }
      clearOverrideTimestamp();
      // When we have real shutdown feature in augur.js and ethrpc, implement here.
      this.augur = new Augur();
      this.logger.clear();
      if (errorCallback) errorCallback(null);
    } catch (err) {
      if (errorCallback) errorCallback(err);
    }
  }

  public isRunning() {
    return this.running && this.db != null;
  }

  public async requestLatestSyncedBlock(): Promise<SyncedBlockInfo> {
    if (!this.running || this.db == null) throw new Error("Not running");
    const row: { highestBlockNumber: number } = await this.db("blocks").max("blockNumber as highestBlockNumber").first();
    const lastSyncBlockNumber = row.highestBlockNumber;
    const currentBlock = this.augur.rpc.getCurrentBlock();
    if (currentBlock === null) {
      throw new Error("No Current Block");
    }
    const highestBlockNumber = parseInt(this.augur.rpc.getCurrentBlock().number, 16);
    const uploadBlockNumber = this.augur.contracts.uploadBlockNumbers[this.augur.rpc.getNetworkID()];
    return ({ lastSyncBlockNumber, uploadBlockNumber, highestBlockNumber });
  }

  public async resetDatabase(id: string, errorCallback: ErrorCallback | undefined) {
    let networkId = id || "1";
    try {
      if (this.augur != null) {
        const fetchedNetworkId = this.augur.rpc.getNetworkID();
        if (fetchedNetworkId) {
          networkId = fetchedNetworkId;
        }
      }
      if (this.isRunning()) {
        this.shutdown(async (err: Error|null) => {
          await renameDatabaseFile(networkId, this.databaseDir).catch(errorCallback);
          return;
        });
      } else {
        await renameDatabaseFile(networkId, this.databaseDir).catch(errorCallback);
      }
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

  private shutdownCallback(err: Error|null) {
    if (err == null) return;
    this.logger.error("Fatal Error, shutting down servers", err);
    if (this.errorCallback) this.errorCallback(err);
    if (this.serverResult !== undefined) shutdownServers(this.serverResult.servers);
    process.exit(1);
  }
}
