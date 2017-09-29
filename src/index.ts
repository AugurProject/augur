import * as Augur from "augur.js";
import * as sqlite3 from "sqlite3";
import { AugurJs, SqlLiteDb, EthereumNodeEndpoints, FormattedLog } from "./types";
import { checkAugurDbSetup } from "./check-augur-db-setup";
import { syncAugurNodeWithBlockchain } from "./sync-augur-node-with-blockchain";
import { getMarketInfo } from "./get-market-info";
import { getAccountTransferHistory } from "./get-account-transfer-history";

const { augurDbPath, ethereumNodeEndpoints, uploadBlockNumbers } = require("../config");

sqlite3.verbose();

const db: SqlLiteDb = new sqlite3.Database(augurDbPath);
const augur: AugurJs = new Augur();

augur.rpc.setDebugOptions({ broadcast: true });

checkAugurDbSetup(db, (err?: Error|null) => {
  if (err) return console.error("checkAugurDbSetup:", err);
  syncAugurNodeWithBlockchain(db, augur, ethereumNodeEndpoints, uploadBlockNumbers, (err?: Error|null) => {
    if (err) return console.error("syncAugurNodeWithBlockchain:", err);
  });
});
