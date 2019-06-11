import * as Sync from "../state/Sync";
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
import { Subscriptions } from "../subscriptions";
import { UploadBlockNumbers, Addresses } from "@augurproject/artifacts";
import { augurEmitter } from "../events";

const settings = require("@augurproject/sdk/src/state/settings.json");

export class SEOConnector extends Connector {
  private api: API;
  private events = new Subscriptions(augurEmitter);
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

    Sync.start({ adapter: "memory" }, this.ethersProvider, augur, controller.db);

    this.api = new API(augur, controller.db);
  }

  public async disconnect(): Promise<any> {
    this.ethersProvider.polling = false;
  }

  public bindTo<R, P>(f: (db: any, augur: any, params: P) => R): (params: P) => Promise<R> {
    return async (params: P): Promise<R> => {
      return this.api.route(f.name, params);
    };
  }

  public on(eventName: SubscriptionEventNames | string, callback: Callback): void {
    const subscription: string = this.events.subscribe(eventName, callback);
    console.log(subscription);
    this.subscriptions[eventName] = { id: subscription, callback };
  }

  public off(eventName: SubscriptionEventNames | string): void {
    const subscription = this.subscriptions[eventName]
    if (subscription) {
      delete this.subscriptions[eventName];
      return this.events.unsubscribe(subscription.id);
    }
  }
}
