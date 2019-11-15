import { AppState } from 'store';
import { Action } from 'redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { uniswapEthForDaiRate } from 'modules/contracts/actions/contractCalls';
import { createBigNumber } from 'utils/create-big-number';
import { updateAppStatus, ETH_TO_DAI_RATE } from 'modules/app/actions/update-app-status';
import { NodeStyleCallback } from 'modules/types';
import logError from 'utils/log-error';

export const getEthToDaiRate = (
  callback: NodeStyleCallback = logError
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  uniswapEthForDaiRate(createBigNumber(1000000)).then(rate => {
    dispatch(updateAppStatus(ETH_TO_DAI_RATE, rate));
  });
};
