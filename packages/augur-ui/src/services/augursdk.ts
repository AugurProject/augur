import { BigNumber } from "ethers/utils";
import { Augur } from "@augurproject/sdk";
import {
  ContractDependenciesEthers,
  EthersSigner,
} from "contract-dependencies-ethers";

import { EthersProvider } from "@augurproject/ethersjs-provider";
import { JsonRpcProvider } from "ethers/providers";
import { Addresses } from "@augurproject/artifacts";

export class SDK {
  public _sdk: Augur<BigNumber, EthersProvider> | null = null;

  public async makeApi(
    provider: JsonRpcProvider,
    account: string = "",
    signer: EthersSigner,
  ) {
    const ethersProvider = new EthersProvider(provider, 10, 0, 40);
    const networkId = await ethersProvider.getNetworkId();
    const contractDependencies = new ContractDependenciesEthers(
      ethersProvider,
      signer,
      account,
    );

    this._sdk = await Augur.create<BigNumber, EthersProvider>(
      ethersProvider,
      contractDependencies,
      Addresses[networkId],
    );
  }

  public get(): Augur<BigNumber, EthersProvider> {
    if (this._sdk) {
      return this._sdk;
    }
    throw new Error("API must be initialized before use.");
  }
}

export const augurSdk = new SDK();
