import Augur = require("augur.js");
import knex = require('knex');
import * as sqlite3 from "sqlite3";
import { EthereumNodeEndpoints, FormattedLog } from "./types";
import { checkAugurDbSetup } from "./setup/check-augur-db-setup";
import { syncAugurNodeWithBlockchain } from "./blockchain/sync-augur-node-with-blockchain";
import { runWebsocketServer } from "./server/run-websocket-server";

const { augurDbPath, ethereumNodeEndpoints, uploadBlockNumbers, websocketPort } = require("../config");

var db: Knex;
if(process.env['DATABASE'] == null) {
  sqlite3.verbose();
  db = knex({
    client: 'sqlite3',
    connection: {
      filename: augurDbPath
    }
  });
} else {
  db = knex({
    client: 'pg',
    connection: process.env['DATABASE']
  });
}

const augur: Augur = new Augur();

augur.rpc.setDebugOptions({ broadcast: false });

// Run Migrations?
syncAugurNodeWithBlockchain(db, augur, ethereumNodeEndpoints, uploadBlockNumbers, (err?: Error|null) => {
  if (err) return console.error("syncAugurNodeWithBlockchain:", err);
  runWebsocketServer(db, websocketPort);
});
