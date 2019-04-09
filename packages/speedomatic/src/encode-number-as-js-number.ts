import { bignum } from "./bignum";

export function encodeNumberAsJSNumber(s, isWrapped) {
  return bignum(s, "number", isWrapped);
}


