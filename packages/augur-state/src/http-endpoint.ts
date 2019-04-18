import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import https from "https";

import { API } from "./api/API";
import { JsonRpcRequest, EndpointSettings } from "./api/types";
import { addressFormatReviver } from "./address-format-reviver";
import { makeJsonRpcError, JsonRpcErrorCode } from "./make-json-rpc-error";
import { makeJsonRpcResponse } from "./make-json-rpc-response";

const settings = require("@augurproject/state/src/settings.json");

export async function run<TBigNumber>(api: API<TBigNumber>, endpointSettings: EndpointSettings): Promise<any> {
  const app = express();

  app.use(helmet({
    hsts: false,
  }));

  app.use(bodyParser.json({
    reviver: addressFormatReviver,
  }));

  app.use(cors());

  // catch 404 and forward to error handler
  app.use(function(err: any, req: express.Request, _: express.Response, next: express.NextFunction) {
    err.status = 404;
    next(err);
  });

  app.post("*", cors(), async (req, res) => {
    try {
      const request = req.body as JsonRpcRequest;
      const result = await api.route(request.method, request.params);
      res.send(makeJsonRpcResponse(req.body.id, result || null));
    } catch (err) {
      res.status(500);
      res.send(makeJsonRpcError(req.body.id, JsonRpcErrorCode.InvalidParams, err.message, false));
    }
  });

  app.listen(endpointSettings.httpPort, () => {
    console.log("HTTP Listening on " + endpointSettings.httpPort);
  });

  return https.createServer({
    cert: fs.readFileSync(endpointSettings.certificateFile),
    key: fs.readFileSync(endpointSettings.certificateKeyFile),
  }, app).listen(endpointSettings.httpsPort, () => {
    console.log("HTTPS listening on " + endpointSettings.httpsPort);
  });
}
