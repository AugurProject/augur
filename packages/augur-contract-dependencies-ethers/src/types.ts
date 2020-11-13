// These types mirror those in GenericContractInterfaces.ts without adding that file as a dependency.

export type Primitive =
  | 'uint8'
  | 'uint64'
  | 'uint256'
  | 'bool'
  | 'string'
  | 'address'
  | 'bytes4'
  | 'bytes20'
  | 'bytes32'
  | 'bytes'
  | 'int256'
  | 'tuple'
  | 'address[]'
  | 'uint8[]'
  | 'uint256[]'
  | 'bytes32[]'
  | 'tuple[]';

export interface AbiParameter {
  name: string;
  type: Primitive;
  internalType: any;
  components?: AbiParameter[];
}

export interface AbiEventParameter extends AbiParameter {
  indexed: boolean;
}

export interface AbiFunction {
  name: string;
  type: 'function' | 'constructor' | 'fallback';
  stateMutability: 'pure' | 'view' | 'payable' | 'nonpayable';
  constant: boolean;
  payable: boolean;
  inputs: AbiParameter[];
  outputs: AbiParameter[];
}

export interface Transaction<TBigNumber> {
  to: string;
  from?: string;
  data: string;
  value?: TBigNumber;
  gasPrice?: TBigNumber;
  gasLimit?: TBigNumber;
}

export interface RawEvent {
  data: string;
  topics: string[];
}

export interface TransactionReceipt {
  status: number;
  logs: RawEvent[];
}

export interface Dependencies<TBigNumber> {
  keccak256(utf8String: string): string;
  encodeParams(abi: AbiFunction, parameters: any[]): string;
  decodeParams(abi: AbiParameter[], encoded: string): any[];
  getDefaultAddress(): Promise<string | undefined>;
  call(transaction: Transaction<TBigNumber>): Promise<string>;
  submitTransaction(
    transaction: Transaction<TBigNumber>
  ): Promise<TransactionReceipt>;
}
