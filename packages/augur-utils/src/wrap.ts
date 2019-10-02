import BigNumber from "bignumber.js";
import { bignum } from "./bignum";
import { INT256_MAX_VALUE, INT256_MIN_VALUE, UINT256_MAX_VALUE } from "./constants";

export function wrap(bn) {
  if (bn === undefined || bn === null) return bn;
  if (bn.constructor !== BigNumber) bn = bignum(bn);
  if (bn.gt(INT256_MAX_VALUE)) {
    return bn.minus(UINT256_MAX_VALUE);
  } else if (bn.lt(INT256_MIN_VALUE)) {
    return bn.plus(UINT256_MAX_VALUE);
  }
  return bn;
}


