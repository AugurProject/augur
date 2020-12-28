import { ContractCallReturnContext } from './contract-call-return-context';

export interface ContractCallResults {
  results: { [key: string]: ContractCallReturnContext };
  blockNumber: number;
}
