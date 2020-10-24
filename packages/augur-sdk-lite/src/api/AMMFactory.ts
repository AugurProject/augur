import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import { AMMFactoryAbi } from '../abi/AMMFactoryAbi';
import { AMMExchange } from './AMMExchange';
import { SignerOrProvider } from '../constants';
import { TransactionResponse } from '@ethersproject/abstract-provider';


export class AMMFactory {
  static readonly ABI = AMMFactoryAbi;
  readonly signerOrProvider: SignerOrProvider;
  readonly contract: ethers.Contract;

  constructor(signerOrProvider: SignerOrProvider, address: string) {
    this.contract = new ethers.Contract(address, AMMFactoryAbi, signerOrProvider);

    this.signerOrProvider = signerOrProvider;
  }

  async ammExists(marketAddress: string, paraShareToken: string): Promise<boolean> {
    const amm = await this.contract.exchanges(marketAddress, paraShareToken);
    return typeof amm !== 'undefined';
  }

  async getAMMExchange(marketAddress: string, paraShareToken: string): Promise<AMMExchange> {
    const amm = await this.contract.exchanges(marketAddress, paraShareToken);

    if (typeof amm === 'undefined') {
      throw new Error(`Market/Collateral pair ${marketAddress}/${paraShareToken} does not exist.`);
    }

    return new AMMExchange(this.signerOrProvider, amm);
  }

  async addLiquidity(account: string, existingAmmAddress: string, hasLiquidity: boolean, market: string, paraShareToken: string, cash: BigNumber = new BigNumber(0), yesPercent = new BigNumber(50), noPercent = new BigNumber(50)): Promise<TransactionResponse> {
    const ammAddress = existingAmmAddress ? existingAmmAddress : await this.ammAddress(market, paraShareToken);
    const amm = new AMMExchange(this.signerOrProvider, ammAddress);

    if (cash.eq(0)) {
      return this.contract.addAMM(market, paraShareToken);
    }

    const keepYes = noPercent.gt(yesPercent);

    let ratio = keepYes // more NO shares than YES shares
      ? new BigNumber(10**18).times(yesPercent).div(noPercent)
      : new BigNumber(10**18).times(noPercent).div(yesPercent);

    // must be integers
    cash = cash.idiv(1);
    ratio = ratio.idiv(1);
    if (existingAmmAddress) {
      if (hasLiquidity) {
        return amm.addLiquidity(account, cash)
      }
      return amm.addInitialLiquidity(account, cash, new BigNumber(yesPercent), new BigNumber(noPercent));
    }
    return this.contract.addAMMWithLiquidity(market, paraShareToken, cash.toFixed(), ratio.toFixed(), keepYes);
  }

  async getRemoveLiquidity(ammAddress: string, lpTokens: string): Promise<{noShares: BigNumber, yesShares: BigNumber, cashShares: BigNumber}> {
    if (!ammAddress) return null;
    const amm = new AMMExchange(this.signerOrProvider, ammAddress);
    return amm.getRemoveLiquidity(new BigNumber(lpTokens));
  }

  async getRateEnterPosition(ammAddress: string, collateral: string, buyYes: boolean): Promise<BigNumber> {
    if (!ammAddress) return null;
    const amm = new AMMExchange(this.signerOrProvider, ammAddress);
    console.log('getRateEnterPosition', ammAddress, collateral, buyYes)
    return amm.rateEnterPosition(new BigNumber(collateral), buyYes);
  }

  async getCashRateEnterPosition(ammAddress: string, shares: string, buyYes: boolean): Promise<BigNumber> {
    if (!ammAddress) return null;
    const amm = new AMMExchange(this.signerOrProvider, ammAddress);
    return amm.rateCashEnterPosition(new BigNumber(shares), buyYes);
  }

  async getSwapRate(ammAddress: string, inputShares: string, inputIsYesShares: boolean): Promise<BigNumber> {
    if (!ammAddress) return null;
    const amm = new AMMExchange(this.signerOrProvider, ammAddress);
    return amm.getRateSwap(new BigNumber(inputShares), inputIsYesShares);
  }

  async enterPosition(ammAddress: string, collateral: string, buyYes: boolean, minShares: string): Promise<TransactionResponse> {
    if (!ammAddress) return null;
    const amm = new AMMExchange(this.signerOrProvider, ammAddress);
    return amm.enterPosition(new BigNumber(collateral), buyYes, new BigNumber(minShares));
  }

  async getRateExitPosition(ammAddress: string, invalidShares: string, noShares: string, yesShares: string): Promise<BigNumber> {
    if (!ammAddress) return null;
    const amm = new AMMExchange(this.signerOrProvider, ammAddress);
    return amm.rateExitPosition(new BigNumber(invalidShares), new BigNumber(noShares), new BigNumber(yesShares));
  }

  async exitPosition(ammAddress: string, invalidShares: string, noShares: string, yesShares: string, minShares: string): Promise<TransactionResponse> {
    if (!ammAddress) return null;
    const amm = new AMMExchange(this.signerOrProvider, ammAddress);
    return amm.exitPosition(new BigNumber(invalidShares), new BigNumber(noShares), new BigNumber(yesShares), new BigNumber(minShares));
  }

  async removeLiquidity(ammAddress: string, lpTokens: BigNumber): Promise<TransactionResponse> {
    if (!ammAddress) return null;
    const amm = new AMMExchange(this.signerOrProvider, ammAddress);
    return amm.removeLiquidity(new BigNumber(lpTokens));
  }

  async addAMM(market: string, paraShareToken: string, cash: BigNumber = new BigNumber(0), yesPercent = new BigNumber(50), noPercent = new BigNumber(50)): Promise<AddAMMReturn> {
    const ammAddress = await this.ammAddress(market, paraShareToken);
    const amm = new AMMExchange(this.signerOrProvider, ammAddress);

    if (cash.eq(0)) {
      const txr: TransactionResponse = await this.contract.addAMM(market, paraShareToken);
      await txr.wait();
      return { amm, lpTokens: new BigNumber(0) };
    }

    // The kept shares are the more expensive shares.
    // Because price is based on the ratio and the more scarce shares are therefore worth more.
    // The initial liquidity ratio is created by keeping either yse or no shares.
    // So if you want there to be more NO shares than YES shares, you have to keep YES shares.
    const keepYes = noPercent.gt(yesPercent);

    let ratio = keepYes // more NO shares than YES shares
      ? new BigNumber(10**18).times(yesPercent).div(noPercent)
      : new BigNumber(10**18).times(noPercent).div(yesPercent);

    // must be integers
    cash = cash.idiv(1);
    ratio = ratio.idiv(1);

    const txr: TransactionResponse = await this.contract.addAMMWithLiquidity(market, paraShareToken, cash.toFixed(), ratio.toFixed(), keepYes);
    const tx = await txr.wait();
    const liquidityLog = amm.extractLiquidityLog(tx);
    return { amm, lpTokens: liquidityLog.lpTokens };
  }

  async ammAddress(marketAddress: string, paraShareToken: string): Promise<string> {
    return this.contract.calculateAMMAddress(marketAddress, paraShareToken);
  }
}

export interface AddAMMReturn {
  amm: AMMExchange
  lpTokens: BigNumber
}
