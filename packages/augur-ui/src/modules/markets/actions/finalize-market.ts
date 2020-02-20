import logError from 'utils/log-error';
import { ThunkDispatch } from 'redux-thunk';
import { NodeStyleCallback } from 'modules/types';
import { Action } from 'redux';
import { AppState } from 'appStore';
import { finalizeMarket } from 'modules/contracts/actions/contractCalls';

export const sendFinalizeMarket = (
  marketId,
  callback: NodeStyleCallback = logError
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  if (!marketId) return;
  finalizeMarket(marketId);
  if (callback) callback(null);
};
