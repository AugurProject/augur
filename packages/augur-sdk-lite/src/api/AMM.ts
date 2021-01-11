import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import { AMMFactoryAbi } from '../abi/AMMFactoryAbi';
import { AMMExchangeAbi } from '../abi/AMMExchangeAbi';
import { WethWrapperForAMMExchangeAbi } from '../abi/WethWrapperForAMMExchangeAbi';
import { NULL_ADDRESS, SignerOrProvider } from '../constants';
import { TransactionResponse } from '@ethersproject/abstract-provider';


const NUMTICKS = new BigNumber(1000); // Hardcoded because all AMMs are Y/N markets for now.

// This class is used by the middleware.
export class AMM {
  readonly ethIntermediary: ExchangeETH;
  readonly erc20Intermediary: ExchangeERC20;

  constructor(
    readonly signerOrProvider: SignerOrProvider,
    private wethParaShareTokenAddress: string,
    ammFactoryAddress: string,
    wethWrapperAddress: string,
  ) {
    this.ethIntermediary = new ExchangeETH(signerOrProvider, ammFactoryAddress, wethWrapperAddress);
    this.erc20Intermediary = new ExchangeERC20(signerOrProvider, ammFactoryAddress);
  }

  private intermediary(paraShareToken: string): ExchangeContractIntermediary {
    return paraShareToken.toLowerCase() === this.wethParaShareTokenAddress.toLowerCase()
      ? this.ethIntermediary
      : this.erc20Intermediary;
  }

  async createExchange(market: string, paraShareToken: string, fee: BigNumber): Promise<TransactionResponse> {
    return this.intermediary(paraShareToken).addAMM(market, paraShareToken, fee);
  }

  async doAddLiquidity(
    recipient: string,
    existingAmmAddress: string,
    hasLiquidity: boolean,
    market: string,
    paraShareToken: string,
    fee: BigNumber,
    cash: BigNumber = new BigNumber(0),
    longPercent = new BigNumber(50),
    shortPercent = new BigNumber(50)
  ): Promise<TransactionResponse> {
    const exchangeAddress = existingAmmAddress || await this.exchangeAddress(market, paraShareToken, fee);

    // Just create new AMM
    if (cash.eq(0)) {
      if (AMM.exchangeExists(exchangeAddress)) {
        AMM.throwExchangeAlreadyExists(market, paraShareToken, fee);
      } else {
        return this.createExchange(market, paraShareToken, fee);
      }
    }

    // Just add liquidity
    if (AMM.exchangeExists(exchangeAddress)) {
      if (hasLiquidity) {
        return this.doAddSubsequentLiquidity(market, paraShareToken, fee, cash, recipient);
      } else {
        return this.doAddInitialLiquidity(market, paraShareToken, fee, cash, longPercent, shortPercent, recipient);
      }
    }

    // Create new AMM with liquidity
    return this.doCreateExchangeWithLiquidity(market, paraShareToken, fee, cash, longPercent, shortPercent, recipient);
  }

  async getAddLiquidity(
    recipient: string,
    existingAmmAddress: string,
    hasLiquidity: boolean,
    market: string,
    paraShareToken: string,
    fee: BigNumber,
    cash: BigNumber = new BigNumber(0),
    longPercent = new BigNumber(50),
    shortPercent = new BigNumber(50)
  ): Promise<BigNumber> {
    const exchangeAddress = existingAmmAddress || await this.exchangeAddress(market, paraShareToken, fee);

    if (cash.eq(0)) {
      return new BigNumber(0);
    }

    // Just add liquidity
    if (AMM.exchangeExists(exchangeAddress)) {
      if (hasLiquidity) {
        return this.getAddSubsequentLiquidity(market, paraShareToken, fee, cash, recipient);
      } else {
        return this.getAddInitialLiquidity(market, paraShareToken, fee, cash, longPercent, shortPercent, recipient);
      }
    }

    // Create new AMM with liquidity
    return this.getCreateExchangeWithLiquidity(market, paraShareToken, fee, cash, longPercent, shortPercent, recipient);
  }

