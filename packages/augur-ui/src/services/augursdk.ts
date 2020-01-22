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

export class SDK {
  sdk: Augur | null = null;
  isSubscribed = false;
  networkId: NetworkId;
  private signerNetworkId: string;

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

    if (config.sdk && config.sdk.enabled) {
      const connector = new Connectors.WebsocketConnector();
      this.sdk = await createClient(config, connector, account, signer, provider, enableFlexSearch);
      await connector.connect(config, account)
    } else {
      // I hate these next 3 lines that connects the SDK and Connector in this way
      // these shouldn't need to be so coupled.
      const connector = new Connectors.SingleThreadConnector();
      this.sdk = await createClient(config, connector, account, signer, provider, enableFlexSearch);
      await connector.connect(config);

      // Attach the mesh later so that we are doing it fully outside of the backend code
      // since it will only work in a browser environment
      if (config.zeroX && config.zeroX.mesh && config.zeroX.mesh.enabled) {
        connector.mesh = createBrowserMesh(config, (err: Error, mesh: Mesh) => {
          connector.mesh = mesh;
        });
      }
      this.sdk.events.emit('ZeroX:Ready');
    }

    if (!isEmpty(account)) {
      await this.getOrCreateGnosisSafe(account);
    }

    // tslint:disable-next-line:ban-ts-ignore
    // @ts-ignore
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
    this.sdk = null;
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
