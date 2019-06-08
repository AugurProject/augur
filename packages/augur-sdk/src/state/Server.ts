import * as HTTPEndpoint from "./HTTPEndpoint";
import * as Sync from "./Sync";
import * as WebsocketEndpoint from "./WebsocketEndpoint";
import {EndpointSettings} from "./getter/types";
import {EventEmitter} from "events";

export async function run() {
  const settings = require("@augurproject/sdk/src/state/settings.json");

  const api = await Sync.start(settings.ethNodeURLs[4], settings.testAccounts[0]);
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
