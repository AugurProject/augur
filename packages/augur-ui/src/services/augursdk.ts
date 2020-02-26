import {
  NetworkId,
  getAddressesForNetwork,
  SDKConfiguration
} from '@augurproject/artifacts';
import {
  Augur,
  CalculateGnosisSafeAddressParams,
  Connectors,
  createClient,
  NULL_ADDRESS
} from '@augurproject/sdk';
import { EthersSigner } from 'contract-dependencies-ethers';

import { JsonRpcProvider } from 'ethers/providers';
import {
  listenToUpdates,
  unListenToEvents,
} from 'modules/events/actions/listen-to-updates';
import { EnvObject } from 'modules/types';
import { isEmpty } from 'utils/is-empty';
import { analytics } from './analytics';
import { isLocalHost } from 'utils/is-localhost';
import { createBrowserMesh } from './browser-mesh';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { getFingerprint } from 'utils/get-fingerprint';

export class SDK {
  client: Augur | null = null;
  isSubscribed = false;
  networkId: NetworkId;
  private signerNetworkId: string;
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
    env: EnvObject,
    signer: EthersSigner = undefined,
    account: string = null,
    affiliate: string = NULL_ADDRESS,
    enableFlexSearch = true,
  ): Promise<Augur> {
    this.networkId = (await provider.getNetwork()).chainId.toString() as NetworkId;
    const addresses = getAddressesForNetwork(this.networkId);

    this.config = {
      addresses,
      ...env,
      networkId: this.networkId,
    };

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

    if (!isEmpty(account)) {
      this.syncUserData(account, signer, this.networkId, this.config.gnosis && this.config.gnosis.enabled, affiliate).catch((error) => {
        console.log('Gnosis safe create error during create: ', error);
      });
    }

    // tslint:disable-next-line:ban-ts-ignore
    // @ts-ignore
    window.AugurSDK = this.client;
    return this.client;
  }

  /**
   * @name getOrCreateGnosisSafe
   * @description - Kick off the Gnosis safe creation process for a given wallet address.
   * @param {string} owner - Wallet address
   * @param networkId
   * @param affiliate
   * @returns {Promise<void>}
   */
  async getOrCreateGnosisSafe(owner: string, networkId: NetworkId, affiliate: string = NULL_ADDRESS): Promise<void | string> {
    if (!this.client) {
      console.log('Trying to init gnosis safe before Augur is initalized');
      return;
    }

    const gnosisLocalstorageItemKey = `gnosis-relay-request-${networkId}-${owner}`;
    const fingerprint = getFingerprint();
    // Up to UI side to check the localstorage wallet matches the wallet address.
    const calculateGnosisSafeAddressParamsString = localStorage.getItem(
      gnosisLocalstorageItemKey
    );
    if (calculateGnosisSafeAddressParamsString) {
      const calculateGnosisSafeAddressParams = JSON.parse(
        calculateGnosisSafeAddressParamsString
      ) as CalculateGnosisSafeAddressParams;
      const result = await this.client.gnosis.getOrCreateGnosisSafe({
        ...calculateGnosisSafeAddressParams,
        affiliate,
        fingerprint,
        owner,
      });
      return result.safe;
    } else {
      const result = await this.client.gnosis.getOrCreateGnosisSafe(
        { owner, affiliate, fingerprint }
      );

      // Write response to localstorage.
      localStorage.setItem(gnosisLocalstorageItemKey, JSON.stringify(result));
      return result.safe;
    }
  }

  async syncUserData(
    account: string,
    signer: EthersSigner,
    expectedNetworkId: NetworkId,
    useGnosis: boolean,
    affiliate: string,
    updateUser?: Function
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

    if (useGnosis) {
      account = (await this.getOrCreateGnosisSafe(
        account,
        this.networkId,
        affiliate
      )) as string;

      this.client.setUseGnosisSafe(true);
      this.client.setUseGnosisRelay(true);
      this.client.setGnosisSafeAddress(account);
      if (!!updateUser) {
        updateUser(account);
      }
    }

    if (!isLocalHost()) {
      analytics.identify(account, { networkId: this.networkId, useGnosis });
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
