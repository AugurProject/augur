import { ethers } from 'ethers';
import { AMMFactoryAbi } from '../abi/AMMFactoryAbi';
import { AMMExchange } from './AMMExchange';

export class AMMFactory {
  private readonly provider: ethers.providers.Provider;
  private readonly contract: ethers.Contract;

  constructor(provider: ethers.providers.Provider, address: string) {
    this.contract = new ethers.Contract(address, AMMFactoryAbi, provider);

    this.provider = provider;
  }

  async getAMMExchange(marketAddress: string, collateralAddress: string): Promise<AMMExchange> {
    const paras = await this.contract.exchanges(marketAddress) || {};

    const amm = paras[collateralAddress];
    if(typeof amm === 'undefined') {
      throw new Error(`Market/Collateral pair ${marketAddress}/${collateralAddress} does not exist.`);
    }

    return new AMMExchange(this.provider, amm);
  }

}
