import { SubscriptionEventName } from '../constants';
import { WarpController } from '../warp/WarpController';
import { API } from './getter/API';
import { create } from './create-api';
import { UploadBlockNumbers } from '@augurproject/artifacts';
import { WarpSyncStrategy } from './sync/WarpSyncStrategy';

export async function start(ethNodeUrl: string, account?: string, enableFlexSearch = false, hashAddress?: string): Promise<API> {
  const { api, blockAndLogStreamerSyncStrategy, bulkSyncStrategy, logFilterAggregator} = await create(ethNodeUrl, account, enableFlexSearch);

  const networkId = await api.augur.provider.getNetworkId();
  const uploadBlockNumber = UploadBlockNumbers[networkId];
  const currentBlockNumber = await api.augur.provider.getBlockNumber();
  const warpController = await WarpController.create((await api.db));
  const warpSyncStrategy = new WarpSyncStrategy(warpController, logFilterAggregator.onLogsAdded)

  const endWarpSyncBlock = await warpSyncStrategy.start();
  const endBulkSyncBlock = await bulkSyncStrategy.start(endWarpSyncBlock || uploadBlockNumber, currentBlockNumber);

  console.log("Syncing Complete - SDK Ready");
  api.augur.events.emit(SubscriptionEventName.SDKReady, {
    eventName: SubscriptionEventName.SDKReady,
  });

  // Will not block execution.
  await blockAndLogStreamerSyncStrategy.start(endBulkSyncBlock);

  return api;
}
