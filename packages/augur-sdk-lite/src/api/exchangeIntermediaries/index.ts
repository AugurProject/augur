import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber } from 'bignumber.js';
import { RemoveLiquidityRate, ShareBalances } from './ExchangeCommon';

export interface ExchangeContractIntermediary {
  forEth: Boolean

  addAMM(
    market: string, paraShareToken: string,
    fee: BigNumber): Promise<TransactionResponse>

  addAMMWithLiquidity(
    market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber,
    ratio: BigNumber, keepLong: Boolean,
    recipient: string): Promise<TransactionResponse>

  rateAddAMMWithLiquidity(
    market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber,
    ratio: BigNumber, keepLong: Boolean, recipient: string): Promise<BigNumber>

  addInitialLiquidity(
    market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber,
    ratio: BigNumber, keepLong: Boolean,
    recipient: string): Promise<TransactionResponse>

  rateAddInitialLiquidity(
    market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber,
    ratio: BigNumber, keepLong: Boolean, recipient: string): Promise<BigNumber>

  addLiquidity(
    market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber,
    recipient: string): Promise<TransactionResponse>

  rateAddLiquidity(
    market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber,
    recipient: string): Promise<BigNumber>

  removeLiquidity(
    market: string, paraShareToken: string, fee: BigNumber, lpTokens: BigNumber
  ): Promise<TransactionResponse>

  rateRemoveLiquidity(
    market: string, paraShareToken: string, fee: BigNumber, lpTokens: BigNumber
  ): Promise<RemoveLiquidityRate>

  swap(
    market: string, paraShareToken: string, fee: BigNumber,
    inputShares: BigNumber, buyLong: Boolean,
    minShares: BigNumber): Promise<TransactionResponse>

  enterPosition(
    market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber,
    buyLong: Boolean, minShares: BigNumber): Promise<TransactionResponse>

  exitPosition(
    market: string, paraShareToken: string, fee: BigNumber,
    shortShares: BigNumber, longShares: BigNumber,
    minCash: BigNumber): Promise<TransactionResponse>

  calculateExchangeAddress(
    market: string, paraShareToken: string, fee: BigNumber): Promise<string>

  exchanges(
    market: string, paraShareToken: string, fee: BigNumber): Promise<string>

  totalSupply(
    market: string, paraShareToken: string, fee: BigNumber): Promise<BigNumber>

  balanceOf(
    market: string, paraShareToken: string, fee: BigNumber,
    account: string): Promise<BigNumber>

  shareBalances(
    market: string, paraShareToken: string, fee: BigNumber,
    account: string): Promise<ShareBalances>

  approveLPTokens(
    market: string, paraShareToken: string, fee: BigNumber, spender: string,
    amount: BigNumber): Promise<void>
}
export { ExchangeERC20 } from './ExchangeERC20';
export { ExchangeETH } from './ExchangeETH';
export { RemoveLiquidityRate } from './ExchangeCommon';
export { ShareBalances } from './ExchangeCommon';
