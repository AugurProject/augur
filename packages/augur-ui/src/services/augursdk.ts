import { NetworkId } from '@augurproject/artifacts';
import {
  Augur,
  CalculateGnosisSafeAddressParams,
  Connectors,
  createClient,
  SDKConfiguration
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

export class SDK {
  client: Augur | null = null;
  isSubscribed = false;
  networkId: NetworkId;
  private signerNetworkId: string;

  // Keeping this here for backward compatibility
  get sdk() {
    return this.client;
  }

  async makeClient(
    provider: JsonRpcProvider,
    env: EnvObject,
    signer: EthersSigner = undefined,
    account: string = null,
    enableFlexSearch = true,
  ): Promise<Augur> {
    this.networkId = (await provider.getNetwork()).chainId.toString() as NetworkId;

    const config: SDKConfiguration = {
      networkId: this.networkId,
      ethereum: {
        http: env['ethereum-node'].http,
        rpcRetryCount: 5,
        rpcRetryInternval: 0,
        rpcConcurrency: 40
      },
      gnosis: {
        enabled: true,
        http: env['gnosis-relay']
      },
      zeroX: {
        rpc: {
          enabled: true,
          ws: env['0x-endpoint']
        },
        mesh: {
          verbosity: 5,
          bootstrapList: (env['0x-mesh'] || {}).bootstrapList,
          enabled: false,
        }
      }
    };

    const ethersProvider = new EthersProvider(
      provider,
      config.rpcRetryCount,
      config.rpcRetryInterval,
      config.rpcConcurrency
    );

    let connector = null;
    if (config.sdk && config.sdk.enabled) {
      connector = new Connectors.WebsocketConnector();
    } else {
      connector = new Connectors.SingleThreadConnector();
    }

    this.client = await createClient(config, connector, account, signer, ethersProvider, enableFlexSearch, createBrowserMesh);

    if (!isEmpty(account)) {
      this.syncUserData(account, signer, this.networkId, config.gnosis && config.gnosis.enabled).catch((error) => {
        console.log("Gnosis safe create error during create: ", error);
      });
    }

    // This actually isny' async because we start this with a client
    await connector.connect(config, account)

    // tslint:disable-next-line:ban-ts-ignore
    // @ts-ignore
    window.AugurSDK = this.client;
    return this.client;
  }

  /**
   * @name getOrCreateGnosisSafe
   * @description - Kick off the Gnosis safe creation process for a given wallet address.
   * @param {string} walletAddress - Wallet address
   * @returns {Promise<void>}
   */
  async getOrCreateGnosisSafe(walletAddress: string, networkId: NetworkId): Promise<void | string> {
    if (!this.client) {
      console.log("Trying to init gnosis safe before Augur is initalized");
      return;
    }

    const gnosisLocalstorageItemKey = `gnosis-relay-request-${networkId}-${walletAddress}`;

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
        owner: walletAddress,
      });
      if (typeof result === 'string') {
        return result;
      }
      return result.safe;
    } else {
      const result = await this.client.gnosis.getOrCreateGnosisSafe(
        walletAddress
      );

      if (typeof result === 'string') {
        return result;
      }

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
    updateUser?: Function
  ) {
    if (!this.client) {
      throw new Error("Trying to sync user data before Augur is initialized");
    }

    if (this.networkId !== expectedNetworkId) {
      throw new Error(`Setting the current user is expecting to be on network ${expectedNetworkId} but Augur was already connected to ${this.networkId}`);
    }

    if (!signer) {
      throw new Error("Attempting to set logged in user without specifying a signer");
    }

    this.client.signer = signer;

    if (useGnosis) {
      account = (await this.getOrCreateGnosisSafe(
        account
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
