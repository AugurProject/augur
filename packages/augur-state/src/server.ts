import * as Sync from "./sync";
import * as HttpEndpoint from "./http-endpoint";
import * as WebSocketEndpoint from "./web-socket-endpoint";
import { API } from "./api/API";
import { Augur } from "@augurproject/api";
import { BigNumber as EthersBigNumber } from "ethers/utils";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { DB } from "./db/DB";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { JsonRpcProvider } from "ethers/providers";
import { PouchDBFactory } from "./db/AbstractDB";
import { addresses } from "@augurproject/artifacts";
import { EndpointSettings } from "./api/types";

export async function run() {
  const settings = require("@augurproject/state/src/settings.json");

  const ethersProvider = new EthersProvider(new JsonRpcProvider(settings.ethNodeURLs[4]), 10, 0, 40);
  const contractDependencies = new ContractDependenciesEthers(ethersProvider, undefined, settings.testAccounts[0]);
  const augur = await Augur.create(ethersProvider, contractDependencies, addresses[4]);

  const pouchDBFactory = PouchDBFactory({});

  const db = new DB<EthersBigNumber>(pouchDBFactory);
  const api = new API(augur, db);
  const endpointSettings = {} as EndpointSettings;

  try {
    endpointSettings.httpPort = Number(process.env["HTTP_PORT".toString()]) ||
      settings.endpointConfigs.http.port;
  } catch {
    endpointSettings.httpPort = 9004;
  }

  try {
    endpointSettings.httpsPort = Number(process.env["HTTP_PORT".toString()]) ||
      settings.endpointConfigs.https.port;
  } catch {
    endpointSettings.httpsPort = 9004;
  }

  try {
    endpointSettings.wsPort = Number(process.env["HTTP_PORT".toString()]) ||
      settings.endpointConfigs.https.port;
  } catch {
    endpointSettings.wsPort = 9004;
  }

  try {
    endpointSettings.wssPort = Number(process.env["HTTP_PORT".toString()]) ||
      settings.endpointConfigs.https.port;
  } catch {
    endpointSettings.wssPort = 9004;
  }

  try {
    endpointSettings.certificateFile = process.env["CERTIFICATE_FILE".toString()] ||
      settings.endpointConfigs.certificateInfo.certificateFile;
  } catch {
    endpointSettings.certificateFile = "./certs/ssl-cert-snakeoil.cert";
  }

  try {
    endpointSettings.certificateKeyFile = process.env["CERTIFICATE_KEY_FILE".toString()] ||
      settings.endpointConfigs.certificateInfo.certificateKeyFile;
  } catch {
    endpointSettings.certificateKeyFile = "./certs/ssl-cert-snakeoil.cert";
  }

  Sync.start();
  console.log("Starting websocket and http endpoints");
  //WebSocketEndpoint.run(api, endpointSettings);
  await HttpEndpoint.run(api, endpointSettings);
}

run();
