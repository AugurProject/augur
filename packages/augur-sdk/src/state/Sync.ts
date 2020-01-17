import { SubscriptionEventName } from '../constants';
import { API } from './getter/API';
import { create } from './create-api';
import { UploadBlockNumbers } from '@augurproject/artifacts';

export async function start(ethNodeUrl: string, account?: string, enableFlexSearch = false): Promise<API> {
  const { api, blockAndLogStreamerSyncStrategy, bulkSyncStrategy, logFilterAggregator} = await create(ethNodeUrl, account, enableFlexSearch);

  const networkId = await api.augur.provider.getNetworkId();
  const uploadBlockNumber = UploadBlockNumbers[networkId];
  const currentBlockNumber = await api.augur.provider.getBlockNumber();

  const endBulkSyncBlock = await bulkSyncStrategy.start(uploadBlockNumber, currentBlockNumber);

  console.log("Syncing Complete - SDK Ready");
  api.augur.events.emit(SubscriptionEventName.SDKReady, {
    eventName: SubscriptionEventName.SDKReady,
  });

  // Will not block execution.
  await blockAndLogStreamerSyncStrategy.start(endBulkSyncBlock);

  return api;
}
