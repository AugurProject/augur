export function isHex(str) {
  if (str && str.constructor === String) {
    if (str.slice(0, 1) === "-" && str.length > 1) {
      return /^[0-9A-F]+$/i.test(str.slice(1));
    }
    return /^[0-9A-F]+$/i.test(str);
  }
  return false;
}


