import {
  getForkingMarket,
  getForkEndTime,
  getForkReputationGoal,
  isFinalized,
  getWinningChildUniverse,
  getDisputeThresholdForFork,
} from 'modules/contracts/actions/contractCalls';
import { ForkingInfo } from 'modules/types';
import { NULL_ADDRESS } from 'modules/common/constants';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';
import { AppStatus } from 'modules/app/store/app-status';
import { Markets } from 'modules/markets/store/markets';

export const loadUniverseForkingInfo = async (forkingMarketId?: string) => {
  // SDK could be connected to wrong universe need to pass in universe
  const { universe: { id: universeId }} = AppStatus.get();
  const forkingMarket = forkingMarketId || (await getForkingMarket(universeId));
  const isForking = forkingMarket !== NULL_ADDRESS;
  if (isForking) {
    const forkEndTime = await getForkEndTime(universeId);
    const forkAttoReputationGoal = await getForkReputationGoal(universeId);
    const isForkingMarketFinalized = await isFinalized(forkingMarket);
    let winningChildUniverseId;
    if (isForkingMarketFinalized) {
      winningChildUniverseId = await getWinningChildUniverse(universeId);
    }
    const forkAttoThreshold = await getDisputeThresholdForFork(universeId);
    const forkingInfo: ForkingInfo = {
      forkingMarket,
      forkEndTime: forkEndTime.toNumber(),
      forkAttoReputationGoal,
      forkAttoThreshold,
      isForkingMarketFinalized,
      winningChildUniverseId,
    };
    Markets.actions.updateMarketsData(null, loadMarketsInfo([forkingMarket]));
    AppStatus.actions.updateUniverse({ forkingInfo });
  }
};