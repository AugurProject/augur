import BigNumber from "bignumber.js";
import { bignum } from "./bignum";
import { prefixHex } from "./hex";
import { wrap } from "./wrap";

import { FXP_ONE } from "./constants";

export function fix(n, encoding?, isWrapped=false) {
  let fixed;
  if (n && n !== "0x" && !n.error && !n.message) {
    if (encoding && n.constructor === String) {
      encoding = encoding.toLowerCase();
    }
    if (Array.isArray(n)) {
      let len = n.length;
      fixed = new Array(len);
      for (let i = 0; i < len; ++i) {
        fixed[i] = fix(n[i], encoding);
      }
    } else {
      if (!BigNumber.isBigNumber(n)) {
        n = bignum(n);
      }
      fixed = n.multipliedBy(FXP_ONE).integerValue();
      if (isWrapped) fixed = wrap(fixed);
      if (encoding) {
        if (encoding === "string") {
          fixed = fixed.toFixed();
        } else if (encoding === "hex") {
          if (BigNumber.isBigNumber(fixed)) {
            fixed = fixed.toString(16);
          }
          fixed = prefixHex(fixed);
        }
      }
    }
    return fixed;
  }
  return n;
}


