import { AppState } from 'appStore';
import { Action } from 'redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { getEthForDaiRate } from 'modules/contracts/actions/contractCalls';
import {
  updateAppStatus,
  ETH_TO_DAI_RATE,
} from 'modules/app/actions/update-app-status';
import { NodeStyleCallback, FormattedNumber } from 'modules/types';
import logError from 'utils/log-error';
import { formatAttoDai, formatDai } from 'utils/format-number';
import { augurSdk } from 'services/augursdk';
import { BigNumber, createBigNumber } from 'utils/create-big-number';

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

export const ethToDaiFromAttoRate = (ethAmount: number): FormattedNumber => {
  const attoEthToDaiRate: BigNumber = getEthForDaiRate();
  return ethToDai(createBigNumber(ethAmount), attoEthToDaiRate.div(10 ** 18));
};

export const ethToDai = (ethAmount: number, ethToDaiRate: BigNumber): FormattedNumber => {
  if (!ethToDaiRate) return formatDai(0);
  return formatDai(ethToDaiRate.times(ethAmount));
};

export const getGasInDai = (amount: BigNumber, manualGasPrice?: number): FormattedNumber => {
  const augur = augurSdk.get();
  const gasInAttoDai = augur.convertGasEstimateToDaiCost(amount, manualGasPrice);
  return formatDai(gasInAttoDai.dividedBy(10 ** 18));
}

export const displayGasInDai = (amount: BigNumber, manualGasPrice?: number): string => {
  const gasInDai = getGasInDai(amount, manualGasPrice);
  if (Number(gasInDai.roundedFormatted) === 0) {
    return '$0.01';
  }
  return `$${gasInDai.roundedFormatted}`;
};
