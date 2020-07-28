import { AppState } from 'appStore';
import { Action } from 'redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { getEthForDaiRate } from 'modules/contracts/actions/contractCalls';
import {
  updateAppStatus,
  ETH_TO_DAI_RATE,
} from 'modules/app/actions/update-app-status';
import { NodeStyleCallback, FormattedNumber } from 'modules/types';
import { augurSdk } from 'services/augursdk';
import logError from 'utils/log-error';
import { formatAttoDai, formatDaiPrice } from 'utils/format-number';
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

export const ethToDai = (ethAmount: number, ethToDaiRate: BigNumber): FormattedNumber => {
  if (!ethToDaiRate) return formatDaiPrice(0);
  return formatDaiPrice(ethToDaiRate.times(ethAmount));
};

export const getGasInDai = (amount: BigNumber, manualGasPrice?: number): FormattedNumber => {
  const augur = augurSdk.get();
  const gasInAttoDai = augur.convertGasEstimateToDaiCost(amount, manualGasPrice);
  return formatDaiPrice(gasInAttoDai.dividedBy(10 ** 18), { decimals: 2, decimalsRounded: 2});
}

export const displayGasInDai = (amount: BigNumber, manualGasPrice?: number): string => {
  const gasInDai = getGasInDai(amount, manualGasPrice);
  if (Number(gasInDai.roundedFormatted) === 0) {
    return '$0.01';
  }
  return `$${gasInDai.roundedFormatted}`;
};
