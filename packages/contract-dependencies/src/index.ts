export type Primitive = 'uint8' | 'uint64' | 'uint256' | 'bool' | 'string' | 'address' | 'bytes4' | 'bytes20' | 'bytes32' | 'bytes' | 'int256' | 'tuple' | 'address[]' | 'uint8[]' | 'uint256[]' | 'bytes32[]' | 'tuple[]'

export interface AbiParameter {
	name: string
	type: Primitive
	components?: Array<AbiParameter>
}

export interface Transaction<TBigNumber> {
	to: string
	from?: string
	data: string
	value?: TBigNumber
}

export interface RawEvent {
	data: string
	topics: Array<string>
}

export interface TransactionReceipt {
	status: number
	logs: Array<RawEvent>
}

export { Dependencies } from "augur-core";
