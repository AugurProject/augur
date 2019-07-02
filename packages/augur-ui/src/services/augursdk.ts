import {Augur, Provider} from "@augurproject/sdk";
import {ContractDependenciesEthers, EthersSigner,} from "contract-dependencies-ethers";
import {WebWorkerConnector} from "./ww-connector";

import {EthersProvider} from "@augurproject/ethersjs-provider";
import {JsonRpcProvider} from "ethers/providers";
import {Addresses} from "@augurproject/artifacts";
import { EnvObject } from "modules/types";

export class SDK {
  public sdk: Augur<Provider> | null = null;
  public isWeb3Transport: boolean = false;

  public async makeApi(
    provider: JsonRpcProvider,
    account: string = "",
    signer: EthersSigner,
    env: EnvObject,
    isWeb3: boolean = false,
  ) {
    this.isWeb3Transport = isWeb3;
    const endpoint = env["ethereum-node"].http
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

    // This is temporary to get SOME diagnostic info out there....
/*
    ethersProvider.on("block", ((sdk) => () => {
      sdk.getSyncData().then((syncData) => console.table({0: syncData}));
    })(this.sdk));
*/
    this.sdk.connect(endpoint ? endpoint : "http://localhost:8545", account);
  }

  public async destroy() {
    if(this.sdk) this.sdk.disconnect();
    this.sdk = null;
  }

  public get(): Augur<Provider> {
    if (this.sdk) {
      return this.sdk;
    }
    throw new Error("API must be initialized before use.");
  }
}

export const augurSdk = new SDK();



