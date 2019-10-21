import { Augur, Provider } from '@augurproject/sdk';
import {
  SEOConnector,
  SingleThreadConnector,
} from '@augurproject/sdk/build/connector';
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
import { isMobileSafari } from 'utils/is-safari';

export class SDK {
  sdk: Augur<Provider> | null = null;
  isWeb3Transport = false;
  env: EnvObject = null;
  isSubscribed = false;
  networkId: string;
  account: string;
  private signerNetworkId: string;

  async makeApi(
    provider: JsonRpcProvider,
    account = '',
    signer: EthersSigner,
    env: EnvObject,
    signerNetworkId?: string,
    isWeb3 = false
  ):Promise<Augur<Provider>> {
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

    const connector = (isMobileSafari() ? new SEOConnector(): new WebWorkerConnector());
    connector.connect(
      env['ethereum-node'].http
        ? env['ethereum-node'].http
        : 'http://localhost:8545',
      account
    );

    this.sdk = await Augur.create<Provider>(
      ethersProvider,
      contractDependencies,
      Addresses[this.networkId],
      connector,
    );

    window.AugurSDK = this.sdk;

    return this.sdk;
  }

  async syncUserData(address: string, signer: EthersSigner, signerNetworkId: string) {
    if (this.sdk) {
      this.sdk.syncUserData(address);
      if (signer) this.sdk.setSigner(signer);
      this.signerNetworkId = signerNetworkId;
    }
  }

  async destroy() {
    unListenToEvents(this.sdk);
    this.isSubscribed = false;
    if (this.sdk) this.sdk.disconnect();
    this.sdk = null;
  }

  get(): Augur<Provider> {
    if (this.sdk) {
      return this.sdk;
    }
    throw new Error('API must be initialized before use.');
  }

  subscribe(dispatch): void {
    if (this.isSubscribed) return;
    try {
      this.isSubscribed = true;
      console.log('Subscribing to Augur events');
      dispatch(listenToUpdates(this.get()));
    } catch (e) {
      this.isSubscribed = false;
    }
  }

  sameNetwork(): boolean {
    const localNetwork = this.networkId;
    const signerNetworkId = this.signerNetworkId;

    if (!localNetwork || !signerNetworkId) return undefined;
    return localNetwork.toString() === signerNetworkId.toString();
  }
}

export const augurSdk = new SDK();
