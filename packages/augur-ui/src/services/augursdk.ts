import type { SDKConfiguration } from '@augurproject/artifacts';
import type { EthersSigner } from '@augurproject/contract-dependencies-ethers';
import type { Augur, Connectors } from '@augurproject/sdk';

import { NetworkId } from '@augurproject/utils';
import type { JsonRpcProvider } from 'ethers/providers';
import { NULL_ADDRESS } from 'modules/common/constants';

import {
  listenToUpdates,
  unListenToEvents,
} from 'modules/events/actions/listen-to-updates';
import { BigNumber } from 'utils/create-big-number';
import { getFingerprint } from 'utils/get-fingerprint';
import { isEmpty } from 'utils/is-empty';
import { isLocalHost } from 'utils/is-localhost';
import { analytics } from './analytics';
import { createBrowserMeshWorker } from './browser-mesh';

window.BigNumber = BigNumber;

export class SDK {
  client: Augur | null = null;
  isSubscribed = false;
  private connector:Connectors.BaseConnector;
  private config: SDKConfiguration;

  get networkId() {
    return this.config?.networkId;
  }

  connect() {
    return this.connector.connect(this.config);
  }

  async makeClient(
    provider: JsonRpcProvider,
    config: SDKConfiguration,
    signer: EthersSigner = undefined,
    account: string = null,
    affiliate: string = NULL_ADDRESS,
    enableFlexSearch = true,
  ): Promise<Augur> {
    const { Connectors, EthersProvider, createClient } = await import(/* webpackChunkName: 'augur-sdk' */ '@augurproject/sdk');

    this.config = config;

    const ethersProvider = new EthersProvider(
      provider,
      this.config.ethereum.rpcRetryCount,
      this.config.ethereum.rpcRetryInterval,
      this.config.ethereum.rpcConcurrency
    );

    if (this.config.sdk?.enabled) {
      this.connector = new Connectors.WebsocketConnector();
    } else {
      this.connector = new Connectors.SingleThreadConnector();
    }

    this.client = await createClient(this.config, this.connector, signer, ethersProvider, enableFlexSearch, createBrowserMeshWorker);

    this.client.dependencies.setReferralAddress(affiliate);
    this.client.dependencies.setFingerprint(getFingerprint());

    if (!isEmpty(account)) {
      this.syncUserData(account, provider, signer, this.networkId, this.config.gsn && this.config.gsn.enabled).catch((error) => {
        console.log('Wallet create error during create: ', error);
      });
    }

    // tslint:disable-next-line:ban-ts-ignore
    // @ts-ignore
    window.AugurSDK = this.client;
    return this.client;
  }

  async syncUserData(
    account: string,
    provider: JsonRpcProvider,
    signer: EthersSigner,
    expectedNetworkId: NetworkId,
    useGSN: boolean,
    primaryProvider: string,
  ) {
    if (!this.client) {
      throw new Error('Trying to sync user data before Augur is initialized');
    }

    if (expectedNetworkId && this.networkId !== expectedNetworkId) {
      throw new Error(`Setting the current user is expecting to be on network ${expectedNetworkId} but Augur was already connected to ${this.networkId}`);
    }

    if (!signer) {
      throw new Error('Attempting to set logged in user without specifying a signer');
    }

    this.client.signer = signer;
    if (primaryProvider === 'wallet') {
      this.client.setProvider(provider);
    }

    if (useGSN && account) {
      // TODO: In Dev this may be annoying as you can't faucet cash if these are on and you havent ever done a tx with the GSN relay
      this.client.setUseRelay(true);
      this.client.setUseWallet(true);
    }

    if (!isLocalHost()) {
      analytics.identify(account, { networkId: this.networkId, useGSN });
    }
  }

  async destroy() {
    if (this.client) unListenToEvents(this.client);
    this.isSubscribed = false;
    this.client = null;
  }

  get(): Augur {
    if (this.client) {
      return this.client;
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
}

export const augurSdk = new SDK();
