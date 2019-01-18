import { NetworkId } from 'augur-artifacts';
import {
  Log,
  Filter,
} from './types'

export interface Provider {
  getNetworkId(): Promise<NetworkId>;
  getLogs(filter: Filter): Promise<Log[]>;
}