  async doRemoveLiquidity(market: string, paraShareToken: string, fee: BigNumber, lpTokens: BigNumber, alsoSell: Boolean): Promise<TransactionResponse> {
    const minSetsSold = alsoSell
      ? (await this.getRemoveLiquidity(market, paraShareToken, fee, lpTokens, true)).sets
      : new BigNumber(0);
    return this.intermediary(paraShareToken).removeLiquidity(market, paraShareToken, fee, lpTokens, minSetsSold);
  }

  async getRemoveLiquidity(market: string, paraShareToken: string, fee: BigNumber, lpTokens: BigNumber, alsoSell: Boolean): Promise<RemoveLiquidityRate> {
    const minSetsSold = new BigNumber(alsoSell ? 1 : 0);
    return this.intermediary(paraShareToken).rateRemoveLiquidity(market, paraShareToken, fee, lpTokens, minSetsSold);
  }

  async doSwap(market: string, paraShareToken: string, fee: BigNumber, inputShares: BigNumber, buyLong: Boolean, minShares: BigNumber): Promise<TransactionResponse> {
    return this.intermediary(paraShareToken).swap(market, paraShareToken, fee, inputShares, buyLong, minShares);
  }

  async getSwap(market: string, paraShareToken: string, fee: BigNumber, inputShares: BigNumber, buyLong: Boolean, includeFee: Boolean): Promise<BigNumber> {
    const inputLong = !buyLong;

    const exchange = await this.intermediary(paraShareToken).calculateExchangeAddress(market, paraShareToken, fee);
    const { yes: poolYes, no: poolNo } = await this.intermediary(paraShareToken).shareBalances(market, paraShareToken, fee, exchange);

    const outputShares = inputLong
      ? AMM.calculateSwap(poolNo, poolYes, inputShares)
      : AMM.calculateSwap(poolYes, poolNo, inputShares)
    return includeFee
      ? AMM.applyFee(outputShares, fee)
      : outputShares;
  }

  async doEnterPosition(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, buyLong: Boolean, minShares: BigNumber): Promise<TransactionResponse> {
    console.log("Enter Position:", market, paraShareToken, fee.toFixed(), cash.toFixed(), buyLong, minShares.toFixed());
    return this.intermediary(paraShareToken).enterPosition(market, paraShareToken, fee, cash, buyLong, minShares);
  }

  async getEnterPosition(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, buyLong: Boolean, includeFee: Boolean): Promise<BigNumber> {
    const setsToBuy = cash.idiv(NUMTICKS);
    const exchange = await this.intermediary(paraShareToken).calculateExchangeAddress(market, paraShareToken, fee);
    let { yes: poolYes, no: poolNo } = await this.intermediary(paraShareToken).shareBalances(market, paraShareToken, fee, exchange);
    poolNo = poolNo.minus(setsToBuy);
    poolYes = poolYes.minus(setsToBuy);

    if (poolNo.lt(0) || poolYes.lt(0)) {
      AMM.throwExchangeLacksShares(exchange);
    }

    let swappedForShares = buyLong
      ? AMM.calculateSwap(poolYes, poolNo, setsToBuy)
      : AMM.calculateSwap(poolNo, poolYes, setsToBuy)
    const outputShares = setsToBuy.plus(swappedForShares);
    return includeFee
      ? AMM.applyFee(outputShares, fee)
      : outputShares;
  }

  async doExitPosition(market: string, paraShareToken: string, fee: BigNumber, shortShares: BigNumber, longShares: BigNumber, minCash: BigNumber): Promise<TransactionResponse> {
    return this.intermediary(paraShareToken).exitPosition(market, paraShareToken, fee, shortShares, longShares, minCash);
  }

