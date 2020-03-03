import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import * as https from 'https';
import * as http from 'http';
import { AddressFormatReviver } from './AddressFormatReviver';
import { API } from './getter/API';
import { EndpointSettings, JsonRpcRequest } from './getter/types';
import { JsonRpcErrorCode, MakeJsonRpcError } from './MakeJsonRpcError';
import { MakeJsonRpcResponse } from './MakeJsonRpcResponse';

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
  app.use((err: { status?: number }, req: express.Request, _: express.Response, next: express.NextFunction) => {
    err.status = 404;
    next(err);
  });

  app.post('*', cors(), async (req, res) => {
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

export function runHttpServer(app: express.Application, endpointSettings: EndpointSettings): http.Server {
  const { httpPort: port } = endpointSettings;
  return app.listen(port, () => {
    console.log(`HTTP Listening on ${port}`);
  });
}

export function runHttpsServer(app: express.Application, endpointSettings: EndpointSettings): https.Server {
  const {
    certificateFile: cert,
    certificateKeyFile: key,
    httpsPort: port,
  } = endpointSettings;

  return https.createServer({cert, key}, app).listen(port, () => {
    console.log(`HTTPS listening on ${port}`);
  });
}

