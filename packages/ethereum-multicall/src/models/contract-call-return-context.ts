import { CallReturnContext } from './call-return-context';
import { ContractCallContext } from './contract-call-context';

export interface ContractCallReturnContext {
  originalContractCallContext: ContractCallContext;
  callsReturnContext: CallReturnContext[];
}
