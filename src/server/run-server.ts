import * as express from "express";
import * as WebSocket from "ws";
import * as Knex from "knex";
import Augur from "augur.js";
import { runWebsocketServer } from "./run-websocket-server";
import { getMarkets } from "./getters/get-markets";
import { Address, MarketsRow } from "../types";

// tslint:disable-next-line:no-var-requires
const { websocketConfigs } = require("../../config");

export interface RunServerResult {
  app: express.Application;
  servers: Array<WebSocket.Server>;
}

export function runServer(db: Knex, augur: Augur): RunServerResult {
  const app: express.Application = express();

  const servers: Array<WebSocket.Server> = runWebsocketServer(db, app, websocketConfigs);

  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  app.get("/status", (req, res) => {
    try {
      const networkId: string = augur.rpc.getNetworkID();
      const universe: Address = augur.contracts.addresses[networkId].Universe;

      getMarkets(db, universe, undefined, undefined, undefined, undefined, (err: Error|null, result?: any): void => {
        if (err || result.length === 0) {
          res.send( { status: "down", reason: err || "No markets found", universe });
        } else {
          res.send( { status: "up", universe } );
        }
      });
    } catch (e) {
      res.send({status: "down", reason: e});
    }
  });

  return { app, servers };
}
