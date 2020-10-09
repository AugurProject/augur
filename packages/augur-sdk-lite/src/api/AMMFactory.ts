import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import { binarySearch, bnDirection } from '@augurproject/utils';
import { AMMFactoryAbi } from '../abi/AMMFactoryAbi';
import { AMMExchange } from './AMMExchange';
import { SignerOrProvider, YES_NO_NUMTICKS } from '../constants';
import { TransactionResponse } from '@ethersproject/abstract-provider';


export class AMMFactory {
  private readonly signerOrProvider: SignerOrProvider;
  private readonly contract: ethers.Contract;

  constructor(signerOrProvider: SignerOrProvider, address: string) {
    this.contract = new ethers.Contract(address, AMMFactoryAbi, signerOrProvider);

    this.signerOrProvider = signerOrProvider;
  }

  async getAMMExchange(marketAddress: string, paraShareToken: string): Promise<AMMExchange> {
    const amm = await this.contract.exchanges(marketAddress, paraShareToken);

    if (typeof amm === 'undefined') {
      throw new Error(`Market/Collateral pair ${marketAddress}/${paraShareToken} does not exist.`);
    }

    return new AMMExchange(this.signerOrProvider, amm);
  }

  async addAMM(market: string, paraShareToken: string, cash: BigNumber = new BigNumber(0), ratioYN: BigNumber = new BigNumber(1)): Promise<AddAMMReturn> {
    const ammAddress = await this.ammAddress(market, paraShareToken);
    const amm = new AMMExchange(this.signerOrProvider, ammAddress);

    if (cash.eq(0)) {
      const txr: TransactionResponse = await this.contract.addAMM(market, paraShareToken);
      const tx = await txr.wait();
      const logs = tx.logs
        .filter((log) => log.address === amm.address)
        .map((log) =>  amm.contract.interface.parseLog(log));
      console.log(JSON.stringify(logs, null, 2))
      return { amm, lpTokens: new BigNumber(0) };
    }

    // // TODO this isn't even trying to make liquidity.
    // const txr: TransactionResponse = await this.contract.addAMM(market, paraShareToken);
    // const tx = await txr.wait();
    // const logs = tx.logs
    //   .filter((log) => log.address === amm.address)
    //   .map((log) =>  amm.contract.interface.parseLog(log));
    // console.log(JSON.stringify(logs, null, 2))
    // return { amm, lpTokens: cash.div(YES_NO_NUMTICKS) };


    const setsToBuy = cash.div(YES_NO_NUMTICKS);
    const swapForYes = ratioYN.gt(1);
    const setsToSwap = new BigNumber(0); // TODO calculate to achieve ratio

    const txr: TransactionResponse = await this.contract.addAMMWithLiquidity(market, paraShareToken, setsToBuy.toFixed(), swapForYes, setsToSwap.toFixed());
    const tx = await txr.wait();
    const logs = tx.logs
      .filter((log) => log.address === amm.address)
      .map((log) =>  amm.contract.interface.parseLog(log));
    console.log(JSON.stringify(logs, null, 2))

    return { amm, lpTokens: new BigNumber(12) };


    // return { amm, lpTokens: new BigNumber(42) }; // TODO actual lpTokens gained (check logs)
    //
    // const swapForYes = ratioYN.gt(1);
    // const minSwap = new BigNumber(0);
    // const maxSwap = new BigNumber(setsToBuy);
    // console.log('MARINA', 0)
    // const setsToSwap = await binarySearch(
    //   minSwap,
    //   maxSwap,
    //   100,
    //   async (setsToSwap) => {
    //     console.log('MARINA', 1, setsToBuy.toString(), swapForYes, setsToSwap.toString())
    //     const { _yesses, _nos } = await amm.contract.sharesRateForAddLiquidityThenSwap(setsToBuy.toString(), swapForYes, setsToSwap.toString());
    //     console.log('MARINA', 2)
    //     const foundRatio: BigNumber = _yesses.div(_nos);
    //     return bnDirection(ratioYN, foundRatio);
    //   }
    // );

    // console.log(`setsToBuy: ${setsToBuy.toString()}`)
    // console.log(`swapForYes: ${swapForYes}`)
    // console.log(`setsToSwap: ${setsToSwap.toString()}`)
    //
    // const txr: TransactionResponse = await this.contract.addAMMWithLiquidity(market, paraShareToken, setsToBuy, swapForYes, setsToSwap);
    // const tx = await txr.wait();
    // const logs = tx.logs.map(this.contract.interface.parseLog.bind(this));
    // console.log(JSON.stringify(logs, null, 2))
    //
    // return { amm, lpTokens: new BigNumber(42) };
  }

  async ammAddress(marketAddress: string, paraShareToken: string): Promise<string> {
    return this.contract.calculateAMMAddress(marketAddress, paraShareToken);
  }
}

export interface AddAMMReturn {
  amm: AMMExchange
  lpTokens: BigNumber
}
