import Augur from "augur.js";
import * as Knex from "knex";

import { UploadBlockNumbers, ErrorCallback } from "../types";
import { startAugurListeners } from "./start-augur-listeners";
import { downloadAugurLogs } from "./download-augur-logs";
import { setOverrideTimestamp } from "./process-block";
import { NetworkConfiguration } from "augur-core";

interface HighestBlockNumberRow {
  highestBlockNumber: number;
}

interface NetworkIDRow {
  networkID: string;
  overrideTimestamp: number|null;
}

function getNetworkID(db: Knex, augur: Augur, callback: (err?: Error|null, networkID?: string|null) => void) {
  const networkID: string = augur.rpc.getNetworkID();
  db.first(["networkID", "overrideTimestamp"]).from("network_id").asCallback((err: Error|null, networkRow?: NetworkIDRow): void => {
    if (err) return callback(err, null);
    if (networkRow == null) {
      db.insert({ networkID }).into("network_id").asCallback((err: Error|null): void => {
        callback(err, networkID);
      });
    } else {
      const lastNetworkID: string = networkRow.networkID;
      if (networkID === lastNetworkID) {
        db("network_id").update({ lastLaunched: db.fn.now() }).asCallback((err?: Error|null): void => {
          if (err) return callback(err, null);
          if (networkRow.overrideTimestamp == null) return callback(err, networkID);
          setOverrideTimestamp(db, networkRow.overrideTimestamp, (err) => callback(err, networkID));
        });
      } else {
        callback(new Error(`NetworkID mismatch: current: ${networkID}, expected ${lastNetworkID}`), null);
      }
    }
  });
}

function monitorEthereumNodeHealth(augur: Augur) {
  const networkID: string = augur.rpc.getNetworkID();
  const universe: string = augur.contracts.addresses[networkID].Universe;
  const controller: string = augur.contracts.addresses[networkID].Controller;
  setInterval(() => {
    augur.api.Universe.getController({ tx: { to: universe } }, (err: Error, universeController: string) => {
      if (err) throw err;
      if (universeController !== controller) {
        throw new Error("Controller mismatch");
      }
    });
  }, 5000);
}

export function syncAugurNodeWithBlockchain(db: Knex, augur: Augur, network: NetworkConfiguration, uploadBlockNumbers: UploadBlockNumbers, callback: ErrorCallback): void {
  augur.connect({ ethereumNode: { http: network.http, ws: network.ws }, startBlockStreamOnConnect: false }, (): void => {
    getNetworkID(db, augur, (err: Error|null, networkID: string|null) => {
      if (err) return callback(err);
      if (networkID == null) return callback(new Error("could not get networkID"));
      monitorEthereumNodeHealth(augur);
      db("blockchain_sync_history").max("highestBlockNumber as highestBlockNumber").asCallback((err: Error|null, rows?: Array<HighestBlockNumberRow>): void => {
        if (err) return callback(err);
        if (!rows || !rows.length || !rows[0]) return callback(new Error("blockchain_sync_history lookup failed"));
        const row: HighestBlockNumberRow = rows[0];
        const uploadBlockNumber: number = augur.contracts.uploadBlockNumbers[networkID] || 0;
        const highestBlockNumber: number = parseInt(augur.rpc.getCurrentBlock().number, 16) - 1;
        let fromBlock: number;
        if (uploadBlockNumber > highestBlockNumber) {
          console.log(`Synchroniation started at (${uploadBlockNumber}), which exceeds the current block from the ethereum node (${highestBlockNumber}), starting from 0 instead`);
          fromBlock = 0;
        } else {
          fromBlock = (!row || !row.highestBlockNumber) ? uploadBlockNumber : row.highestBlockNumber + 1;
        }
        downloadAugurLogs(db, augur, fromBlock, highestBlockNumber, (err?: Error|null): void => {
          if (err) return callback(err);
          db.insert({ highestBlockNumber }).into("blockchain_sync_history").asCallback(callback);
          console.log(`Finished batch load from ${fromBlock} to ${highestBlockNumber}`);
          startAugurListeners(db, augur, highestBlockNumber);
        });
      });
    });
  });
}
