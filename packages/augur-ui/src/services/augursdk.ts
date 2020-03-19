import {
  NetworkId,
  SDKConfiguration
} from '@augurproject/artifacts';
import {
  Augur,
  Connectors,
  createClient,
  NULL_ADDRESS
} from '@augurproject/sdk';
import { EthersSigner } from 'contract-dependencies-ethers';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { JsonRpcProvider } from 'ethers/providers';
import {
  listenToUpdates,
  unListenToEvents,
} from 'modules/events/actions/listen-to-updates';
import { isEmpty } from 'utils/is-empty';
import { analytics } from './analytics';
import { isLocalHost } from 'utils/is-localhost';
import { createBrowserMesh } from './browser-mesh';
import { getFingerprint } from 'utils/get-fingerprint';

export class SDK {
  client: Augur | null = null;
  isSubscribed = false;
  networkId: NetworkId;
  private connector:Connectors.BaseConnector;
  private config: SDKConfiguration;

  // Keeping this here for backward compatibility
  get sdk() {
    return this.client;
  }

  connect(account: string = null):Promise<void> {
    return this.connector.connect(this.config, account);
  }

  async makeClient(
    provider: JsonRpcProvider,
    config: SDKConfiguration,
    signer: EthersSigner = undefined,
    account: string = null,
    affiliate: string = NULL_ADDRESS,
    enableFlexSearch = true,
  ): Promise<Augur> {
    this.config = config;
    this.networkId = config.networkId;

    const ethersProvider = new EthersProvider(
      provider,
      this.config.ethereum.rpcRetryCount,
      this.config.ethereum.rpcRetryInterval,
      this.config.ethereum.rpcConcurrency
    );

    if (this.config.sdk?.enabled) {
      this.connector = new Connectors.WebsocketConnector();
      await this.connect();
    } else {
      this.connector = new Connectors.SingleThreadConnector();
    }

    this.client = await createClient(this.config, this.connector, account, signer, ethersProvider, enableFlexSearch, createBrowserMesh);

    this.client.dependencies.setReferralAddress(affiliate);
    this.client.dependencies.setFingerprint(getFingerprint());

    if (!isEmpty(account)) {
      this.syncUserData(account, signer, this.networkId, this.config.gsn && this.config.gsn.enabled).catch((error) => {
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
    signer: EthersSigner,
    expectedNetworkId: NetworkId,
    useGSN: boolean,
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
    unListenToEvents(this.client);
    this.isSubscribed = false;
    this.client = null;
  }

  get(): Augur {
    if (this.client) {
      return this.client;
    }
    throw new Error('API must be initialized before use.');
  }

  ready(): boolean {
    if (this.client) return true;
    return false;
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
