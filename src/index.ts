import Augur from "augur.js";
import * as Knex from "knex";
import { NetworkConfiguration } from "augur-core";
import { bulkSyncAugurNodeWithBlockchain } from "./blockchain/bulk-sync-augur-node-with-blockchain";
import { runServer, shutdownServersCallback } from "./server/run-server";
import { startAugurListeners } from "./blockchain/start-augur-listeners";
import { createDbAndConnect } from "./setup/check-and-initialize-augur-db";

const networkName = process.argv[2] || "environment";
const networkConfig = NetworkConfiguration.create(networkName);

const augur: Augur = new Augur();

augur.rpc.setDebugOptions({ broadcast: false });
augur.events.nodes.ethereum.on("disconnect", (event) => {
  console.warn("Disconnected from Ethereum node", event);
  throw new Error("Disconnected from Ethereum node");
});

createDbAndConnect(augur, networkConfig).then(async (db: Knex) => {
  const handoffBlockNumber = await bulkSyncAugurNodeWithBlockchain(db, augur);
  console.log("Bulk sync with blockchain complete.");
  const { servers } = runServer(db, augur);
  startAugurListeners(db, augur, handoffBlockNumber + 1, shutdownServersCallback(servers));
}).catch((err: any) => {
  console.error("Fatal Error:", err);
  process.exit(1);
});
