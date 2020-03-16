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
    // TODO: Any transaction will do for the purposes of this function as they all initialize a wallet when the useWallet flag is true. In that spirit we have users do light gas fee ops that have no incentives here. Could cycle them randomly even.
    //await this.augur.contracts.universe.sweepInterest();
    this.augur.contracts.cashFaucet.faucet(new BigNumber('1000000000000000000000'));
    return;
  }
}
