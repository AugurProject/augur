import { getEthForDaiRate } from 'modules/contracts/actions/contractCalls';
import { NodeStyleCallback, FormattedNumber } from 'modules/types';
import logError from 'utils/log-error';
import { formatAttoDai, formatDai } from 'utils/format-number';
import { augurSdk } from 'services/augursdk';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { AppStatus } from 'modules/app/store/app-status';

export const getEthToDaiRate = (
  callback: NodeStyleCallback = logError
) => {
  const { ethToDaiRate: currentEthToDaiRate } = AppStatus.get();  
  const ethToDaiRate = getEthForDaiRate();
  const formattedRate = formatAttoDai(ethToDaiRate);
  if (formattedRate.value !== currentEthToDaiRate?.value) {
    AppStatus.actions.setEthToDaiRate(formatAttoDai(ethToDaiRate));
  }
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
