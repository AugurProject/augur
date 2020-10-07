import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import { binarySearch, bnDirection } from '@augurproject/utils';
import { AMMFactoryAbi } from '../abi/AMMFactoryAbi';
import { AMMExchange } from './AMMExchange';
import { SignerOrProvider } from '../constants';

export class AMMFactory {
  private readonly signerOrProvider: SignerOrProvider;
  private readonly contract: ethers.Contract;

  constructor(signerOrProvider: SignerOrProvider, address: string) {
    this.contract = new ethers.Contract(address, AMMFactoryAbi, signerOrProvider);

    this.signerOrProvider = signerOrProvider;
  }

  async getAMMExchange(marketAddress: string, collateralAddress: string): Promise<AMMExchange> {
    const amm = await this.contract.exchanges(marketAddress, collateralAddress);

    if(typeof amm === 'undefined') {
      throw new Error(`Market/Collateral pair ${marketAddress}/${collateralAddress} does not exist.`);
    }

    return new AMMExchange(this.signerOrProvider, amm);
  }

  async addAMM(marketAddress: string, collateralAddress: string, yesShares: BigNumber = null, noShares: BigNumber = null): Promise<AddAMMReturn> {
    const ammAddress = await this.ammAddress(marketAddress, collateralAddress);
    const amm = new AMMExchange(this.signerOrProvider, ammAddress);

    if (yesShares === null && noShares === null) {
      await this.contract.addAMM(marketAddress, collateralAddress);
      return { amm, lpTokens: new BigNumber(0) };
    } else if (yesShares === null || noShares === null) {
      throw Error('Must specify both yes and no shares, or neither.');
    }
    // else, add AMM with initial liquidity:

    const swapForYes = yesShares.gt(noShares);
    const minBuy = BigNumber.min(noShares, yesShares);
    const maxBuy = BigNumber.max(noShares, yesShares);

    const setsBought = await binarySearch(
      minBuy,
      maxBuy,
      100,
      async (setsToBuy) => {
        const setsToSell = setsToBuy.minus(minBuy);
        const {_yesses, _nos} = await this.contract.static.sharesRateForAddLiquidityThenSwap(setsToBuy, swapForYes, setsToSell);
        return swapForYes ? bnDirection(yesShares, _yesses) : bnDirection(noShares, _nos);
      }
    );

    const setsSwapped = setsBought.minus(minBuy);

    const lpTokens = await this.contract.static.rateAddLiquidityThenSwap(setsBought, swapForYes, setsSwapped);
    await this.contract.addAMMWithLiquidity(marketAddress, collateralAddress, setsBought, swapForYes, setsSwapped);

    return { amm, lpTokens };
  }

  async ammAddress(marketAddress: string, collateralAddress: string): Promise<string> {
    return this.contract.calculateAMMAddress(marketAddress, collateralAddress);
  }
}

export interface AddAMMReturn {
  amm: AMMExchange
  lpTokens: BigNumber
}
