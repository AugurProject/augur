import { AbiInput } from './abi-input';
import { AbiOutput } from './abi-output';

export interface AbiItem {
  anonymous?: boolean;
  constant?: boolean;
  inputs?: AbiInput[];
  name: string;
  outputs?: AbiOutput[];
  payable?: boolean;
  stateMutability?: StateMutabilityType;
  type: AbiType;
  gas?: number;
}

export type StateMutabilityType = 'pure' | 'view' | 'nonpayable' | 'payable';
export type AbiType = 'function' | 'constructor' | 'event' | 'fallback';