  async getExitPosition(market: string, paraShareToken: string, fee: BigNumber, shortShares: BigNumber, longShares: BigNumber, includeFee: Boolean): Promise<BigNumber> {
    const exchange = await this.intermediary(paraShareToken).calculateExchangeAddress(market, paraShareToken, fee);
    let { yes: poolLong, no: poolShort } = await this.intermediary(paraShareToken).shareBalances(market, paraShareToken, fee, exchange);

    let setsToSell = new BigNumber(shortShares); // if they are identical, sets to sell is equal to either
    if (longShares.gt(shortShares)) {
      const delta = longShares.minus(shortShares);
      const shortShareToBuy = AMM.quadratic(
        new BigNumber(1),
        AMM.neg(delta.plus(poolLong).plus(poolShort)),
        delta.times(poolShort),
        longShares
      );
      setsToSell = shortShares.plus(shortShareToBuy);
    } else if (shortShares.gt(longShares)) {
      const delta = shortShares.minus(longShares);
      const longSharesToBuy = AMM.quadratic(
        new BigNumber(1),
        AMM.neg(delta.plus(poolLong).plus(poolShort)),
        delta.times(poolLong),
        shortShares
      );
      setsToSell = longShares.plus(longSharesToBuy);
    }

    const cash = setsToSell.times(NUMTICKS);
    return includeFee
      ? AMM.applyFee(cash, fee)
      : cash;
  }

  async exchangeAddress(market: string, paraShareToken: string, fee: BigNumber): Promise<string> {
    return this.intermediary(paraShareToken).exchanges(market, paraShareToken, fee);
  }

  async calculateExchangeAddress(market: string, paraShareToken: string, fee: BigNumber): Promise<string> {
    return this.intermediary(paraShareToken).calculateExchangeAddress(market, paraShareToken, fee);
  }

  async supplyOfLiquidityTokens(market: string, paraShareToken: string, fee: BigNumber): Promise<BigNumber> {
    return this.intermediary(paraShareToken).totalSupply(market, paraShareToken, fee)
  }

  async liquidityTokenBalance(market: string, paraShareToken: string, fee: BigNumber, account: string): Promise<BigNumber> {
    return this.intermediary(paraShareToken).balanceOf(market, paraShareToken, fee, account);
  }

  async approveSpendingOfLiquidityTokens(market: string, paraShareToken: string, fee: BigNumber, spender: string, amount: BigNumber) {
    return this.intermediary(paraShareToken).approveLPTokens(market, paraShareToken, fee, spender, amount);
  }

  // Private methods

