let chunk = require("./chunk");
let strip0xPrefix = require("./strip-0x-prefix");
let prefixHex = require("./prefix-hex");

export function padRight(s, chunkLength, hasPrefix) {
  chunkLength = chunkLength || 64;
  s = strip0xPrefix(s);
  let multiple = chunkLength * (chunk(s.length, chunkLength) || 1);
  while (s.length < multiple) {
    s += "0";
  }
  if (hasPrefix) s = prefixHex(s);
  return s;
}


