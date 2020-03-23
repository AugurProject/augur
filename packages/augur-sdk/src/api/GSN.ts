import { abi } from '@augurproject/artifacts';
import { Abi } from 'ethereum';
import { Provider } from '..';
import { Augur } from '../Augur';
import { NULL_ADDRESS } from '../constants';
import { BigNumber } from "bignumber.js";

export class GSN {
  walletAddresses: {[key: string]: string} = {};

  constructor(
    private readonly provider: Provider,
    private readonly augur: Augur,
  ) {
    //this.provider.storeAbiData(abi.RelayHub as Abi, 'RelayHub');
    this.provider.storeAbiData(abi.AugurWalletRegistry as Abi, 'AugurWalletRegistry');
  }

  /**
   * @desc Calculates the wallet address for a user
   * @param {string} owner
   * @returns {Promise<string>}
   */
  async calculateWalletAddress(
    owner: string
  ): Promise<string> {
    if (this.walletAddresses[owner] === undefined) {
      this.walletAddresses[owner] = await this.augur.contracts.augurWalletRegistry.getCreate2WalletAddress_(owner);
    }
    return this.walletAddresses[owner];
  }

  /**
   * @desc Sees if the user actually has a wallet on chain already
   * @param {string} owner
   * @returns {Promise<string>}
   */
  async userHasInitializedWallet(
    owner: string
  ): Promise<boolean> {
    return (await this.augur.contracts.augurWalletRegistry.getWallet_(owner)) !== NULL_ADDRESS;
  }

  /**
   * @desc Manually initialize a wallet for the signer. The main use case for this is to enable the signing of off chain orders
   * @returns {Promise<void>}
   */
  async initializeWallet(
  ): Promise<void> {
    // TODO: Replace with init wallet contract wrapper method
    try {
      await this.augur.contracts.universe.sweepInterest();
    } catch(e) {
      throw e;
    }
  }
}
