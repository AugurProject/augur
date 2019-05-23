import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import https from "https";
import { AddressFormatReviver } from "./AddressFormatReviver";
import { API } from "./api/API";
import { EndpointSettings, JsonRpcRequest } from "./api/types";
import { JsonRpcErrorCode, MakeJsonRpcError } from "./MakeJsonRpcError";
import { MakeJsonRpcResponse } from "./MakeJsonRpcResponse";


export function createApp(api: API): express.Application {
  const app = express();

  app.use(helmet({
    hsts: false,
  }));

  app.use(bodyParser.json({
    reviver: AddressFormatReviver,
  }));

  app.use(cors());

  // catch 404 and forward to error handler
  app.use((err: any, req: express.Request, _: express.Response, next: express.NextFunction) => {
    err.status = 404;
    next(err);
  });

  app.post("*", cors(), async (req, res) => {
    try {
      const request = req.body as JsonRpcRequest;
      const result = await api.route(request.method, request.params);
      res.send(MakeJsonRpcResponse(req.body.id, result || null));
    } catch (err) {
      res.status(500);
      res.send(MakeJsonRpcError(req.body.id, JsonRpcErrorCode.InvalidParams, err.message, false));
    }
  });

  return app;
}

export async function run(api: API, endpointSettings: EndpointSettings): Promise<any> {
  const app = createApp(api);

  app.listen(endpointSettings.httpPort, () => {
    console.log("HTTP Listening on " + endpointSettings.httpPort);
  });

  if (endpointSettings.startHTTPS) {
    return https.createServer({
      cert: fs.readFileSync(endpointSettings.certificateFile as string),
      key: fs.readFileSync(endpointSettings.certificateKeyFile as string),
    }, app).listen(endpointSettings.httpsPort, () => {
      console.log("HTTPS listening on " + endpointSettings.httpsPort);
    });
  } else {
    return app;
  }
}
