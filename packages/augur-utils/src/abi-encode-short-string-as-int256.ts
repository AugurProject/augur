import { padRight } from "./pad-right";
import { prefixHex } from "./hex";

export function abiEncodeShortStringAsInt256(shortString) {
  let encoded = shortString;
  if (encoded.length > 32) encoded = encoded.slice(0, 32);
  return prefixHex(padRight(Buffer.from(encoded, "utf8").toString("hex")));
}


