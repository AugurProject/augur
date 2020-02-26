import logError from 'utils/log-error';
import { AppState } from 'store';
import { NodeStyleCallback } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  buyParticipationTokens,
  buyParticipationTokensEstimateGas,
} from 'modules/contracts/actions/contractCalls';
import { addPendingData, removePendingData } from 'modules/pending-queue/actions/pending-queue-management';
import { BUY_PARTICIPATION_TOKENS } from 'modules/common/constants';
import { TXEventName } from '@augurproject/sdk/src';

export const purchaseParticipationTokens = (
  amount: string,
  estimateGas = false,
  callback: NodeStyleCallback = logError
) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe } = getState();
  const universeId = universe.id;
  if (!universeId) return callback('no universe provided');
  if (estimateGas) {
    const gas = await buyParticipationTokensEstimateGas(
      universeId,
      amount
    );
    return callback(null, gas);
  }
  dispatch(addPendingData(BUY_PARTICIPATION_TOKENS, BUY_PARTICIPATION_TOKENS, TXEventName.Pending, BUY_PARTICIPATION_TOKENS));
  buyParticipationTokens(universeId, amount).catch(() => {
    dispatch(removePendingData(BUY_PARTICIPATION_TOKENS, BUY_PARTICIPATION_TOKENS))
  });
  callback(null);
};
