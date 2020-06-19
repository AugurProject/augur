import BigNumber from "bignumber.js";
import { bignum } from "./bignum";
import { padLeft } from "./pad-left";
import { prefixHex } from "./hex";
import { BYTES_32, UINT256_MAX_VALUE } from "./constants";

export function unfork(forked, prefix = false) {
  if (forked !== null && forked !== undefined && forked.constructor !== Object) {
    let unforked = bignum(forked);
    if (BigNumber.isBigNumber(unforked)) {
      let superforked = unforked.plus(UINT256_MAX_VALUE);
      if (superforked.gte(BYTES_32) && superforked.lt(UINT256_MAX_VALUE)) {
        unforked = superforked;
      }
      if (BigNumber.isBigNumber(forked)) return unforked;
      unforked = padLeft(unforked.toString(16));
      if (prefix) unforked = prefixHex(unforked);
      return unforked;
    }
    throw new Error("@augurproject/utils.unfork failed (bad input): " + JSON.stringify(forked));
  }
  throw new Error("@augurproject/utils.unfork failed (bad input): " + JSON.stringify(forked));
}


