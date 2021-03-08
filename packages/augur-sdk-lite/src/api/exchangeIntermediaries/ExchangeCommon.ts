import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import { AMMExchangeAbi } from '../../abi/AMMExchangeAbi';
import { AMMFactoryAbi } from '../../abi/AMMFactoryAbi';
import { SignerOrProvider } from '../../constants';

export interface ShareBalances {
  invalid: BigNumber
  no: BigNumber
  yes: BigNumber
}

export interface RemoveLiquidityRate {
  short: BigNumber
  long: BigNumber
}

export const generateSymbols = (root:string) => ([
  `i${root}`,
  `n${root}`,
  `y${root}`
]);

export abstract class ExchangeCommon {
  readonly factory: ethers.Contract;
  readonly signerOrProvider: SignerOrProvider;

  constructor(factoryAddress: string, signerOrProvider: SignerOrProvider) {
    this.signerOrProvider = signerOrProvider;
    this.factory = new ethers.Contract(factoryAddress, AMMFactoryAbi, signerOrProvider);
  }

  async addAMM(market: string, paraShareToken: string, fee: BigNumber): Promise<TransactionResponse> {
    return this.factory.addAMM(market, paraShareToken, fee.toFixed());
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

  async addLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, recipient: string, symbolRoot:string): Promise<TransactionResponse> {
    return this.factory.addLiquidity(market, paraShareToken, fee.toFixed(), cash.toFixed(), recipient, cash.times(0.1).toFixed(), generateSymbols(symbolRoot));
  }

  async rateRemoveLiquidity(market: string, paraShareToken: string, fee: BigNumber, lpTokens: BigNumber): Promise<RemoveLiquidityRate> {
    const exchangeAddress = await this.calculateExchangeAddress(market, paraShareToken, fee);
    const amm = this.exchangeContract(exchangeAddress);
    const { _shortShare, _longShare } = await amm.rateRemoveLiquidity(lpTokens.toFixed());
    return {
      short: new BigNumber(_shortShare.toString()),
      long: new BigNumber(_longShare.toString()),
    }
  }

  async removeLiquidity(market: string, paraShareToken: string, fee: BigNumber, lpTokens: BigNumber, symbolRoot: string): Promise<TransactionResponse> {
    return this.factory.removeLiquidity(market, paraShareToken, fee.toFixed(), lpTokens.toFixed(), generateSymbols(symbolRoot));
  }

  async swap(market: string, paraShareToken: string, fee: BigNumber, inputShares: BigNumber, outputLong: Boolean, minShares: BigNumber): Promise<TransactionResponse> {
    const exchangeAddress = await this.calculateExchangeAddress(market, paraShareToken, fee);
    const amm = this.exchangeContract(exchangeAddress);
    return amm.swap(inputShares.toFixed(), outputLong, minShares.toFixed());
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
