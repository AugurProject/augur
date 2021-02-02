import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import { WethWrapperForAMMExchangeAbi } from '../../abi/WethWrapperForAMMExchangeAbi';
import { SignerOrProvider } from '../../constants';
import { ExchangeCommon } from './ExchangeCommon';
import { ExchangeContractIntermediary } from './index';

export class ExchangeETH extends ExchangeCommon implements ExchangeContractIntermediary {
  readonly wrapper: ethers.Contract;

  constructor(signerOrProvider: SignerOrProvider, factoryAddress: string, wrapperAddress: string) {
    super(factoryAddress, signerOrProvider);
    this.wrapper = new ethers.Contract(wrapperAddress, WethWrapperForAMMExchangeAbi, signerOrProvider);
  }

  get forEth() {
    return true
  }

  async rateAddLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, recipient: string): Promise<BigNumber> {
    return this.wrapper.callStatic.addLiquidity(market, fee.toFixed(), recipient, { value: cash.toFixed() });
  }

  async rateAddAMMWithLiquidity(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, ratio: BigNumber, keepLong: Boolean, recipient: string): Promise<BigNumber> {
    return this.wrapper.callStatic.addAMMWithLiquidity(market, fee.toFixed(), ratio.toFixed(), keepLong, recipient);
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

  async enterPosition(market: string, paraShareToken: string, fee: BigNumber, cash: BigNumber, buyLong: Boolean, minShares: BigNumber): Promise<TransactionResponse> {
    return this.wrapper.enterPosition(market, fee.toFixed(), buyLong, minShares.toFixed(), { value: cash.toFixed()} );
  }

  async exitPosition(market: string, paraShareToken: string, fee: BigNumber, shortShares: BigNumber, longShares: BigNumber, minCash: BigNumber): Promise<TransactionResponse> {
    return this.wrapper.exitPosition(market, fee.toFixed(), shortShares.toFixed(), longShares.toFixed(), minCash.toFixed());
  }

  async claimMarketsProceeds(_markets:string[], _shareTokens:string[], _shareHolder: string, _fingerprint: string) {
    return this.wrapper.claimMarketsProceeds(_markets, _shareTokens, _shareHolder, _fingerprint);
  }
}
