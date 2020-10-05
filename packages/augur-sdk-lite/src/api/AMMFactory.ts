import { ethers } from 'ethers';
import { AMMFactoryAbi } from '../abi/AMMFactoryAbi';

export class AMMFactory {
  private readonly provider: ethers.providers.Provider;
  private readonly contract: ethers.Contract;

  constructor(provider: ethers.providers.Provider, address: string) {
    this.contract = new ethers.Contract(address, AMMFactoryAbi, provider);

    this.provider = provider;
  }

}
