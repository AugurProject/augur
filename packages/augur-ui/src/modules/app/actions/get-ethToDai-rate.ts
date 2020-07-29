import { FormattedNumber } from 'modules/types';
import { augurSdk } from 'services/augursdk';
import { BigNumber } from 'utils/create-big-number';
import { formatDaiPrice } from 'utils/format-number';

export const ethToDai = (ethAmount: number, ethToDaiRate: BigNumber): FormattedNumber => {
  if (!ethToDaiRate) return formatDaiPrice(0);
  return formatDaiPrice(ethToDaiRate.times(ethAmount));
};

export const getGasInDai = async (amount: BigNumber, manualGasPrice?: number): Promise<FormattedNumber> => {
  const augur = augurSdk.get();
  const gasInAttoDai = await augur.convertGasEstimateToDaiCost(amount, manualGasPrice);
  return formatDaiPrice(gasInAttoDai.dividedBy(10 ** 18), { decimals: 2, decimalsRounded: 2});
}

export const displayGasInDai = async (amount: BigNumber, manualGasPrice?: number): Promise<string> => {
  const gasInDai = await getGasInDai(amount, manualGasPrice);
  if (Number(gasInDai.roundedFormatted) === 0) {
    return '$0.01';
  }
  return `$${gasInDai.roundedFormatted}`;
};
