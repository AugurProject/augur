import * as Augur from "augur.js";
import * as sqlite3 from "sqlite3";
import { AugurJs, SqlLiteDb, FormattedLog } from "./types";
import { createAugurDbTables } from "./create-augur-db-tables";
import { insertTestDataIntoAugurDb } from "./insert-test-data-into-augur-db";
import { startAugurListeners } from "./start-augur-listeners";
import { downloadAugurLogs } from "./download-augur-logs";

sqlite3.verbose();

const db: SqlLiteDb = new sqlite3.Database("./augur.db");

const ethereumNodeEndpoints: {[protocol: string]: string} = {
  http: "http://127.0.0.1:8545",
  ws: "ws://127.0.0.1:8546"
};

createAugurDbTables(db, (err?: Error|null) => insertTestDataIntoAugurDb(db, (err?: Error|null) => {
  const augur: AugurJs = new Augur();
  augur.connect(ethereumNodeEndpoints, () => startAugurListeners(db, augur, () => downloadAugurLogs(db, augur, (err?: Error|null) => {
    if (err) console.error(err);
    // example lookup...
    db.each(`SELECT * FROM transfers WHERE recipient = '0xba691ed1b3dae5b9d443c33bcad403f7f39045cd'`, (err?: Error, row?: FormattedLog) => {
      if (err) throw err;
      console.log("transfer:", row);
    });
    db.close(process.exit);
  })));
}));
