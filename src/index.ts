import * as Augur from "augur.js";
import * as sqlite3 from "sqlite3";
import { AugurJs, SqlLiteDb, EthereumNodeEndpoints, FormattedLog } from "./types";
import { checkAugurDbSetup } from "./check-augur-db-setup";
import { syncAugurNodeWithBlockchain } from "./sync-augur-node-with-blockchain";

const { augurDbPath, ethereumNodeEndpoints, uploadBlockNumbers } = require("../config");

sqlite3.verbose();

const db: SqlLiteDb = new sqlite3.Database(augurDbPath);
const augur: AugurJs = new Augur();

checkAugurDbSetup(db, (err?: Error|null) => {  
  syncAugurNodeWithBlockchain(db, augur, ethereumNodeEndpoints, uploadBlockNumbers, (err?: Error|null) => {
    if (err) console.error(err);
    db.each(`SELECT * FROM transfers WHERE recipient = '0xba691ed1b3dae5b9d443c33bcad403f7f39045cd'`, (err?: Error|null, row?: FormattedLog) => {
      if (err) throw err;
      console.log("transfer:", row);
    });
    db.each(`SELECT * FROM blockchain_sync_history`, (err?: Error, row?: Object) => {
      if (err) throw err;
      console.log("sync:", row);
    });
    db.close(process.exit);
  });
});

function getMarketInfo(marketId) {
  
}
