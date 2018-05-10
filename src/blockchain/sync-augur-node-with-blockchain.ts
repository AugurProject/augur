import Augur from "augur.js";
import * as Knex from "knex";

import { UploadBlockNumbers, ErrorCallback } from "../types";
import { startAugurListeners } from "./start-augur-listeners";
import { downloadAugurLogs } from "./download-augur-logs";
import { setOverrideTimestamp } from "./process-block";
import { NetworkConfiguration } from "augur-core";

const BLOCKSTREAM_HANDOFF_BLOCKS = 5;
let monitorEthereumNodeHealthId: NodeJS.Timer;

interface HighestBlockNumberRow {
  highestBlockNumber: number;
}

interface NetworkIdRow {
  networkId: string;
  overrideTimestamp: number|null;
}

function getNetworkID(db: Knex, augur: Augur, callback: (err?: Error|null, networkId?: string|null) => void) {
  const networkId: string = augur.rpc.getNetworkID();
  db.first(["networkId", "overrideTimestamp"]).from("network_id").asCallback((err: Error|null, networkRow?: NetworkIdRow): void => {
    if (err) return callback(err, null);
    if (networkRow == null) {
      db.insert({ networkId }).into("network_id").asCallback((err: Error|null): void => {
        callback(err, networkId);
      });
    } else {
      const lastNetworkId: string = networkRow.networkId;
      if (networkId === lastNetworkId) {
        db("network_id").update({ lastLaunched: db.fn.now() }).asCallback((err?: Error|null): void => {
          if (err) return callback(err, null);
          if (networkRow.overrideTimestamp == null) return callback(err, networkId);
          setOverrideTimestamp(db, networkRow.overrideTimestamp, (err) => callback(err, networkId));
        });
      } else {
        callback(new Error(`NetworkId mismatch: current: ${networkId}, expected ${lastNetworkId}`), null);
      }
    }
  });
}

function monitorEthereumNodeHealth(augur: Augur) {
  const networkId: string = augur.rpc.getNetworkID();
  const universe: string = augur.contracts.addresses[networkId].Universe;
  const controller: string = augur.contracts.addresses[networkId].Controller;
  if (monitorEthereumNodeHealthId) {
    clearInterval(monitorEthereumNodeHealthId);
  }
  monitorEthereumNodeHealthId = setInterval(() => {
    augur.api.Universe.getController({ tx: { to: universe } }, (err: Error, universeController: string) => {
      if (err) throw err;
      if (universeController !== controller) {
        throw new Error(`Controller mismatch. Configured: ${controller} Found: ${universeController}`);
      }
    });
  }, 5000);
}

export function syncAugurNodeWithBlockchain(db: Knex, augur: Augur, network: NetworkConfiguration, uploadBlockNumbers: UploadBlockNumbers, callback: ErrorCallback): void {
  augur.connect({ ethereumNode: { http: network.http, ws: network.ws }, startBlockStreamOnConnect: false }, (): void => {
    getNetworkID(db, augur, (err: Error|null, networkId: string|null) => {
      if (err) return callback(err);
      if (networkId == null) return callback(new Error("could not get networkId"));
      monitorEthereumNodeHealth(augur);
      db("blocks").max("blockNumber as highestBlockNumber").first().asCallback((err: Error|null, row?: HighestBlockNumberRow|null): void => {
        if (err) return callback(err);
        const lastSyncBlockNumber: number|null = row!.highestBlockNumber;
        const uploadBlockNumber: number = augur.contracts.uploadBlockNumbers[networkId] || 0;
        const highestBlockNumber: number = parseInt(augur.rpc.getCurrentBlock().number, 16);
        let fromBlock: number;
        if (uploadBlockNumber > highestBlockNumber) {
          console.log(`Synchronization started at (${uploadBlockNumber}), which exceeds the current block from the ethereum node (${highestBlockNumber}), starting from 0 instead`);
          fromBlock = 0;
        } else {
          fromBlock = lastSyncBlockNumber == null ? uploadBlockNumber : lastSyncBlockNumber + 1;
        }
        let handoffBlockNumber = highestBlockNumber - BLOCKSTREAM_HANDOFF_BLOCKS;
        if (handoffBlockNumber < fromBlock) {
          handoffBlockNumber = fromBlock;
          if (handoffBlockNumber > highestBlockNumber) {
            return callback(new Error(`Not enough blocks to start blockstream reliably, wait at least ${BLOCKSTREAM_HANDOFF_BLOCKS} from ${fromBlock}`));
          }
          console.warn(`Not leaving at least ${BLOCKSTREAM_HANDOFF_BLOCKS} between batch download and blockstream hand off during re-org can cause data quality issues`);
        }
        downloadAugurLogs(db, augur, fromBlock, handoffBlockNumber, (err?: Error|null): void => {
          if (err) return callback(err);
          db.insert({ highestBlockNumber }).into("blockchain_sync_history").asCallback((err: Error|null) => {
            if (err) return callback(err);
            console.log(`Finished batch load from ${fromBlock} to ${handoffBlockNumber}`);
            startAugurListeners(db, augur, handoffBlockNumber + 1, callback);
          });
        });
      });
    });
  });
}
