import { isHex } from "./is-hex";

export function strip0xPrefix(str) {
  if (str && str.constructor === String && str.length >= 2) {
    let h = str;
    if (h === "-0x0" || h === "0x0") {
      return "0";
    }
    if (h.slice(0, 2) === "0x" && h.length > 2) {
      h = h.slice(2);
    } else if (h.slice(0, 3) === "-0x" && h.length > 3) {
      h = "-" + h.slice(3);
    }
    if (isHex(h)) return h;
  }
  return str;
}


