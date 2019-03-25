import BigNumber from "bignumber.js";
let bignum = require("./bignum");
let constants = require("./constants");

export function wrap(bn) {
  if (bn === undefined || bn === null) return bn;
  if (bn.constructor !== BigNumber) bn = bignum(bn);
  if (bn.gt(constants.INT256_MAX_VALUE)) {
    return bn.minus(constants.UINT256_MAX_VALUE);
  } else if (bn.lt(constants.INT256_MIN_VALUE)) {
    return bn.plus(constants.UINT256_MAX_VALUE);
  }
  return bn;
}


