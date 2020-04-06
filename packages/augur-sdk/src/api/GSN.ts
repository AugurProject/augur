import { abi } from '@augurproject/artifacts';
import { Abi } from 'ethereum';
import { Provider } from '..';
import { Augur } from '../Augur';
import { NULL_ADDRESS } from '../constants';
import { BigNumber } from "bignumber.js";

const MIN_EXCHANGE_RATE_MULTIPLIER = 0.85;
const WITHDRAW_GAS_COST_MAX = new BigNumber(200000);

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
    await this.augur.contracts.universe.runPeriodicals();
  }

  /**
   * @desc Withdraws signer ETH (as DAI) and wallet DAI to a destination address
   * @param {string} destination
   * @returns {Promise<void>}
   */
  async withdrawAllFunds(
    destination: string
    ): Promise<void> {
      const signerAddress = await this.augur.dependencies.signer.getAddress();
      const walletAddress = await this.calculateWalletAddress(signerAddress);
      const wallet = this.augur.contracts.augurWalletFromAddress(walletAddress);
      this.augur.setUseWallet(false);
      this.augur.setUseRelay(false);
      const minExchangeRateInDai = this.augur.dependencies.ethToDaiRate.multipliedBy(MIN_EXCHANGE_RATE_MULTIPLIER).decimalPlaces(0);
      const ethBalance = await this.augur.getEthBalance(signerAddress);
      const ethTxCost = WITHDRAW_GAS_COST_MAX.multipliedBy((await this.augur.dependencies.provider.getGasPrice()).toString());
      const ethAmount = new BigNumber(ethBalance).minus(ethTxCost);
      await wallet.withdrawAllFundsAsDai(destination, minExchangeRateInDai, {attachedEth: ethAmount});
    }
}
