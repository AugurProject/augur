import { CallContext } from './call-context';

// https://github.com/ethers-io/ethers.js/issues/211

export interface ContractCallContext {
  /**
   * Reference to this contract call context
   */
  reference: string;

  /**
   * The contract address
   */
  contractAddress: string;

  /**
   * The abi for the contract
   */
  // tslint:disable-next-line: no-any
  abi: any[];

  /**
   * All the calls you want to do for this contract
   */
  calls: CallContext[];
}
