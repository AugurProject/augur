import { bignum } from "./bignum";

export function encodeNumberAsJSNumber(s: number, isWrapped: boolean = false): string {
  return bignum(s, "number", isWrapped);
}
