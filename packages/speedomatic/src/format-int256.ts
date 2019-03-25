let padLeft = require("./pad-left");
let prefixHex = require("./prefix-hex");
let strip0xPrefix = require("./strip-0x-prefix");
let unfork = require("./unfork");

export function formatInt256(s) {
  if (s === undefined || s === null || s === "0x") return s;
  if (Array.isArray(s)) return s.map(formatInt256);
  if (Buffer.isBuffer(s)) s = s.toString("hex");
  if (s.constructor !== String) s = s.toString(16);
  if (s.slice(0, 1) === "-") s = unfork(s);
  s = strip0xPrefix(s);
  if (s.length > 64) s = s.slice(0, 64);
  return prefixHex(padLeft(s));
}


