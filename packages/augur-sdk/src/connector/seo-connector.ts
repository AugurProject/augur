import * as Sync from '../state/Sync';
import { Subscriptions } from '../subscriptions';
import { SingleThreadConnector } from './single-thread-connector';

export class SEOConnector extends SingleThreadConnector {
  connect = async (ethNodeUrl: string, account?: string): Promise<any> => {
    this.api = Sync.start(ethNodeUrl, account, true, { adapter: 'memory' });
    this.events = (await this.api).augur.getAugurEventEmitter();
    return this.api;
  }
}
