import { Addresses } from '@augurproject/artifacts';

import { EthersProvider } from '@augurproject/ethersjs-provider';
import { GnosisRelayAPI } from '@augurproject/gnosis-relay-api';
import { Augur, CalculateGnosisSafeAddressParams, Connectors, Provider, } from '@augurproject/sdk';
import { EthersSigner } from 'contract-dependencies-ethers';

import { ContractDependenciesGnosis } from 'contract-dependencies-gnosis';
import { JsonRpcProvider } from 'ethers/providers';
import { listenToUpdates, unListenToEvents, } from 'modules/events/actions/listen-to-updates';
import { EnvObject } from 'modules/types';
import { isEmpty } from 'utils/is-empty';
import { analytics } from './analytics';
import { isLocalHost } from 'utils/is-localhost';
import { WebWorkerConnector } from 'services/ww-connector';

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
    isWeb3 = false,
    gnosisRelayEndpoint: string | undefined = undefined,
  ): Promise<Augur<Provider>> {
    this.isWeb3Transport = isWeb3;
    this.env = env;
    this.account = account;
    this.signerNetworkId = signerNetworkId;
    const ethersProvider = new EthersProvider(provider, 10, 0, 40);
    this.networkId = await ethersProvider.getNetworkId();

    const gnosisRelay = gnosisRelayEndpoint ?
      new GnosisRelayAPI(gnosisRelayEndpoint) :
      undefined;
    const contractDependencies = new ContractDependenciesGnosis(
      ethersProvider,
      gnosisRelay,
      signer,
      Addresses[this.networkId].Cash,
    );

    const connector = this.pickConnector(env['sdkEndpoint']);

    connector.connect(
      env['ethereum-node'].http
        ? env['ethereum-node'].http
        : 'http://localhost:8545',
      account,
    );

    const enableFlexSearch = false; // TODO configurable
    // const meshClient = env['0x-endpoint'] ? new WSClient(env['0x-endpoint']) : undefined;
    const meshBrowser = undefined; // TODO configurable

    this.sdk = await Augur.create<Provider>(
      ethersProvider,
      contractDependencies,
      Addresses[this.networkId],
      connector,
      gnosisRelay,
      enableFlexSearch,
      undefined, // TODO - Enable when we fix relayer errors
      meshBrowser,
    );

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
  async getOrCreateGnosisSafe(walletAddress: string):Promise<void | string> {
    if (this.sdk) {
      const networkId = await this.sdk.provider.getNetworkId();
      const gnosisLocalstorageItemKey = `gnosis-relay-request-${networkId}-${walletAddress}`;

      // Up to UI side to check the localstorage wallet matches the wallet address.
      const calculateGnosisSafeAddressParamsString = localStorage.getItem(gnosisLocalstorageItemKey);
      if (calculateGnosisSafeAddressParamsString) {
        const calculateGnosisSafeAddressParams = JSON.parse(calculateGnosisSafeAddressParamsString) as CalculateGnosisSafeAddressParams;
        const result = await this.sdk.gnosis.getOrCreateGnosisSafe({ ...calculateGnosisSafeAddressParams, owner: walletAddress });
        if (typeof result === 'string') {
          return result;
        }
        return result.safe;
      } else {
        const result = await this.sdk.gnosis.getOrCreateGnosisSafe(walletAddress);

        if (typeof result === 'string') {
          return result;
        }

        // Write response to localstorage.
        localStorage.setItem(gnosisLocalstorageItemKey, JSON.stringify(result));
        return result.safe;
      }
    }
  }

  async syncUserData(address: string, signer: EthersSigner, signerNetworkId: string, useGnosis: boolean, updateUser?: Function) {
    if (this.sdk) {
      if (signer) this.sdk.signer = signer;
      this.signerNetworkId = signerNetworkId;
      if (!isLocalHost()) {
        analytics.identify(address, { address, signerNetworkId });
      }

      if (useGnosis) {
        const safeAddress = await this.getOrCreateGnosisSafe(address) as string;

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

  pickConnector(sdkEndpoint: string) {
    if (sdkEndpoint) {
      return new Connectors.WebsocketConnector(sdkEndpoint);
    } else {
      return new WebWorkerConnector();
    }
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
