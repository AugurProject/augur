import Augur = require("augur.js");
import * as Knex from "knex";
import * as sqlite3 from "sqlite3";
import { EthereumNodeEndpoints, FormattedLog } from "./types";
import { checkAugurDbSetup } from "./setup/check-augur-db-setup";
import { syncAugurNodeWithBlockchain } from "./blockchain/sync-augur-node-with-blockchain";
import { runWebsocketServer } from "./server/run-websocket-server";
import { ErrorCallback } from "./types";

// tslint:disable-next-line:no-var-requires
const { augurDbPath, ethereumNodeEndpoints, uploadBlockNumbers, websocketPort } = require("../config");

<<<<<<< HEAD
let db: Knex;
if (process.env.DATABASE) {
  db = Knex({
    client: "pg",
    connection: process.env.DATABASE
  });
} else {
=======
var db: Knex;
if (process.env["DATABASE"] == null) {
>>>>>>> master
  sqlite3.verbose();
  db = Knex({
    client: "sqlite3",
    connection: {
      filename: augurDbPath
    },
<<<<<<< HEAD
    acquireConnectionTimeout: 5 * 60 * 1000
=======
    acquireConnectionTimeout: 5*60*1000
  });
} else {
  db = Knex({
    client: "pg",
    connection: process.env["DATABASE"]
>>>>>>> master
  });
}

const augur: Augur = new Augur();

augur.rpc.setDebugOptions({ broadcast: false });

checkAugurDbSetup(db, (err?: Error|null)  => {
  syncAugurNodeWithBlockchain(db, augur, ethereumNodeEndpoints, uploadBlockNumbers, (err?: Error|null) => {
    if (err) return console.error("syncAugurNodeWithBlockchain:", err);
    console.log("Sync with blockchain complete, starting websocket server...");
    runWebsocketServer(db, websocketPort);
  });
});