  private async doAddSubsequentLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, recipient: string): Promise<TransactionResponse> {
    return this.intermediary(paraShareToken).addLiquidity(market, paraShareToken, fee, cash, recipient);
  }

  private async getAddSubsequentLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, recipient: string): Promise<BigNumber> {
    return this.intermediary(paraShareToken).rateAddLiquidity(market, paraShareToken, fee, cash, recipient);
  }

  private async doAddInitialLiquidity(
    market: string, paraShareToken: string, fee: BigNumber,
    cash: BigNumber,
    longPercent: BigNumber,
    shortPercent: BigNumber,
    recipient: string
  ): Promise<TransactionResponse> {
    const keepLong = AMM.keepLong(longPercent, shortPercent);
    const ratio = AMM.calculateLiquidityRatio(longPercent, shortPercent);
    return this.intermediary(paraShareToken).addInitialLiquidity(market, paraShareToken, fee, cash, ratio, keepLong, recipient);
  }

  private async getAddInitialLiquidity(
    market: string, paraShareToken: string, fee: BigNumber,
    cash: BigNumber,
    longPercent: BigNumber,
    shortPercent: BigNumber,
    recipient: string
  ): Promise<BigNumber> {
    const keepLong = AMM.keepLong(longPercent, shortPercent);
    const ratio = AMM.calculateLiquidityRatio(longPercent, shortPercent);
    return this.intermediary(paraShareToken).rateAddInitialLiquidity(market, paraShareToken, fee, cash, ratio, keepLong, recipient);
  }

  private async doCreateExchangeWithLiquidity(
    market: string,
    paraShareToken: string,
    fee: BigNumber,
    cash: BigNumber,
    longPercent: BigNumber,
    shortPercent: BigNumber,
    recipient: string
  ): Promise<TransactionResponse> {
    const keepLong = AMM.keepLong(longPercent, shortPercent);
    const ratio = AMM.calculateLiquidityRatio(longPercent, shortPercent);
    return this.intermediary(paraShareToken).addAMMWithLiquidity(market, paraShareToken, fee, cash, ratio, keepLong, recipient);
  }

  private async getCreateExchangeWithLiquidity(
    market: string,
    paraShareToken: string,
    fee: BigNumber,
    cash: BigNumber,
    longPercent: BigNumber,
    shortPercent: BigNumber,
    recipient: string
  ): Promise<BigNumber> {
    const keepLong = AMM.keepLong(longPercent, shortPercent);
    const ratio = AMM.calculateLiquidityRatio(longPercent, shortPercent);
    return this.intermediary(paraShareToken).rateAddAMMWithLiquidity(market, paraShareToken, fee, cash, ratio, keepLong, recipient);
  }

  private static calculateLiquidityRatio(longPercent: BigNumber, shortPercent: BigNumber) {
    const factor = new BigNumber(10 ** 18);
    const keepLong = AMM.keepLong(longPercent, shortPercent);
    return (keepLong
        ? factor.times(longPercent).idiv(shortPercent)
        : factor.times(shortPercent).idiv(longPercent)
    )
  }

  private static calculateSwap(reserveA: BigNumber, reserveB: BigNumber, deltaB: BigNumber): BigNumber {
    const k = reserveA.times(reserveB);
    return reserveA.minus(k.idiv(reserveB.plus(deltaB)));
  }

  private static applyFee(amount: BigNumber, fee: BigNumber): BigNumber {
    return amount.times(new BigNumber(1000).minus(fee)).idiv(1000);
  }

  // From AMMExchange.sol
  private static quadratic(a: BigNumber, b: BigNumber, c: BigNumber, max: BigNumber): BigNumber {
    const neg = (n: BigNumber) => new BigNumber(-1).times(n);

    const piece = AMM.sqrt(b.pow(2).minus(a.times(c).times(4)));
    const denom = a.times(2);
    let resultPlus = neg(b).plus(piece).idiv(denom);
    let resultMinus = neg(b).minus(piece).idiv(denom);

    if (resultMinus.lt(0)) resultMinus = neg(resultMinus);
    if (resultPlus.lt(0)) resultPlus = neg(resultPlus);
    return resultPlus.gt(max)
      ? resultMinus
      : resultPlus
  }

  // From SafeMathUint256.sol
  private static sqrt(y: BigNumber): BigNumber {
    let z = new BigNumber(0);
    if (y.gt(3)) {
      let x = y.plus(1).idiv(2);
      z = y;
      while (x.lt(z)) {
        z = x;
        x = y.idiv(x).plus(x).idiv(2);
      }
    } else if (!y.eq(0)) {
      z = new BigNumber(1);
    }
    return z;
  }

  private static neg(n: BigNumber): BigNumber {
    return new BigNumber(-1).times(n);
  }

  private static keepLong(longPercent: BigNumber, shortPercent: BigNumber): Boolean {
    return shortPercent.gt(longPercent);
  }

  private static exchangeExists(address: string): boolean {
    return address !== NULL_ADDRESS
  }

  private static throwExchangeAlreadyExists(market: string, paraShareToken: string, fee: BigNumber) {
    throw Error(`Cannot create an already-existing AMM: ${market}/${paraShareToken}/${fee.toFixed()}`);
  }

  private static throwExchangeLacksShares(address: string) {
    throw Error(`The AMM ${address} does not have enough shares to fulfill the request`);
  }
}

export interface ShareBalances {
  invalid: BigNumber
  no: BigNumber
  yes: BigNumber
}

export interface RemoveLiquidityRate {
  short: BigNumber
  long: BigNumber
  cash: BigNumber
  sets: BigNumber
}

export interface ExchangeContractIntermediary {
  forEth: Boolean

