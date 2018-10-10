import * as express from "express";
import * as Knex from "knex";
import * as helmet from "helmet";
import Augur from "augur.js";
import { Address, ErrorCallback, ServersData } from "../types";
import { runWebsocketServer } from "./run-websocket-server";
import { getMarkets } from "./getters/get-markets";
import { isSyncFinished } from "../blockchain/bulk-sync-augur-node-with-blockchain";
import { EventEmitter } from "events";

// tslint:disable-next-line:no-var-requires
const { websocketConfigs } = require("../../config");

export interface RunServerResult {
  app: express.Application;
  servers: ServersData;
}

export function runServer(db: Knex, augur: Augur, controlEmitter: EventEmitter = new EventEmitter()): RunServerResult {
  const app: express.Application = express();

  app.use(helmet({
    hsts: false,
  }));

  const servers: ServersData = runWebsocketServer(db, app, augur, websocketConfigs, controlEmitter);

  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  app.get("/status", (req, res) => {
    try {
      const networkId: string = augur.rpc.getNetworkID();
      const universe: Address = augur.contracts.addresses[networkId].Universe;

      getMarkets(db, universe, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, (err: Error | null, result?: any): void => {
        if (err || result.length === 0) {
          res.send({ status: "down", reason: err || "No markets found", universe });
        } else {
          res.send({ status: "up", universe });
        }
      });
    } catch (e) {
      res.send({ status: "down", reason: e.message });
    }
  });

  app.get("/status/database", (req, res) => {
    const maxPendingTransactions: number = (typeof req.query.max_pending_transactions === "undefined") ? 1 : parseInt(req.query.max_pending_transactions, 10);
    if (isNaN(maxPendingTransactions)) {
      res.status(422).send({ error: "Bad value for max_pending_transactions, must be an integer in base 10" });
    } else {
      const waitingClientsCount = db.client.pool.pendingAcquires.length;
      res.send({
        status: (maxPendingTransactions > waitingClientsCount) ? "up" : "down",
        maxPendingTransactions,
        pendingTransactions: waitingClientsCount,
      });
    }
  });

  app.get("/status/blockage", (req, res) => {
    db("blocks").orderBy("blockNumber", "DESC").first().asCallback((err: Error, newestBlock: any) => {
      if (err) return res.status(500).send({ error: err.message });
      if (newestBlock == null) return res.status(500).send({ error: "No blocks available" });
      const timestampDelta: number = Math.round((Date.now() / 1000) - newestBlock.timestamp);
      const timestampDeltaThreshold = (typeof req.query.time === "undefined") ? 120 : parseInt(req.query.time, 10);
      if (isNaN(timestampDeltaThreshold)) {
        res.status(422).send({ error: "Bad value for time parameter, must be an integer in base 10" });
      }
      const status = timestampDelta > timestampDeltaThreshold ? "down" : "up";
      return res.status(status === "up" ? 200 : 500).send(Object.assign({ status, timestampDelta }, newestBlock));
    });
  });

  app.get("/status/sync", (req, res) => {
    const finishedSync = isSyncFinished();
    if (!finishedSync) return res.status(500).send({ error: "Not finished with sync" });
    return res.status(200).send({ status: "Finished with sync" });
  });

  return { app, servers };
}

export function shutdownServers(servers: ServersData) {
  servers.httpServers.forEach((server, index) => {
    server.close(() => servers.servers[index].close());
  });
}
