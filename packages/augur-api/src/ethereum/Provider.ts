import { NetworkId } from 'augur-artifacts';
import { Abi } from "ethereum";
import {
  Log,
  LogValues,
  Filter,
} from './types'

export interface Provider {
  getNetworkId(): Promise<NetworkId>;
  getLogs(filter: Filter): Promise<Log[]>;
  getBlockNumber(): Promise<number>;
  storeAbiData(abi: Abi, contractName: string): void;
  getEventTopic(contractName: string, eventName: string): string;
  parseLogValues(contractName: string, log: Log): LogValues;
}
