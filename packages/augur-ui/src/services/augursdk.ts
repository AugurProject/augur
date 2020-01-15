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
import { Mesh } from '@0x/mesh-browser';
import { NETWORK_IDS } from 'modules/common/constants';
import { WebWorkerConnector } from './ww-connector';
import { BrowserMesh, createBrowserMesh } from './browser-mesh';

export class SDK {
  sdk: Augur | null = null;
  isSubscribed = false;
  networkId: string;
  private signerNetworkId: string;

  async makeClient(
    provider: JsonRpcProvider,
    signer: EthersSigner,
    public env: EnvObject,
    public account: String = null,
    public isWeb3Transport = false,
    enableFlexSearch = true,
    private signerNetworkId?: string,
    gnosisRelayEndpoint?: string
  ): Promise<Augur> {
    this.networkId = (await provider.getNetwork()).chainId.toString() as NetworkId;

    const config: SDKConfiguration = {
      networkId: this.networkId,
      ethereum: {
        http: env['ethereum-node'].http
      },
      gnosis: {
        enabled: true,
        http: env['gnosis-relay']
      },
      zeroX: {
        rpc: {
          enabled: true,
        },
        mesh: {
          verbosity: 5,
          enabled: true,
        }
      }
    };

    if (config.sdk && config.sdk.enabled) {
      const connector = new Connectors.WebsocketConnector();
      this.sdk = await createClient(config, connector, account, signer, provider, enableFlexSearch);
      await connector.connect(config, account)
    } else {
      const connector = new Connectors.SingleThreadConnector();
      if (config.zeroX && config.zeroX.mesh && config.zeroX.enabled) {
        connector.mesh = createBrowserMesh(config, (err: Error, mesh: Mesh) => {
          connector.mesh = mesh;
        });
      }
      this.sdk = await createClient(config, connector, account, signer, provider, enableFlexSearch);
      // This is messy -- that is neededing the connector to know about `sdk`
      await connector.connectWithClient(config, this.sdk);
    }

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

  async createConnector(config: SDKConfiguration) {
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
