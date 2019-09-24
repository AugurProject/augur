import BigNumber from "bignumber.js";
import { strip0xPrefix } from "./strip-0x-prefix";

export function byteArrayToUtf8String(byteArray:(Buffer|string|BigNumber|Number)) {
  let el, byteString;
  if (Buffer.isBuffer(byteArray)) {
    return Buffer.from(byteArray).toString("utf8");
  }
  if (Array.isArray(byteArray)) {
    byteString = "";
    for (let i = 0, numBytes = byteArray.length; i < numBytes; ++i) {
      el = byteArray[i];
      if (el !== undefined && el !== null) {
        if (el.constructor === String) {
          el = strip0xPrefix(el);
          if (el.length % 2 !== 0) el = "0" + el;
          byteString += el;
        } else if (el.constructor === Number || BigNumber.isBigNumber(el)) {
          el = el.toString(16);
          if (el.length % 2 !== 0) el = "0" + el;
          byteString += el;
        } else if (Buffer.isBuffer(el)) {
          byteString += el.toString("hex");
        }
      }
    }
  }
  if (byteArray.constructor === String) {
    byteString = strip0xPrefix(byteArray);
  } else if (byteArray.constructor === Number || BigNumber.isBigNumber(byteArray)) {
    byteString = byteArray.toString(16);
  }
  try {
    byteString = Buffer.from(byteString, "hex");
  } catch (ex) {
    console.error("[@augurproject/utils] byteArrayToUtf8String:", JSON.stringify(byteString, null, 2));
    throw ex;
  }
  return byteString.toString("utf8");
}
