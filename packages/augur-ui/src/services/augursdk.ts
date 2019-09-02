import { Augur, Provider } from '@augurproject/sdk';
import {
  ContractDependenciesEthers,
  EthersSigner,
} from 'contract-dependencies-ethers';
import { WebWorkerConnector } from './ww-connector';

import { EthersProvider } from '@augurproject/ethersjs-provider';
import { JsonRpcProvider } from 'ethers/providers';
import { Addresses } from '@augurproject/artifacts';
import { EnvObject } from 'modules/types';
import { listenToUpdates, unListenToEvents } from 'modules/events/actions/listen-to-updates';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';

export class SDK {
  public sdk: Augur<Provider> | null = null;
  public isWeb3Transport: boolean = false;
  public env: EnvObject = null;
  public isSubscribed: boolean = false;
  public networkId: string;
  public account: string;
  private signerNetworkId: string;

  public async makeApi(
    provider: JsonRpcProvider,
    account: string = '',
    signer: EthersSigner,
    env: EnvObject,
    signerNetworkId?: string,
    isWeb3: boolean = false
  ) {
    this.isWeb3Transport = isWeb3;
    this.env = env;
    this.account = account;
    this.signerNetworkId = signerNetworkId;
    const ethersProvider = new EthersProvider(provider, 10, 0, 40);
    this.networkId = await ethersProvider.getNetworkId();
    const contractDependencies = new ContractDependenciesEthers(
      ethersProvider,
      signer,
      account
    );

    this.sdk = await Augur.create<Provider>(
      ethersProvider,
      contractDependencies,
      Addresses[this.networkId],
      new WebWorkerConnector()
    );

    window.AugurSDK = this.sdk;

    this.sdk.connect(
      env['ethereum-node'].http
        ? env['ethereum-node'].http
        : 'http://localhost:8545',
      account
    );
  }

  public async syncUserData(address: string, signer: EthersSigner, signerNetworkId: string) {
    if (this.sdk) {
      this.sdk.syncUserData(address);
      if (signer) this.sdk.setSigner(signer);
      this.signerNetworkId = signerNetworkId;
    }
  }

  public async destroy() {
    unListenToEvents(this.sdk);
    this.isSubscribed = false;
    if (this.sdk) this.sdk.disconnect();
    this.sdk = null;
  }

  public get(): Augur<Provider> {
    if (this.sdk) {
      return this.sdk;
    }
    throw new Error('API must be initialized before use.');
  }

  public subscribe(dispatch): void {
    if (this.isSubscribed) return;
    try {
      this.isSubscribed = true;
      console.log('Subscribing to Augur events');
      dispatch(listenToUpdates(this.get()));
    } catch (e) {
      this.isSubscribed = false;
    }
  }

  public sameNetwork(): boolean {
    const localNetwork = this.networkId;
    const signerNetworkId = this.signerNetworkId;

    if (!localNetwork || !signerNetworkId) return undefined;
    return localNetwork.toString() === signerNetworkId.toString();
  }
}

export const augurSdk = new SDK();
