import { augurSdk } from 'services/augursdk';
import { createBigNumber } from 'utils/create-big-number';

export const registerUserDefinedGasPriceFunction = (
  userDefinedGasPrice: number,
  average: number,
) => {
  const Augur = augurSdk.get();

  if (userDefinedGasPrice === null || isNaN(userDefinedGasPrice)) {
    return Augur.setGasPrice(createBigNumber(average));
  }
  return Augur.setGasPrice(createBigNumber(userDefinedGasPrice));
};
