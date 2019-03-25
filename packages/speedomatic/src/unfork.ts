import BigNumber from "bignumber.js";
let bignum = require("./bignum");
let padLeft = require("./pad-left");
let prefixHex = require("./prefix-hex");
let constants = require("./constants");

export function unfork(forked, prefix) {
  if (forked !== null && forked !== undefined && forked.constructor !== Object) {
    let unforked = bignum(forked);
    if (BigNumber.isBigNumber(unforked)) {
      let superforked = unforked.plus(constants.UINT256_MAX_VALUE);
      if (superforked.gte(constants.BYTES_32) && superforked.lt(constants.UINT256_MAX_VALUE)) {
        unforked = superforked;
      }
      if (BigNumber.isBigNumber(forked)) return unforked;
      unforked = padLeft(unforked.toString(16));
      if (prefix) unforked = prefixHex(unforked);
      return unforked;
    }
    throw new Error("speedomatic.unfork failed (bad input): " + JSON.stringify(forked));
  }
  throw new Error("speedomatic.unfork failed (bad input): " + JSON.stringify(forked));
}


