import {
  getForkingMarket,
  getForkEndTime,
  getForkReputationGoal,
  isFinalized,
  getWinningChildUniverse,
  getDisputeThresholdForFork,
} from 'modules/contracts/actions/contractCalls';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'store';
import { Action } from 'redux';
import { updateUniverse } from 'modules/universe/actions/update-universe';
import { ForkingInfo } from 'modules/types';
import { NULL_ADDRESS } from 'modules/common/constants';

export function loadUniverseForkingInfo(
  incomingUniverse: string,
  forkingMarketId?: string
) {
  return async (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    const { universe } = getState();
    if (universe && universe.id && universe.id !== incomingUniverse) return;
    const forkingMarket = forkingMarketId || (await getForkingMarket());
    const isForking =
      forkingMarket !== NULL_ADDRESS;
    if (isForking) {
      const forkEndTime = await getForkEndTime();
      const forkAttoReputationGoal = await getForkReputationGoal();
      const isForkingMarketFinalized = await isFinalized(forkingMarket);
      let winningChildUniverseId;
      if (isForkingMarketFinalized) {
        winningChildUniverseId = await getWinningChildUniverse();
      }
      const forkAttoThreshold = await getDisputeThresholdForFork();
      const forkingInfo: ForkingInfo = {
        forkingMarket,
        forkEndTime: forkEndTime.toNumber(),
        forkAttoReputationGoal,
        forkAttoThreshold,
        isForkingMarketFinalized,
        winningChildUniverseId,
      };
      dispatch(updateUniverse({ forkingInfo }));
    }
  };
}
