import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber } from 'bignumber.js';
import { NULL_ADDRESS, SignerOrProvider } from '../constants';
import {
  ExchangeContractIntermediary,
  ExchangeERC20,
  ExchangeETH,
  RemoveLiquidityRate,
} from './exchangeIntermediaries';

const NUMTICKS = new BigNumber(1000); // Hardcoded because all AMMs are Y/N markets for now.

export interface AddLiquidityRate {
  short: BigNumber
  long: BigNumber
  cash: BigNumber
  lpTokens: BigNumber
};

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
    totalSupply:BigNumber,
    noBalance:BigNumber,
    yesBalance:BigNumber,
    cashBalance:BigNumber,
    cash: BigNumber = new BigNumber(0),
    longPercent = new BigNumber(50),
    shortPercent = new BigNumber(50)
  ): Promise<AddLiquidityRate> {
    if (cash.eq(0)) {
      return {
        cash: new BigNumber(0),
        long: new BigNumber(0),
        lpTokens: new BigNumber(0),
        short: new BigNumber(0)
      };
    }

    const factor = new BigNumber(10 ** 18);

    const keepLong = AMM.keepLong(longPercent, shortPercent);
    const ratio = AMM.calculateLiquidityRatio(longPercent, shortPercent);

    const setsToBuy = cash.div(NUMTICKS);
    let longShares = setsToBuy;
    let shortShares = setsToBuy;

    if(keepLong) {
      longShares = setsToBuy.times(ratio.div(factor));
    } else {
      shortShares = setsToBuy.times(ratio.div(factor));
    }

    const lpTokens = this.getRateAddLiquidity(
      longShares,
      shortShares,
      totalSupply,
      noBalance,
      yesBalance,
      cashBalance
    );

    let longSharesToUsers = new BigNumber(0);
    let shortSharesToUser = new BigNumber(0);
    if(!ratio.eq(factor)) {
      if(keepLong) {
        longSharesToUsers = setsToBuy.minus(longShares);
      } else {
        shortSharesToUser = setsToBuy.minus(shortShares);
      }
    }

    return {
      cash,
      lpTokens,
      short: shortSharesToUser,
      long: longSharesToUsers
    }
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

  private getRateAddLiquidity(
    longs:BigNumber,
    shorts:BigNumber,
    totalSupply:BigNumber,
    noBalance:BigNumber,
    yesBalance:BigNumber,
    cashBalance:BigNumber
  ) {
    const normalizedCashBalance = cashBalance.div(NUMTICKS);
    const longBalance = yesBalance.plus(normalizedCashBalance);
    const shortBalance = noBalance.plus(normalizedCashBalance);

    const priorLiquidityConstant = AMM.sqrt(longBalance.times(shortBalance));
    const newLiquidityConstant = AMM.sqrt((longBalance.plus(longs).times(shortBalance.plus(shorts))));

    if(priorLiquidityConstant.eq(0)) {
      return newLiquidityConstant;
    } else {
      return totalSupply.times(newLiquidityConstant).div(priorLiquidityConstant).minus(totalSupply);
    }
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

//     function addAMMWithLiquidity (
//         IMarket _market,
//         uint256 _fee,
//         uint256 _ratioFactor,
//         bool _keepLong,
//         address _recipient
