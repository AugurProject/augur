export function removeTrailingZeros(h, isUtf8 = false) {
  let hex = h.toString();
  if (isUtf8) {
    while (hex.slice(-1) === "\u0000") {
      hex = hex.slice(0, -1);
    }
  } else {
    while (hex.slice(-2) === "00") {
      hex = hex.slice(0, -2);
    }
  }
  return hex;
}


