let bignum = require("./bignum");

export function encodeNumberAsBase10String(n, isWrapped) {
  return bignum(n, "string", isWrapped);
}


