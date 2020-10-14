import { ethers } from 'ethers';
import { SignerOrProvider } from '../constants';
import ParaShareTokenAbi from '../abi/ParaShareToken.json'

export class ParaShareToken {
  static readonly ABI = ParaShareTokenAbi;
  readonly contract: ethers.Contract;

  constructor(readonly signerOrProvider: SignerOrProvider, readonly address: string) {
    this.contract = new ethers.Contract(address, ParaShareTokenAbi, signerOrProvider);
  }
}

