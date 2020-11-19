import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import { AMMFactoryAbi } from '../abi/AMMFactoryAbi';
import { AMMExchangeAbi } from '../abi/AMMExchangeAbi';
import { NULL_ADDRESS, SignerOrProvider } from '../constants';
import { TransactionResponse } from '@ethersproject/abstract-provider';


const NUMTICKS = new BigNumber(1000); // Hardcoded because all AMMs are Y/N markets for now.

export class AMM {
  readonly signerOrProvider: SignerOrProvider;
  readonly contract: ethers.Contract;

  constructor(signerOrProvider: SignerOrProvider, address: string) {
    this.signerOrProvider = signerOrProvider;
    this.contract = new ethers.Contract(address, AMMFactoryAbi, signerOrProvider);
  }

  async createExchange(market: string, paraShareToken: string, fee: BigNumber): Promise<TransactionResponse> {
    return this.contract.addAMM(market, paraShareToken, fee.toFixed());
  }

  async doAddLiquidity(
    recipient: string,
    existingAmmAddress: string,
    hasLiquidity: boolean,
    market: string,
    paraShareToken: string,
    fee: BigNumber,
    cash: BigNumber = new BigNumber(0),
    yesPercent = new BigNumber(50),
    noPercent = new BigNumber(50)
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
        return this.doAddSubsequentLiquidity(exchangeAddress, cash, recipient);
      } else {
        return this.doAddInitialLiquidity(exchangeAddress, cash, yesPercent, noPercent, recipient);
      }
    }

    // Create new AMM with liquidity
    return this.doCreateExchangeWithLiquidity(market, paraShareToken, fee, cash, yesPercent, noPercent, recipient);
  }

  async getAddLiquidity(
    recipient: string,
    existingAmmAddress: string,
    hasLiquidity: boolean,
    market: string,
    paraShareToken: string,
    fee: BigNumber,
    cash: BigNumber = new BigNumber(0),
    yesPercent = new BigNumber(50),
    noPercent = new BigNumber(50)
  ): Promise<BigNumber> {
    const exchangeAddress = existingAmmAddress || await this.exchangeAddress(market, paraShareToken, fee);

    if (cash.eq(0)) {
      return new BigNumber(0);
    }

    // Just add liquidity
    if (AMM.exchangeExists(exchangeAddress)) {
      if (hasLiquidity) {
        return this.getAddSubsequentLiquidity(exchangeAddress, cash, recipient);
      } else {
        return this.getAddInitialLiquidity(exchangeAddress, cash, yesPercent, noPercent, recipient);
      }
    }

    // Create new AMM with liquidity
    return this.getCreateExchangeWithLiquidity(market, paraShareToken, fee, cash, yesPercent, noPercent, recipient);
  }

  async doRemoveLiquidity(address: string, lpTokens: BigNumber, alsoSell: Boolean): Promise<TransactionResponse> {
    if (!address) return null;
    const amm = this.exchangeContract(address);

    const minSetsSold = alsoSell
      ? (await this.getRemoveLiquidity(address, lpTokens, true)).sets
      : new BigNumber(0);

    return amm.removeLiquidity(lpTokens.toFixed(), minSetsSold.toFixed());
  }

  async getRemoveLiquidity(address: string, lpTokens: BigNumber, alsoSell: Boolean): Promise<RemoveLiquidityRate> {
    if (!address) return null;
    const amm = this.exchangeContract(address);

    const {
      _invalidShare: invalid,
      _noShare: no,
      _yesShare: yes,
      _cashShare: cash,
      _setsSold: sets
    } = await amm.rateRemoveLiquidity(lpTokens.toFixed(), alsoSell ? 1 : 0);
    return {
      invalid: new BigNumber(invalid.toString()),
      no: new BigNumber(no.toString()),
      yes: new BigNumber(yes.toString()),
      cash: new BigNumber(cash.toString()),
      sets: new BigNumber(sets.toString()),
    }
  }

  async doSwap(address: string, inputShares: BigNumber, buyYes: Boolean, minShares: BigNumber): Promise<TransactionResponse> {
    if (!address) return null;
    const inputYes = !buyYes;
    const amm = this.exchangeContract(address);
    console.log(`amm.swap(${inputShares.toFixed()}, ${inputYes}, ${minShares.toFixed()})`);
    return amm.swap(inputShares.toFixed(), inputYes, "0");
  }

  async getSwap(address: string, inputShares: BigNumber, buyYes: Boolean, includeFee: Boolean): Promise<BigNumber> {
    if (!address) return null;
    const inputYes = !buyYes;

    let fee = new BigNumber(0);
    if (includeFee) fee = await this.getFee(address);

    const { yes: poolYes, no: poolNo } = await this.getBalances(address, address);
    const poolConstant = AMM.calculatePoolConstant(poolYes, poolNo, fee);

    return inputYes
      ? poolNo.minus(poolConstant.idiv(poolYes.plus(inputShares)))
      : poolYes.minus(poolConstant.idiv(poolNo.plus(inputShares)));
  }

  async doEnterPosition(address: string, cash: BigNumber, buyYes: Boolean, minShares: BigNumber): Promise<TransactionResponse> {
    if (!address) return null;
    const amm = this.exchangeContract(address);
    return amm.enterPosition(cash.toFixed(), buyYes, minShares.toFixed());
  }

  async getEnterPosition(address: string, cash: BigNumber, buyYes: Boolean, includeFee: Boolean): Promise<BigNumber> {
    if (!address) return null;

    let fee = new BigNumber(0);
    if (includeFee) fee = await this.getFee(address);

    const setsToBuy = cash.idiv(NUMTICKS);
    let { invalid: poolInvalid, no: poolNo, yes: poolYes } = await this.getBalances(address, address);
    poolInvalid = poolInvalid.minus(setsToBuy);
    poolNo = poolNo.minus(setsToBuy);
    poolYes = poolYes.minus(setsToBuy);

    if (poolInvalid.lt(0) || poolNo.lt(0) || poolYes.lt(0)) {
      AMM.throwExchangeLacksShares(address);
    }
    const poolConstant = AMM.calculatePoolConstant(poolYes, poolNo, fee);

    return buyYes
      ? setsToBuy.plus(poolYes.minus(poolConstant.idiv(poolNo.plus(setsToBuy))))
      : setsToBuy.plus(poolNo.minus(poolConstant.idiv(poolYes.plus(setsToBuy))));
  }

  async doExitPosition(address: string, invalidShares: BigNumber, noShares: BigNumber, yesShares: BigNumber, minCash: BigNumber): Promise<TransactionResponse> {
    if (!address) return null;
    const amm = this.exchangeContract(address);
    return amm.exitPosition(invalidShares.toFixed(), noShares.toFixed(), yesShares.toFixed(), minCash.toFixed());
  }

  async getExitPosition(address: string, invalidShares: BigNumber, noShares: BigNumber, yesShares: BigNumber, includeFee: Boolean): Promise<ExitPositionRate> {
    if (!address) return null;

    if (!includeFee) throw Error('Not implemented: getExitPosition(includeFee=false)');

  const amm = this.exchangeContract(address);
    const {
      _cashPayout: cash,
      _invalidFromUser: invalid,
      _noFromUser: no,
      _yesFromUser: yes,
    } = await amm.rateExitPosition(invalidShares.toFixed(), noShares.toFixed(), yesShares.toFixed());
    return {
      invalid: new BigNumber(invalid.toString()),
      no: new BigNumber(no.toString()),
      yes: new BigNumber(yes.toString()),
      cash: new BigNumber(cash.toString()),
    }
  }

  async exchangeAddress(market: string, paraShareToken: string, fee: BigNumber): Promise<string> {
    return this.contract.exchanges(market, paraShareToken, fee.toFixed());
  }

  async calculateExchangeAddress(market: string, paraShareToken: string, fee: BigNumber): Promise<string> {
    return this.contract.calculateAMMAddress(market, paraShareToken, fee.toFixed());
  }

  async exchangeLiquidity(address: string): Promise<BigNumber> {
    const amm = this.exchangeContract(address);
    const lpTokens = await amm.totalSupply()
    return new BigNumber(lpTokens.toString());
  }

  async liquidityTokenBalance(exchange: string, account: string): Promise<BigNumber> {
    const amm = this.exchangeContract(exchange);
    const lpTokens = await amm.balanceOf(account);
    return new BigNumber(lpTokens.toString());
  }

  // Private methods

  private async getFee(address: string): Promise<BigNumber> {
    const amm = this.exchangeContract(address);
    const fee = await amm.fee()
    return new BigNumber(fee.toString());
  }

  private async getBalances(exchange: string, account: string): Promise<ShareBalances> {
    const amm = this.exchangeContract(exchange);
    const balances = await amm.shareBalances(account);
    return {
      invalid: new BigNumber(balances._invalid.toString()),
      no: new BigNumber(balances._no.toString()),
      yes: new BigNumber(balances._yes.toString()),
    }
  }

  private async doAddSubsequentLiquidity(address: string, cash: BigNumber, recipient: string): Promise<TransactionResponse> {
    const amm = this.exchangeContract(address);
    return amm.addLiquidity(cash.toFixed(), recipient);
  }

  private async getAddSubsequentLiquidity(address: string, cash: BigNumber, recipient: string): Promise<BigNumber> {
    const amm = this.exchangeContract(address);
    const lpTokens = await amm.callStatic.addLiquidity(cash.toFixed(), recipient);
    return new BigNumber(lpTokens.toString());
  }

  private async doAddInitialLiquidity(
    address: string,
    cash: BigNumber,
    yesPercent: BigNumber,
    noPercent: BigNumber,
    recipient: string
  ): Promise<TransactionResponse> {
    const keepYes = AMM.keepYes(yesPercent, noPercent);
    const ratio = AMM.calculateLiquidityRatio(yesPercent, noPercent);
    const amm = this.exchangeContract(address);
    return amm.addInitialLiquidity(cash.toFixed(), ratio.toFixed(), keepYes, recipient);
  }

  private async getAddInitialLiquidity(
    address: string,
    cash: BigNumber,
    yesPercent: BigNumber,
    noPercent: BigNumber,
    recipient: string
  ): Promise<BigNumber> {
    const keepYes = AMM.keepYes(yesPercent, noPercent);
    const ratio = AMM.calculateLiquidityRatio(yesPercent, noPercent);
    const amm = this.exchangeContract(address);
    const lpTokens = await amm.callStatic.addInitialLiquidity(cash.toFixed(), ratio.toFixed(), keepYes, recipient);
    return new BigNumber(lpTokens.toString());
  }

  private async doCreateExchangeWithLiquidity(
    market: string,
    paraShareToken: string,
    fee: BigNumber,
    cash: BigNumber,
    yesPercent: BigNumber,
    noPercent: BigNumber,
    recipient: string
  ): Promise<TransactionResponse> {
    const keepYes = AMM.keepYes(yesPercent, noPercent);
    const ratio = AMM.calculateLiquidityRatio(yesPercent, noPercent);
    console.log('addAMMWithLiquidity', market, paraShareToken, fee.toFixed(), cash.toFixed(), ratio.toFixed(), keepYes, recipient);
    return this.contract.addAMMWithLiquidity(market, paraShareToken, fee.toFixed(), cash.toFixed(), ratio.toFixed(), keepYes, recipient);
  }

  private async getCreateExchangeWithLiquidity(
    market: string,
    paraShareToken: string,
    fee: BigNumber,
    cash: BigNumber,
    yesPercent: BigNumber,
    noPercent: BigNumber,
    recipient: string
  ): Promise<BigNumber> {
    const keepYes = AMM.keepYes(yesPercent, noPercent);
    const ratio = AMM.calculateLiquidityRatio(yesPercent, noPercent);
    const { _lpTokens } = await this.contract.callStatic.addAMMWithLiquidity(market, paraShareToken, fee.toFixed(), cash.toFixed(), ratio.toFixed(), keepYes, recipient);
    return new BigNumber(_lpTokens.toString());
  }

  private exchangeContract(address: string): ethers.Contract {
    return new ethers.Contract(address, AMMExchangeAbi, this.signerOrProvider);
  }

  // Private static methods

  private static calculateLiquidityRatio(yesPercent: BigNumber, noPercent: BigNumber) {
    const factor = new BigNumber(10 ** 18);
    const keepYes = AMM.keepYes(yesPercent, noPercent);
    return (keepYes
        ? factor.times(yesPercent).idiv(noPercent)
        : factor.times(noPercent).idiv(yesPercent)
    )
  }

  private static calculatePoolConstant(poolYes: BigNumber, poolNo: BigNumber, fee: BigNumber): BigNumber {
    const beforeFee = poolYes.times(poolNo);
    if (beforeFee.eq(0)) {
      return new BigNumber(0);
    } else {
      return beforeFee.times(new BigNumber(1000).minus(fee)).idiv(1000);
    }
  }

  private static keepYes(yesPercent: BigNumber, noPercent: BigNumber): Boolean {
    return noPercent.gt(yesPercent);
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
  invalid: BigNumber
  no: BigNumber
  yes: BigNumber
  cash: BigNumber
  sets: BigNumber
}

export interface ExitPositionRate {
  cash: BigNumber
  invalid: BigNumber
  no: BigNumber
  yes: BigNumber
}
