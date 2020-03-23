import { AppState } from 'store';
import { Action } from 'redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { getEthForDaiRate } from 'modules/contracts/actions/contractCalls';
import {
  updateAppStatus,
  ETH_TO_DAI_RATE,
} from 'modules/app/actions/update-app-status';
import { NodeStyleCallback, FormattedNumber } from 'modules/types';
import logError from 'utils/log-error';
import { formatDaiEstimate, formatAttoDai } from 'utils/format-number';
import { augurSdk } from 'services/augursdk';
import { BigNumber } from 'utils/create-big-number';

export const getEthToDaiRate = (
  callback: NodeStyleCallback = logError
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const ethToDaiRate = getEthForDaiRate();
  if (ethToDaiRate) {
    dispatch(updateAppStatus(ETH_TO_DAI_RATE, formatAttoDai(ethToDaiRate)));
  }
};

export const ethToDai = (ethAmount: string, ethToDaiRate: BigNumber) => {
  if (!ethToDaiRate) return formatDaiEstimate(0);
  return formatDaiEstimate(ethToDaiRate.times(ethAmount));
};

export const getGasInDai = (amount): FormattedNumber => {
  const augur = augurSdk.get();
  const gasInAttoDai = augur.convertGasEstimateToDaiCost(amount);
  return formatDaiEstimate(gasInAttoDai.dividedBy(10 ** 18));
}

export const displayGasInDai = (amount): string => {
  const gasInDai = getGasInDai(amount);
  if (Number(gasInDai.roundedFormatted) === 0) {
    return '$0.01';
  }
  return `$${gasInDai.roundedFormatted}`;
};
