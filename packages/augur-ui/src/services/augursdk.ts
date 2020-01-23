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
import { Mesh } from '@0x/mesh-browser';
import { BrowserMesh, createBrowserMesh } from './browser-mesh';
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
        http: env['ethereum-node'].http
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

    const ethersProvider = new EthersProvider(provider, 5, 0, 40);

    let connector = null;
    if (config.sdk && config.sdk.enabled) {
      connector = new Connectors.WebsocketConnector();
    } else {
      connector = new Connectors.SingleThreadConnector();
    }

    this.client = await createClient(config, connector, account, signer, ethersProvider, enableFlexSearch, createBrowserMesh);
    await connector.connect(config, account)

    if (config.zeroX && (config.zeroX.rpc && config.zeroX.rpc.enabled || config.zeroX.mesh && config.zeroX.mesh.enable)) {
      this.client.events.emit('ZeroX:Ready');
    }

    if (!isEmpty(account)) {
      await this.getOrCreateGnosisSafe(account);
    }

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
  async getOrCreateGnosisSafe(walletAddress: string): Promise<void | string> {
    if (this.client) {
      const networkId = await this.client.provider.getNetworkId();
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
  }

  async syncUserData(
    address: string,
    signer: EthersSigner,
    signerNetworkId: string,
    useGnosis: boolean,
    updateUser?: Function
  ) {
    if (this.client) {
      if (signer) this.client.signer = signer;
      this.signerNetworkId = signerNetworkId;
      if (!isLocalHost()) {
        analytics.identify(address, { address, signerNetworkId });
      }

      if (useGnosis) {
        const safeAddress = (await this.getOrCreateGnosisSafe(
          address
        )) as string;

        this.client.setUseGnosisSafe(true);
        this.client.setUseGnosisRelay(true);
        this.client.setGnosisSafeAddress(safeAddress);
        updateUser(safeAddress);
      }
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
