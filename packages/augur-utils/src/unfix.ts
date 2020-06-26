import BigNumber from "bignumber.js";
import { bignum } from "./bignum";
import { prefixHex } from "./hex";
import { FXP_ONE } from "./constants";

export function unfix(n, encoding?) {
  let unfixed;
  if (n && n !== "0x" && !n.error && !n.message) {
    if (encoding) encoding = encoding.toLowerCase();
    if (Array.isArray(n)) {
      let len = n.length;
      unfixed = new Array(len);
      for (let i = 0; i < len; ++i) {
        unfixed[i] = unfix(n[i], encoding);
      }
    } else {
      if (BigNumber.isBigNumber(n)) {
        unfixed = n.dividedBy(FXP_ONE);
      } else {
        unfixed = bignum(n).dividedBy(FXP_ONE);
      }
      if (unfixed && encoding) {
        if (encoding === "hex") {
          unfixed = prefixHex(unfixed.integerValue());
        } else if (encoding === "string") {
          unfixed = unfixed.toFixed();
        } else if (encoding === "number") {
          unfixed = unfixed.toNumber();
        }
      }
    }
    return unfixed;
  }
  return n;
}


