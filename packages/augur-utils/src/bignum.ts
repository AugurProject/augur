import BigNumber from "bignumber.js";
import { isHex } from "./is-hex";
import { prefixHex } from "./hex";
import { wrap } from "./wrap";

export function bignum(n, encoding="", isWrapped=false) {
  let bn, len;
  if (n !== null && n !== undefined && n !== "0x" && !n.error && !n.message) {
    switch (n.constructor) {
      case BigNumber:
        bn = n;
        break;
      case Number:
        bn = new BigNumber(n, 10);
        break;
      case String:
        try {
          bn = new BigNumber(n, 10);
        } catch (exc) {
          if (isHex(n)) {
            bn = new BigNumber(n, 16);
          } else {
            return n;
          }
        }
        break;
      case Array:
        len = n.length;
        bn = new Array(len);
        for (let i = 0; i < len; ++i) {
          bn[i] = bignum(n[i], encoding, isWrapped);
        }
        break;
      default:
        if (isHex(n)) {
          bn = new BigNumber(n, 16);
        } else {
          bn = new BigNumber(n, 10);
        }
    }
    if (bn !== undefined && bn !== null && BigNumber.isBigNumber(bn)) {
      if (isWrapped) bn = wrap(bn);
      if (encoding) {
        if (encoding === "number") {
          bn = bn.toNumber();
        } else if (encoding === "string") {
          bn = bn.toFixed();
        } else if (encoding === "hex") {
          bn = prefixHex(bn.integerValue(BigNumber.ROUND_FLOOR).toString(16));
        }
      }
    }
    return bn;
  }
  return n;
}


