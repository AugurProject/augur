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
   * @desc Withdraws wallet REP, DAI, and ETH to a destination address
   * @param {string} destination
   * @returns {Promise<void>}
   */
  async withdrawAllFunds(destination: string): Promise<void> {
    const signerAddress = await this.augur.dependencies.signer.getAddress();
    const walletAddress = await this.calculateWalletAddress(signerAddress);

    // Check if REP
    const repBalance = await this.augur.contracts.reputationToken.balanceOf_(walletAddress);
    // Transfer REP if balance > 0
    if ((await repBalance).gt(0)) {
      await this.augur.contracts.reputationToken.transfer(destination, repBalance);
    }

    // Check if Legacy REP
    const legacyRepBalance = await this.augur.contracts.legacyReputationToken.balanceOf_(walletAddress);
    // Transfer Legacy REP if balance > 0
    if ((await legacyRepBalance).gt(0)) {
      await this.augur.contracts.legacyReputationToken.transfer(destination, legacyRepBalance);
    }

    // Check Dai balance
    const daiBalance = await this.augur.contracts.cash.balanceOf_(walletAddress);
    // Transfer DAI if balance > 0
    if ((await daiBalance).gt(0)) {
      await this.augur.contracts.cash.transfer(destination, daiBalance);
    }

    // Check ETH balance
    const walletEthBalance = await this.augur.getEthBalance(walletAddress);
    // Transfer ETH if balance > 0
    const ethAmount = new BigNumber(walletEthBalance);
    if (ethAmount.gt(0)) {
      await this.augur.sendETH(destination, ethAmount);
    }
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
