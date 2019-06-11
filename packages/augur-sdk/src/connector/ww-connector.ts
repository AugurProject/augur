import RunWorker from "../state//Sync.worker";

import { API } from "../state/getter/API";
import { Augur } from "../Augur";
import { BlockAndLogStreamerListener } from "../state/db/BlockAndLogStreamerListener";
import { Connector, Callback } from "./connector";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { Controller } from "../state/Controller";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { EventLogDBRouter } from "../state//db/EventLogDBRouter";
import { JsonRpcProvider } from "ethers/providers";
import { PouchDBFactory } from "../state//db/AbstractDB";
import { SubscriptionEventNames } from "../constants";
import { UploadBlockNumbers, Addresses } from "@augurproject/artifacts";

const settings = require("@augurproject/sdk/src/state/settings.json");

export class WebWorkerConnector extends Connector {
  private api: API;
  private worker: any;
  private ethersProvider: EthersProvider;

  public async connect(params?: any): Promise<any> {
    this.ethersProvider = params.provider ? params.provider : new EthersProvider(new JsonRpcProvider(settings.addresses[4]), 10, 0, 40);

    const contractDependencies = new ContractDependenciesEthers(this.ethersProvider, undefined, settings.testAccounts[0]);
    const augur = params.augur ? params.augur : await Augur.create(this.ethersProvider, contractDependencies, Addresses[4]);

    const pouchDBFactory = PouchDBFactory({ adapter: "memory" });
    const eventLogDBRouter = new EventLogDBRouter(augur.events.parseLogs);
    const blockAndLogStreamerListener = BlockAndLogStreamerListener.create(this.ethersProvider, eventLogDBRouter, Addresses.Augur, augur.events.getEventTopics);
    const controller = new Controller(augur, Number(augur.networkId), settings.blockstreamDelay, UploadBlockNumbers[augur.networkId], [settings.testAccounts[0]], pouchDBFactory, blockAndLogStreamerListener);

    if (params.db) {
      controller.db = params.db;
    } else {
      await controller.createDb();
    }

    this.api = new API(augur, controller.db);
    this.worker = params.worker ? params.worker : new RunWorker();

    this.worker.onmessage = (event: MessageEvent) => {
      try {
        this.messageReceived(event.data);
      } catch (error) {
        console.error("Bad Web Worker response: " + event);
      }
    };
  }

  public messageReceived(message: any) {
    if (message.subscribed) {
      this.subscriptions[message.subscribed].id = message.subscription;
    } else {
      if (this.subscriptions[message.eventName]) {
        this.subscriptions[message.eventName].callback(...(message.result));
      }
    }
  }

  public async disconnect(): Promise<any> {
    this.worker.terminate();
  }

  public bindTo<R, P>(f: (db: any, augur: any, params: P) => R): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return this.api.route(f.name, params);
    };
  }

  public on(eventName: SubscriptionEventNames | string, callback: Callback): void {
    this.subscriptions[eventName] = { id: "", callback };
    this.worker.postMessage({ subscribe: eventName });
  }

  public off(eventName: SubscriptionEventNames | string): void {
    const subscription = this.subscriptions[eventName];
    if (subscription) {
      delete this.subscriptions[eventName];
      this.worker.postMessage({ unsubscribe: subscription.id });
    }
  }
}
