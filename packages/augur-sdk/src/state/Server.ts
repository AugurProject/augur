import * as Sync from "./Sync";
import * as HTTPEndpoint from "./HTTPEndpoint";
import * as WebsocketEndpoint from "./WebsocketEndpoint";
import { API } from "./api/API";
import { Augur } from "../Augur";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { DB } from "./db/DB";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { JsonRpcProvider } from "ethers/providers";
import { PouchDBFactory } from "./db/AbstractDB";
import { Addresses } from "@augurproject/artifacts";
import { EndpointSettings } from "./api/types";

export async function run() {
  const settings = require("@augurproject/sdk/src/state/settings.json");

  const ethersProvider = new EthersProvider(new JsonRpcProvider(settings.ethNodeURLs[4]), 10, 0, 40);
  const contractDependencies = new ContractDependenciesEthers(ethersProvider, undefined, settings.testAccounts[0]);
  const augur = await Augur.create(ethersProvider, contractDependencies, Addresses[4]);

  const pouchDBFactory = PouchDBFactory({});

  const db = new DB(pouchDBFactory);
  const api = new API(augur, db);
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

  Sync.start();
  console.log("Starting websocket and http endpoints");
  HTTPEndpoint.run(api, endpointSettings);
  await WebsocketEndpoint.run(api, endpointSettings);
}

run();
