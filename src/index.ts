import Augur = require("augur.js");
import * as sqlite3 from "sqlite3";
import { EthereumNodeEndpoints, FormattedLog } from "./types";
import { checkAugurDbSetup } from "./check-augur-db-setup";
import { syncAugurNodeWithBlockchain } from "./sync-augur-node-with-blockchain";
import { getMarketInfo } from "./get-market-info";
import { getAccountTransferHistory } from "./get-account-transfer-history";
import { runWebsocketServer } from "./run-websocket-server";

const { augurDbPath, ethereumNodeEndpoints, uploadBlockNumbers, websocketPort } = require("../config");

sqlite3.verbose();

const db: sqlite3.Database = new sqlite3.Database(augurDbPath);
const augur: Augur = new Augur();

augur.rpc.setDebugOptions({ broadcast: false });

checkAugurDbSetup(db, (err?: Error|null) => {
  if (err) return console.error("checkAugurDbSetup:", err);
  syncAugurNodeWithBlockchain(db, augur, ethereumNodeEndpoints, uploadBlockNumbers, (err?: Error|null) => {
    if (err) return console.error("syncAugurNodeWithBlockchain:", err);
    runWebsocketServer(db, websocketPort);
  });
});
