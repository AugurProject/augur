import { augurSdk } from 'services/augursdk';
import { createBigNumber } from 'utils/create-big-number';

export const registerUserDefinedGasPriceFunction = (
  userDefinedGasPrice: number,
  average: number,
) => {
  const Augur = augurSdk.get();

  console.error("TODO: REMOVE THIS FUNCTIONALITY");
};
