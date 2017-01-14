import { ROUND_DOWN } from 'bignumber.js';
import { constants } from '../../../services/augurjs';

export const splitAskAndShortAsk = (numShares, position) => {
  let askShares;
  let shortAskShares;
  if (position.gt(numShares)) {
    askShares = numShares.round(constants.PRECISION.decimals, ROUND_DOWN);
    shortAskShares = 0;
  } else {
    askShares = position.toFixed();
    shortAskShares = numShares.minus(position).round(constants.PRECISION.decimals, ROUND_DOWN).toFixed();
  }
  return { askShares, shortAskShares };
};
