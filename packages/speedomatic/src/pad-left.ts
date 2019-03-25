let chunk = require("./chunk");
let prefixHex = require("./prefix-hex");
let strip0xPrefix = require("./strip-0x-prefix");

export function padLeft(s, chunkLength, hasPrefix) {
  chunkLength = chunkLength || 64;
  s = strip0xPrefix(s);
  let multiple = chunkLength * (chunk(s.length, chunkLength) || 1);
  while (s.length < multiple) {
    s = "0" + s;
  }
  if (hasPrefix) s = prefixHex(s);
  return s;
}


