import { Abi } from "ethereum";
import { Block, BlockTag } from "ethers/providers";
import { Filter, Log, LogValues } from "@augurproject/types";
import { NetworkId } from "@augurproject/utils";
import { ethers } from "ethers";
import { JSONRPCRequestPayload } from "ethereum-types";

export interface Provider {
  getNetworkId(): Promise<NetworkId>;
  getLogs(filter: Filter): Promise<Log[]>;
  getBlockNumber(): Promise<number>;
  getBlock(blockHashOrBlockNumber: BlockTag | string): Promise<Block>;
  storeAbiData(abi: Abi, contractName: string): void;
  getEventTopic(contractName: string, eventName: string): string;
  encodeContractFunction(contractName: string, functionName: string, funcParams: any[]): string;
  parseLogValues(contractName: string, log: Log): LogValues;
  getBalance(address: string): Promise<ethers.utils.BigNumber>;
  sendAsync(payload: JSONRPCRequestPayload): Promise<any>;
}
