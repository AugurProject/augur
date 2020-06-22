import BigNumber from "bignumber.js";
import { abiEncodeBytes } from "./abi-encode-bytes";
import { bignum } from "./bignum";
import { wrap } from "./wrap";

export function prefixHex(n) {
  if (n === undefined || n === null || n === "") return n;
  if (n.constructor === Number || BigNumber.isBigNumber(n)) {
    n = n.toString(16);
  }
  if (n.constructor === String && n.slice(0, 2) !== "0x" && n.slice(0, 3) !== "-0x") {
    if (n.slice(0, 1) === "-") {
      n = "-0x" + n.slice(1);
    } else {
      n = "0x" + n;
    }
  }
  return n;
}

export function padHex(hexString: string): string {
  return `0x${hexString.substr(2).padStart(64, "0")}`;
}

export function hex(n, isWrapped=false) {
  let h;
  if (n !== undefined && n !== null && n.constructor) {
    switch (n.constructor) {
      case Buffer:
        h = hex(prefixHex(n.toString("hex")), isWrapped);
        break;
      case Object:
        h = abiEncodeBytes(JSON.stringify(n));
        break;
      case Array:
        h = bignum(n, "hex", isWrapped);
        break;
      case BigNumber:
        if (isWrapped) {
          h = wrap(n.integerValue(BigNumber.ROUND_FLOOR)).toString(16);
        } else {
          h = n.integerValue(BigNumber.ROUND_FLOOR).toString(16);
        }
        break;
      case String:
        if (n === "-0x0") {
          h = "0x0";
        } else if (n === "-0") {
          h = "0";
        } else if (n.slice(0, 3) === "-0x" || n.slice(0, 2) === "-0x") {
          h = bignum(n, "hex", isWrapped);
        } else {
          if (isFinite(n)) {
            h = bignum(n, "hex", isWrapped);
          } else {
            h = abiEncodeBytes(n);
          }
        }
        break;
      case Boolean:
        h = (n) ? "0x1" : "0x0";
        break;
      default:
        h = bignum(n, "hex", isWrapped);
    }
  }
  return prefixHex(h);
}

export function stringTo32ByteHex(stringToEncode: string): string {
    return `0x${Buffer.from(stringToEncode, 'utf8').toString('hex').padEnd(64, '0')}`;
}
