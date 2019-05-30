import RunWorker from "../state//Sync.worker";

import { API } from "../state/api/API";
import { Augur } from "../Augur";
import { BlockAndLogStreamerListener } from "../state/db/BlockAndLogStreamerListener";
import { Connector, Callback } from "./connector";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { DB } from "../state//db/DB";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { EventLogDBRouter } from "../state//db/EventLogDBRouter";
import { JsonRpcProvider } from "ethers/providers";
import { PouchDBFactory } from "../state//db/AbstractDB";
import { SubscriptionEventNames } from "../constants";
import { UploadBlockNumbers, Addresses } from "@augurproject/artifacts";
import { Controller } from "../state/Controller";

const settings = require("@augurproject/sdk/src/state/settings.json");

export class WebWorkerConnector extends Connector {
  private api: API;
  private worker: any;
  private callback: Callback;

  public async connect(params?: any): Promise<any> {
    const ethersProvider = new EthersProvider(new JsonRpcProvider(settings.ethNodeURLs[4]), 10, 0, 40);
    const contractDependencies = new ContractDependenciesEthers(ethersProvider, undefined, settings.testAccounts[0]);
    const augur = await Augur.create(ethersProvider, contractDependencies, Addresses[4]);
    const pouchDBFactory = PouchDBFactory({});
    const eventLogDBRouter = new EventLogDBRouter(augur.events.parseLogs);
    const blockAndLogStreamerListener = BlockAndLogStreamerListener.create(ethersProvider, eventLogDBRouter, Addresses.Augur, augur.events.getEventTopics);
    const controller = new Controller(augur, Number(augur.networkId), settings.blockstreamDelay, UploadBlockNumbers[augur.networkId], [settings.testAccounts[0]], pouchDBFactory, blockAndLogStreamerListener);
    await controller.createDb();

    this.api = new API(augur, controller.db);
    this.worker = new RunWorker();

    this.worker.onmessage = (event: MessageEvent) => {
      console.log("Worker message");
      console.log(event.data);
      this.callback(event);
    };
  }

  public async disconnect(): Promise<any> {
    this.worker.terminate();
  }

  public bindTo<R, P>(f: (db: any, augur: any, params: P) => R): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return this.api.route(f.name, params);
    };
  }

  public async subscribe(event: SubscriptionEventNames, callback: Callback): Promise<any> {
    this.callback = callback;
    this.worker.postMessage({ subscribe: event });
  }

  public async unsubscribe(subscription: string): Promise<any> {
    this.worker.postMessage({ unsubscribe: subscription });
  }
}
