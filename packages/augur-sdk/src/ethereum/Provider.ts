import { NetworkId } from "@augurproject/artifacts";
import { Abi } from "ethereum";
import { Filter, Log, LogValues } from "@augurproject/types";
import { ethers } from "ethers";

export interface Provider {
  getNetworkId(): Promise<NetworkId>;
  getLogs(filter: Filter): Promise<Log[]>;
  getBlockNumber(): Promise<number>;
  storeAbiData(abi: Abi, contractName: string): void;
  getEventTopic(contractName: string, eventName: string): string;
  parseLogValues(contractName: string, log: Log): LogValues;
  getBalance(address: string): Promise<ethers.utils.BigNumber>;
}