  addAMM(market: string, paraShareToken: string, fee: BigNumber): Promise<TransactionResponse>
  addAMMWithLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, ratio: BigNumber, keepLong: Boolean, recipient: string): Promise<TransactionResponse>
  rateAddAMMWithLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, ratio: BigNumber, keepLong: Boolean, recipient: string): Promise<BigNumber>

  addInitialLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, ratio: BigNumber, keepLong: Boolean, recipient: string): Promise<TransactionResponse>
  rateAddInitialLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, ratio: BigNumber, keepLong: Boolean, recipient: string): Promise<BigNumber>
  addLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, recipient: string): Promise<TransactionResponse>
  rateAddLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, recipient: string): Promise<BigNumber>
  removeLiquidity(market: string, paraShareToken: string, fee: BigNumber, lpTokens: BigNumber, minSetsSold: BigNumber): Promise<TransactionResponse>
  rateRemoveLiquidity(market: string, paraShareToken: string, fee: BigNumber, lpTokens: BigNumber, minSetsSold: BigNumber): Promise<RemoveLiquidityRate>

  swap(market: string, paraShareToken: string, fee: BigNumber, inputShares: BigNumber, buyLong: Boolean, minShares: BigNumber): Promise<TransactionResponse>
  enterPosition(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, buyLong: Boolean, minShares: BigNumber): Promise<TransactionResponse>
  exitPosition(market: string, paraShareToken: string, fee: BigNumber, shortShares: BigNumber, longShares: BigNumber, minCash: BigNumber): Promise<TransactionResponse>
  rateExitPosition(market: string, paraShareToken: string, fee: BigNumber, shortShares: BigNumber, longShares: BigNumber): Promise<BigNumber>

  calculateExchangeAddress(market: string, paraShareToken: string, fee: BigNumber): Promise<string>
  exchanges(market: string, paraShareToken: string, fee: BigNumber): Promise<string>
  totalSupply(market: string, paraShareToken: string, fee: BigNumber): Promise<BigNumber>
  balanceOf(market: string, paraShareToken: string, fee: BigNumber, account: string): Promise<BigNumber>
  shareBalances(market: string, paraShareToken: string, fee: BigNumber, account: string): Promise<ShareBalances>
  approveLPTokens(market: string, paraShareToken: string, fee: BigNumber, spender: string, amount: BigNumber): Promise<void>
}

class ExchangeCommon {
  readonly factory: ethers.Contract;
  readonly signerOrProvider: SignerOrProvider;

  constructor(factoryAddress: string, signerOrProvider: SignerOrProvider) {
    this.signerOrProvider = signerOrProvider;
    this.factory = new ethers.Contract(factoryAddress, AMMFactoryAbi, signerOrProvider);
  }

  async addAMM(market: string, paraShareToken: string, fee: BigNumber): Promise<TransactionResponse> {
    return this.factory.addAMM(market, paraShareToken, fee.toFixed());
  }

