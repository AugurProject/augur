import { NetworkId } from '@augurproject/artifacts';

import { configureDexieForNode } from './utils/DexieIDBShim';
import { EventEmitter } from 'events';
import { SDKConfiguration, startServer } from './create-api';
import { EndpointSettings } from './getter/types';
import * as HTTPEndpoint from './HTTPEndpoint';
import * as WebsocketEndpoint from './WebsocketEndpoint';

configureDexieForNode(false);

export async function run() {
  const settings = require("./settings.json");

  const config: SDKConfiguration = {
    networkId: NetworkId.Kovan,
    ethereum: {
      http: settings.ethNodeURLs[42],
      rpcRetryCount: 5,
      rpcRetryInterval: 0,
      rpcConcurrency: 40
    },
    gnosis: {
      http: settings.gnosisRelayURLs[42]
    },
    syncing: {
    }
  };

  const api = await startServer(config);
  const endpointSettings = {} as EndpointSettings;

  try {
    endpointSettings.httpPort = Number(process.env.HTTP_PORT) ||
      settings.endpointSettings.http.port;
  } catch {
    endpointSettings.httpPort = 9004;
  }

  try {
    endpointSettings.startHTTPS = Boolean(process.env.START_HTTPS) ||
      settings.endpointSettings.https.startHTTPS;
  } catch {
    endpointSettings.startHTTPS = false;
  }


  try {
    endpointSettings.httpsPort = Number(process.env.HTTPS_PORT) ||
      settings.endpointSettings.https.port;
  } catch {
    endpointSettings.httpsPort = 9004;
  }

  try {
    endpointSettings.wsPort = Number(process.env.WS_PORT) ||
      settings.endpointSettings.ws.port;
  } catch {
    endpointSettings.wsPort = 9004;
  }

  try {
    endpointSettings.startWSS = Boolean(process.env.START_WSS) ||
      settings.endpointSettings.wss.startWSS;
  } catch {
    endpointSettings.startWSS = false;
  }

  try {
    endpointSettings.wssPort = Number(process.env.WSS_PORT) ||
      settings.endpointSettings.wss.port;
  } catch {
    endpointSettings.wssPort = 9004;
  }

  try {
    endpointSettings.certificateFile = process.env.CERTIFICATE_FILE ||
      settings.endpointSettings.certificateInfo.certificateFile;
  } catch (error) {
    console.log(error);
    endpointSettings.certificateFile = "./certs/ssl-cert-snakeoil.pem";
  }

  try {
    endpointSettings.certificateKeyFile = process.env.CERTIFICATE_KEY_FILE ||
      settings.endpointSettings.certificateInfo.certificateKeyFile;
  } catch {
    endpointSettings.certificateKeyFile = "./certs/ssl-cert-snakeoil.pem";
  }

  console.log("Starting websocket and http endpoints");
  HTTPEndpoint.run(api, endpointSettings);
  await WebsocketEndpoint.run(api, endpointSettings, new EventEmitter());
}

run();
