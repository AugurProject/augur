import { getAddressesForNetwork } from '@augurproject/artifacts';
import {
  Augur,
  CalculateGnosisSafeAddressParams,
  Connectors,
  Provider,
  ClientConfiguration,
  createClient
} from '@augurproject/sdk';
import { EthersSigner } from 'contract-dependencies-ethers';

import { ContractDependenciesGnosis } from 'contract-dependencies-gnosis';
import { JsonRpcProvider } from 'ethers/providers';
import {
  listenToUpdates,
  unListenToEvents,
} from 'modules/events/actions/listen-to-updates';
import { EnvObject } from 'modules/types';
import { isEmpty } from 'utils/is-empty';
import { analytics } from './analytics';
import { isLocalHost } from 'utils/is-localhost';
import { WSClient } from '@0x/mesh-rpc-client';
import { Mesh, Config } from '@0x/mesh-browser';
import { NETWORK_IDS } from 'modules/common/constants';
import { WebWorkerConnector } from './ww-connector';

export class SDK {
  sdk: Augur | null = null;
  isWeb3Transport = false;
  env: EnvObject = null;
  isSubscribed = false;
  networkId: string;
  account: string;
  private signerNetworkId: string;
  private meshConfig: Config;

  export async function createClient(env: EnvObject, connector: BaseConnector, signer?: EthersSigner, provider?: JsonRpcProvider) {

  async makeClient(
    provider: JsonRpcProvider,
    signer: EthersSigner,
    env: EnvObject,
    isWeb3 = false,
    enableFlexSearch = false,
    signerNetworkId?: string,
    gnosisRelayEndpoint?: string
  ): Promise<Augur> {
    this.networkId = await provider.getNetworkId();
    this.isWeb3Transport = isWeb3;
    this.env = env;
    this.account = account;
    this.signerNetworkId = signerNetworkId;

    const clientConfiguration: ClientConfiguration = {
      networkId: this.networkId,
      sdk: {
        ws: env['sdkEndpoint']
      },
      ethereum: {
        http: env['ethereum-node'].http
      },
      gnosis: {
        http: gnosisRelayEndpoint
      }
    };

    const serverConfig: ServerConfiguration = {
      ...ClientConfiguration,
      sycing: {
      }
    };

    // TODO don't leave this here
    const connector = this.pickConnector(clientConfiguration);
    await connector.connect(serverConfig);

    this.sdk = createClient(clientConfiguration, connector, signer, provider);

    if (!isEmpty(account)) {
      await this.getOrCreateGnosisSafe(account);
    }

    window.AugurSDK = this.sdk;
    return this.sdk;
  }

  /**
   * @name getOrCreateGnosisSafe
   * @description - Kick off the Gnosis safe creation process for a given wallet address.
   * @param {string} walletAddress - Wallet address
   * @returns {Promise<void>}
   */
  async getOrCreateGnosisSafe(walletAddress: string): Promise<void | string> {
    if (this.sdk) {
      const networkId = await this.sdk.provider.getNetworkId();
      const gnosisLocalstorageItemKey = `gnosis-relay-request-${networkId}-${walletAddress}`;

      // Up to UI side to check the localstorage wallet matches the wallet address.
      const calculateGnosisSafeAddressParamsString = localStorage.getItem(
        gnosisLocalstorageItemKey
      );
      if (calculateGnosisSafeAddressParamsString) {
        const calculateGnosisSafeAddressParams = JSON.parse(
          calculateGnosisSafeAddressParamsString
        ) as CalculateGnosisSafeAddressParams;
        const result = await this.sdk.gnosis.getOrCreateGnosisSafe({
          ...calculateGnosisSafeAddressParams,
          owner: walletAddress,
        });
        if (typeof result === 'string') {
          return result;
        }
        return result.safe;
      } else {
        const result = await this.sdk.gnosis.getOrCreateGnosisSafe(
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
  }

  async syncUserData(
    address: string,
    signer: EthersSigner,
    signerNetworkId: string,
    useGnosis: boolean,
    updateUser?: Function
  ) {
    if (this.sdk) {
      if (signer) this.sdk.signer = signer;
      this.signerNetworkId = signerNetworkId;
      if (!isLocalHost()) {
        analytics.identify(address, { address, signerNetworkId });
      }

      if (useGnosis) {
        const safeAddress = (await this.getOrCreateGnosisSafe(
          address
        )) as string;

        this.sdk.setUseGnosisSafe(true);
        this.sdk.setUseGnosisRelay(true);
        this.sdk.setGnosisSafeAddress(safeAddress);
        updateUser(safeAddress);
      }
    }
  }

  async destroy() {
    unListenToEvents(this.sdk);
    this.isSubscribed = false;
    if (this.sdk) this.sdk.disconnect();
    this.sdk = null;
  }

  pickConnector(config: ServerConfiguration) {
    if (config.sdk.ws) {
      return new Connectors.WebsocketConnector(config);
    } else {
      return new Connectors.SingleThreadConnector(config);
    }
  }

  get(): Augur {
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