  async rateAddAMMWithLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, ratio: BigNumber, keepLong: Boolean, recipient: string): Promise<BigNumber> {
    return this.factory.callStatic.addAMMWithLiquidity(market, paraShareToken, fee.toFixed(), cash.toFixed(), ratio.toFixed(), keepLong, recipient);
  }

  async rateAddInitialLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, ratio: BigNumber, keepLong: Boolean, recipient: string): Promise<BigNumber> {
    const exchangeAddress = await this.calculateExchangeAddress(market, paraShareToken, fee);
    const amm = this.exchangeContract(exchangeAddress);
    const lpTokens = await amm.callStatic.addInitialLiquidity(cash.toFixed(), ratio.toFixed(), keepLong, recipient);
    return new BigNumber(lpTokens.toString());
  }

  async rateAddLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, recipient: string): Promise<BigNumber> {
    const exchangeAddress = await this.calculateExchangeAddress(market, paraShareToken, fee);
    const amm = this.exchangeContract(exchangeAddress);
    const lpTokens = await amm.callStatic.addLiquidity(cash.toFixed(), recipient);
    return new BigNumber(lpTokens.toString());
  }

  async rateRemoveLiquidity(market: string, paraShareToken: string, fee: BigNumber, lpTokens: BigNumber, minSetsSold: BigNumber): Promise<RemoveLiquidityRate> {
    const exchangeAddress = await this.calculateExchangeAddress(market, paraShareToken, fee);
    const amm = this.exchangeContract(exchangeAddress);
    const { _shortShare, _longShare, _cashShare, _setsSold } = await amm.rateRemoveLiquidity(lpTokens.toFixed(), minSetsSold.toFixed());
    return {
      short: new BigNumber(_shortShare.toString()),
      long: new BigNumber(_longShare.toString()),
      cash: new BigNumber(_cashShare.toString()),
      sets: new BigNumber(_setsSold.toString()),
    }
  }

  async swap(market: string, paraShareToken: string, fee: BigNumber, inputShares: BigNumber, buyLong: Boolean, minShares: BigNumber): Promise<TransactionResponse> {
    const exchangeAddress = await this.calculateExchangeAddress(market, paraShareToken, fee);
    const amm = this.exchangeContract(exchangeAddress);
    const inputLong = !buyLong;
    return amm.swap(inputShares.toFixed(), inputLong, minShares.toFixed());
  }

  async rateExitPosition(market: string, paraShareToken: string, fee: BigNumber, shortShares: BigNumber, longShares: BigNumber): Promise<BigNumber> {
    const exchangeAddress = await this.calculateExchangeAddress(market, paraShareToken, fee);
    const amm = this.exchangeContract(exchangeAddress);
    const _cashPayout = await amm.rateExitPosition(shortShares.toFixed(), longShares.toFixed());
    return new BigNumber(_cashPayout.toString());
  }

  async calculateExchangeAddress(market: string, paraShareToken: string, fee: BigNumber): Promise<string> {
    return this.factory.calculateAMMAddress(market, paraShareToken, fee.toFixed());
  }

  async exchanges(market: string, paraShareToken: string, fee: BigNumber): Promise<string> {
    return this.factory.exchanges(market, paraShareToken, fee.toFixed());
  }

  async totalSupply(market: string, paraShareToken: string, fee: BigNumber): Promise<BigNumber> {
    const exchangeAddress = await this.calculateExchangeAddress(market, paraShareToken, fee);
    const amm = this.exchangeContract(exchangeAddress);
    const lpTokens = await amm.totalSupply();
    return new BigNumber(lpTokens.toString());
  }

  async balanceOf(market: string, paraShareToken: string, fee: BigNumber, account: string): Promise<BigNumber> {
    const exchangeAddress = await this.calculateExchangeAddress(market, paraShareToken, fee);
    const amm = this.exchangeContract(exchangeAddress);
    const lpTokens = await amm.balanceOf(account);
    return new BigNumber(lpTokens.toString());
  }

  async shareBalances(market: string, paraShareToken: string, fee: BigNumber, account: string): Promise<ShareBalances> {
    const exchangeAddress = await this.calculateExchangeAddress(market, paraShareToken, fee);
    const amm = this.exchangeContract(exchangeAddress);
    const { _invalid, _no, _yes } = await amm.shareBalances(account);
    return {
      invalid: new BigNumber(_invalid.toString()),
      no: new BigNumber(_no.toString()),
      yes: new BigNumber(_yes.toString()),
    }
  }

  async approveLPTokens(market: string, paraShareToken: string, fee: BigNumber, spender: string, amount: BigNumber): Promise<void> {
    const exchangeAddress = await this.calculateExchangeAddress(market, paraShareToken, fee);
    const amm = this.exchangeContract(exchangeAddress);
    return amm.approve(spender, amount.toString());
  }

  protected exchangeContract(address: string): ethers.Contract {
    return new ethers.Contract(address, AMMExchangeAbi, this.signerOrProvider);
  }
}

export class ExchangeERC20 extends ExchangeCommon implements ExchangeContractIntermediary {
  readonly factory: ethers.Contract;
  readonly signerOrProvider: SignerOrProvider;

  constructor(signerOrProvider: SignerOrProvider, factoryAddress: string) {
    super(factoryAddress, signerOrProvider);
  }

  get forEth() {
    return false
  }

