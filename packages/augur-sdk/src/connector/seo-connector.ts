import * as Sync from '../state/Sync';
import { API } from '../state/getter/API';
import { SubscriptionEventName } from '../constants';
import { Subscriptions } from '../subscriptions';
import { Callback, augurEmitter } from '../events';
import { SingleThreadConnector } from './single-thread-connector';

export class SEOConnector extends SingleThreadConnector {
  connect = (ethNodeUrl: string, account?: string): Promise<any> => {
    this.api = Sync.start(ethNodeUrl, account, true, { adapter: 'memory' });
    return this.api;
  }
}
