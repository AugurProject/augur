import { bignum } from "./bignum";

export function encodeNumberAsBase10String(n, isWrapped = false) {
  return bignum(n, "string", isWrapped);
}


