import { GnosisRelayAPI } from '@augurproject/gnosis-relay-api';
import { CalculateGnosisSafeAddressParams } from '@augurproject/sdk/build/api/Gnosis';
import { Augur, Provider } from '@augurproject/sdk';
import {
  SEOConnector,
  WebsocketConnector
} from '@augurproject/sdk/build/connector';
import {
  EthersSigner,
} from 'contract-dependencies-ethers';

import { ContractDependenciesGnosis } from 'contract-dependencies-gnosis';
import { isEmpty } from 'utils/is-empty';
import { WebWorkerConnector } from './ww-connector';

import { EthersProvider } from '@augurproject/ethersjs-provider';
import { JsonRpcProvider } from 'ethers/providers';
import { Addresses } from '@augurproject/artifacts';
import { EnvObject } from 'modules/types';
import {
  listenToUpdates,
  unListenToEvents,
} from 'modules/events/actions/listen-to-updates';
import { isMobileSafari } from 'utils/is-safari';
import { analytics } from './analytics';

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
      account,
    );

    const connector = this.pickConnector(env['sdkEndpoint']);

    connector.connect(
      env['ethereum-node'].http
        ? env['ethereum-node'].http
        : 'http://localhost:8545',
      account,
    );

    this.sdk = await Augur.create<Provider>(
      ethersProvider,
      contractDependencies,
      Addresses[this.networkId],
      connector,
      gnosisRelay,
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
        try {
          await this.sdk.gnosis.getOrCreateGnosisSafe({ ...calculateGnosisSafeAddressParams, owner: walletAddress });
          return calculateGnosisSafeAddressParams.safe;
        }
        catch (error){
          console.log('ERROR:::CANT CREATE SAFE', error);
          return calculateGnosisSafeAddressParams.safe;
        }
      } else {
        const result = await this.sdk.gnosis.getOrCreateGnosisSafe(walletAddress);

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
      analytics.identify(address, { address, signerNetworkId })

      if (useGnosis) {
        const safeAddress = await this.getOrCreateGnosisSafe(address) as string;

        this.sdk.setUseGnosisSafe(true);
        this.sdk.setUseGnosisRelay(true);
        this.sdk.setGnosisSafeAddress(safeAddress);

        console.log('SYNC [safe] USER data', safeAddress);
        this.sdk.syncUserData(safeAddress);
        updateUser(safeAddress);
      }
      else {
        console.log('SYNC [non-safe] USER data', address);
        this.sdk.syncUserData(address);
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
      return new WebsocketConnector(sdkEndpoint);
    } else if (isMobileSafari()) {
      return new SEOConnector()
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
