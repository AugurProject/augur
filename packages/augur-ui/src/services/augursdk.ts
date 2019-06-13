import {Augur, Provider} from "@augurproject/sdk";
import {ContractDependenciesEthers, EthersSigner,} from "contract-dependencies-ethers";
import {WebWorkerConnector} from "./ww-connector";

import {EthersProvider} from "@augurproject/ethersjs-provider";
import {JsonRpcProvider} from "ethers/providers";
import {Addresses} from "@augurproject/artifacts";
import { listenToUpdates } from "modules/events/actions/listen-to-updates";

export class SDK {
  public sdk: Augur<Provider> | null = null;
  public isWeb3Transport: boolean = false;

  public async makeApi(
    provider: JsonRpcProvider,
    account: string = "",
    signer: EthersSigner,
    isWeb3: boolean = false,
  ) {
    this.isWeb3Transport = isWeb3;
    const ethersProvider = new EthersProvider(provider, 10, 0, 40);
    const networkId = await ethersProvider.getNetworkId();
    const contractDependencies = new ContractDependenciesEthers(
      ethersProvider,
      signer,
      account,
    );

    this.sdk = await Augur.create<Provider>(
      ethersProvider,
      contractDependencies,
      Addresses[networkId],
      new WebWorkerConnector()
    );

    this.wireUpEvents();

    // This is temporary to get SOME diagnostic info out there....
/*
    ethersProvider.on("block", ((sdk) => () => {
      sdk.getSyncData().then((syncData) => console.table({0: syncData}));
    })(this.sdk));
*/
    this.sdk.connect("http://localhost:8545", account);
  }

  public async destroy() {
    this.unwireEvents();
    if(this.sdk) this.sdk.disconnect();
    this.sdk = null;
  }

  private async wireUpEvents() {
    const events = listenToUpdates();
    Object.keys(events).map(e => {
      if (this.sdk) this.sdk.on(e, events[e]);
    })
  }

  private async unwireEvents() {
    // TODO: have sdk unwire events on disconnect
    console.log("unwiring up sdk events");
  }

  public get(): Augur<Provider> {
    if (this.sdk) {
      return this.sdk;
    }
    throw new Error("API must be initialized before use.");
  }
}

export const augurSdk = new SDK();



