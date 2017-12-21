import Augur from "augur.js";
import * as express from "express";
import * as WebSocket from "ws";
import * as Knex from "knex";
import * as sqlite3 from "sqlite3";
import * as _ from "lodash";
import { EthereumNodeEndpoints, FormattedEventLog } from "./types";
import { checkAugurDbSetup } from "./setup/check-augur-db-setup";
import { syncAugurNodeWithBlockchain } from "./blockchain/sync-augur-node-with-blockchain";
import { runWebsocketServer } from "./server/run-websocket-server";
import { ErrorCallback } from "./types";

// tslint:disable-next-line:no-var-requires
const {augurDbPath, ethereumNodeEndpoints, uploadBlockNumbers, websocketConfigs } = require("../config");

let db: Knex;
if (process.env.DATABASE_URL) {
  db = Knex({
    client: "pg",
    connection: process.env.DATABASE_URL,
  });
} else {
  sqlite3.verbose();
  db = Knex({
    client: "sqlite3",
    connection: {
      filename: augurDbPath,
    },
    acquireConnectionTimeout: 5 * 60 * 1000,
    useNullAsDefault: true,
  });
}

const envEndpoints: EthereumNodeEndpoints = _.omitBy({
  http: process.env.ENDPOINT_HTTP,
  ws: process.env.ENDPOINT_WS,
}, _.isNil);

const configuredEndpoints: EthereumNodeEndpoints = _.isEmpty(envEndpoints) ? ethereumNodeEndpoints : envEndpoints;

const app = express();
const websocketServers: Array<WebSocket.Server> = runWebsocketServer(db, app, websocketConfigs);

const augur: Augur = new Augur();

augur.rpc.setDebugOptions({ broadcast: false });

checkAugurDbSetup(db, (err?: Error|null): void => {
  if (err) {
    console.error("checkAugurDbSetup:", err);
    websocketServers.forEach((websocketServer) => websocketServer.close());
    process.exit(1);
  }
  syncAugurNodeWithBlockchain(db, augur, configuredEndpoints, uploadBlockNumbers, (err?: Error|null): void => {
    if (err) {
      console.error("syncAugurNodeWithBlockchain:", err);
      websocketServers.forEach((websocketServer) => websocketServer.close());
      process.exit(1);
    }
    console.log("Sync with blockchain complete.");
  });
});
