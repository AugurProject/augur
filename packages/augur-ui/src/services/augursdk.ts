import { Augur, Provider } from "@augurproject/sdk";
import {
  ContractDependenciesEthers,
  EthersSigner,
} from "contract-dependencies-ethers";

import { EthersProvider } from "@augurproject/ethersjs-provider";
import { JsonRpcProvider } from "ethers/providers";
import { Addresses } from "@augurproject/artifacts";

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
    );
  }

  public get(): Augur<Provider> {
    if (this.sdk) {
      return this.sdk;
    }
    throw new Error("API must be initialized before use.");
  }
}

export const augurSdk = new SDK();
