import { FormattedNumber } from 'modules/types';
import { augurSdk } from 'services/augursdk';
import { BigNumber } from 'utils/create-big-number';
import { formatDaiPrice } from 'utils/format-number';

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
