import { abi } from '@augurproject/artifacts';
import { NULL_ADDRESS } from '@augurproject/sdk-lite';
import { BigNumber } from 'bignumber.js';
import { Abi } from 'ethereum';
import { Provider } from '..';
import { Augur } from '../Augur';

const MIN_EXCHANGE_RATE_MULTIPLIER = 0.85;
const WITHDRAW_GAS_COST_MAX = new BigNumber(200000);

export class GSN {
  walletAddresses: { [key: string]: string } = {};

  constructor(
    private readonly provider: Provider,
    private readonly augur: Augur
  ) {
    //this.provider.storeAbiData(abi.RelayHub as Abi, 'RelayHub');
    this.provider.storeAbiData(
      abi.AugurWalletRegistry as Abi,
      'AugurWalletRegistry'
    );
  }

  /**
   * @desc Calculates the wallet address for a user
   * @param {string} owner
   * @returns {Promise<string>}
   */
  async calculateWalletAddress(owner: string): Promise<string> {
    if (this.walletAddresses[owner] === undefined) {
      this.walletAddresses[
        owner
      ] = await this.augur.contracts.augurWalletRegistry.getCreate2WalletAddress_(
        owner
      );
    }
    return this.walletAddresses[owner];
  }

  /**
   * @desc Sees if the user actually has a wallet on chain already
   * @param {string} owner
   * @returns {Promise<string>}
   */
  async userHasInitializedWallet(owner: string): Promise<boolean> {
    return (
      (await this.augur.contracts.augurWalletRegistry.getWallet_(owner)) !==
      NULL_ADDRESS
    );
  }

  /**
   * @desc Manually initialize a wallet for the signer. The main use case for this is to enable the signing of off chain orders
   * @returns {Promise<void>}
   */
  async initializeWallet(): Promise<void> {
    await this.augur.contracts.universe.runPeriodicals();
  }

  /**
   * @desc Withdraws signer ETH (as DAI) and wallet DAI to a destination address
   * @param {string} destination
   * @returns {Promise<void>}
   */
  async withdrawAllFunds(destination: string): Promise<void> {
    const signerAddress = await this.augur.dependencies.signer.getAddress();
    const walletAddress = await this.calculateWalletAddress(signerAddress);
    const wallet = this.augur.contracts.augurWalletFromAddress(walletAddress);

    const useWallet = this.augur.getUseWallet();
    const useRelay = this.augur.getUseRelay();
    const useEthreserve = this.augur.getUseDesiredEthBalance();
    this.augur.setUseWallet(false);
    this.augur.setUseRelay(false);
    this.augur.setUseDesiredEthBalance(false);

    const ethBalance =
      this.augur.config.gsn.desiredSignerBalanceInETH * 10 ** 18;
    const signerEthBalance = await this.augur.getEthBalance(signerAddress);

    const minExchangeRateInDai = this.augur.dependencies.ethToDaiRate
      .multipliedBy(MIN_EXCHANGE_RATE_MULTIPLIER)
      .decimalPlaces(0);
    const ethTxCost = WITHDRAW_GAS_COST_MAX.multipliedBy(
      (await this.augur.dependencies.provider.getGasPrice()).toString()
    );
    const ethAmount = new BigNumber(
      BigNumber.min(ethBalance, signerEthBalance)
    ).minus(ethTxCost);
    await wallet.withdrawAllFundsAsDai(destination, minExchangeRateInDai, {
      attachedEth: ethAmount,
    });

    this.augur.setUseWallet(useWallet);
    this.augur.setUseRelay(useRelay);
    this.augur.setUseDesiredEthBalance(useEthreserve);
  }

  async withdrawAllFundsEstimateGas(
    destination: string
    ): Promise<BigNumber> {
      const signerAddress = await this.augur.dependencies.signer.getAddress();
      const walletAddress = await this.calculateWalletAddress(signerAddress);
      const wallet = this.augur.contracts.augurWalletFromAddress(walletAddress);

      const useWallet = this.augur.getUseWallet();
      const useRelay = this.augur.getUseRelay();
      const useEthreserve = this.augur.getUseDesiredEthBalance();
      this.augur.setUseWallet(false);
      this.augur.setUseRelay(false);
      this.augur.setUseDesiredEthBalance(false);
      let estimateGas = new BigNumber(0);

      try {
        const minExchangeRateInDai = this.augur.dependencies.ethToDaiRate.multipliedBy(MIN_EXCHANGE_RATE_MULTIPLIER).decimalPlaces(0);
        const ethBalance = await this.augur.getEthBalance(signerAddress);
        const ethTxCost = WITHDRAW_GAS_COST_MAX.multipliedBy((await this.augur.dependencies.provider.getGasPrice()).toString());
        const ethAmount = new BigNumber(ethBalance).minus(ethTxCost);
        estimateGas = await wallet.withdrawAllFundsAsDai_estimateGas(destination, minExchangeRateInDai, {attachedEth: ethAmount});
      } catch (e) {
        throw e;
      } finally {
        this.augur.setUseWallet(useWallet);
        this.augur.setUseRelay(useRelay);
        this.augur.setUseDesiredEthBalance(useEthreserve);
      }

      return estimateGas;
    }
}
