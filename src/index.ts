import Augur = require("augur.js");
import * as sqlite3 from "sqlite3";
import { EthereumNodeEndpoints, FormattedLog } from "./types";
import { checkAugurDbSetup } from "./setup/check-augur-db-setup";
import { syncAugurNodeWithBlockchain } from "./blockchain/sync-augur-node-with-blockchain";
import { runWebsocketServer } from "./server/run-websocket-server";

const { augurDbPath, ethereumNodeEndpoints, uploadBlockNumbers, websocketPort } = require("../config");

sqlite3.verbose();

const db: sqlite3.Database = new sqlite3.Database(augurDbPath);
const augur: Augur = new Augur();

augur.rpc.setDebugOptions({ broadcast: false });

checkAugurDbSetup(db, (err?: Error|null) => {
  if (err) return console.error("checkAugurDbSetup:", err);
  syncAugurNodeWithBlockchain(db, augur, ethereumNodeEndpoints, uploadBlockNumbers, (err?: Error|null) => {
    if (err) return console.error("syncAugurNodeWithBlockchain:", err);
    console.log("Sync with blockchain complete, starting websocket server...");
    runWebsocketServer(db, websocketPort);
  });
});