  async addAMMWithLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, ratio: BigNumber, keepLong: Boolean, recipient: string): Promise<TransactionResponse> {
    return this.factory.addAMMWithLiquidity(market, paraShareToken, fee.toFixed(), cash.toFixed(), ratio.toFixed(), keepLong, recipient);
  }

  async addInitialLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, ratio: BigNumber, keepLong: Boolean, recipient: string): Promise<TransactionResponse> {
    const exchangeAddress = await this.calculateExchangeAddress(market, paraShareToken, fee);
    const amm = this.exchangeContract(exchangeAddress);
    return amm.addInitialLiquidity(cash.toFixed(), ratio.toFixed(), keepLong, recipient);
  }

  async addLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, recipient: string): Promise<TransactionResponse> {
    const exchangeAddress = await this.calculateExchangeAddress(market, paraShareToken, fee);
    const amm = this.exchangeContract(exchangeAddress);
    return amm.addLiquidity(cash.toFixed(), recipient);
  }

  async removeLiquidity(market: string, paraShareToken: string, fee: BigNumber, lpTokens: BigNumber, minSetsSold: BigNumber): Promise<TransactionResponse> {
    const exchangeAddress = await this.calculateExchangeAddress(market, paraShareToken, fee);
    const amm = this.exchangeContract(exchangeAddress);
    return amm.removeLiquidity(lpTokens.toFixed(), minSetsSold.toFixed());
  }

  async enterPosition(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, buyLong: Boolean, minShares: BigNumber): Promise<TransactionResponse> {
    const exchangeAddress = await this.calculateExchangeAddress(market, paraShareToken, fee);
    const amm = this.exchangeContract(exchangeAddress);
    return amm.enterPosition(cash.toFixed(), buyLong, minShares.toFixed());
  }

  async exitPosition(market: string, paraShareToken: string, fee: BigNumber, shortShares: BigNumber, longShares: BigNumber, minCash: BigNumber): Promise<TransactionResponse> {
    const exchangeAddress = await this.calculateExchangeAddress(market, paraShareToken, fee);
    const amm = this.exchangeContract(exchangeAddress);
    return amm.exitPosition(shortShares.toFixed(), longShares.toFixed(), minCash.toFixed());
  }

}

export class ExchangeETH extends ExchangeCommon implements ExchangeContractIntermediary {
  readonly wrapper: ethers.Contract;

  constructor(signerOrProvider: SignerOrProvider, factoryAddress: string, wrapperAddress: string) {
    super(factoryAddress, signerOrProvider);
    this.wrapper = new ethers.Contract(wrapperAddress, WethWrapperForAMMExchangeAbi, signerOrProvider);
  }

  get forEth() {
    return true
  }

  async addAMMWithLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, ratio: BigNumber, keepLong: Boolean, recipient: string): Promise<TransactionResponse> {
    return this.wrapper.addAMMWithLiquidity(market, fee.toFixed(), ratio.toFixed(), keepLong, recipient, { value: cash.toFixed() });
  }

  async addInitialLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, ratio: BigNumber, keepLong: Boolean, recipient: string): Promise<TransactionResponse> {
    return this.wrapper.addInitialLiquidity(market, fee.toFixed(), keepLong, recipient, { value: cash.toFixed() });
  }

  async addLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, recipient: string): Promise<TransactionResponse> {
    return this.wrapper.addLiquidity(market, fee.toFixed(), recipient, { value: cash.toFixed() })
  }

  async removeLiquidity(market: string, paraShareToken: string, fee: BigNumber, lpTokens: BigNumber, minSetsSold: BigNumber): Promise<TransactionResponse> {
    return this.wrapper.removeLiquidity(market, fee.toFixed(), lpTokens.toFixed(), minSetsSold.toFixed());
  }

  async enterPosition(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, buyLong: Boolean, minShares: BigNumber): Promise<TransactionResponse> {
    return this.wrapper.enterPosition(market, fee.toFixed(), buyLong, minShares.toFixed(), { value: cash.toFixed()} );
  }

  async exitPosition(market: string, paraShareToken: string, fee: BigNumber, shortShares: BigNumber, longShares: BigNumber, minCash: BigNumber): Promise<TransactionResponse> {
    return this.wrapper.exitPosition(market, fee.toFixed(), shortShares.toFixed(), longShares.toFixed(), minCash.toFixed());
  }

}


//     function addAMMWithLiquidity (
//         IMarket _market,
//         uint256 _fee,
//         uint256 _ratioFactor,
//         bool _keepLong,
//         address _recipient
