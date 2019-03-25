let rawEncode = require("ethereumjs-abi").rawEncode;

export function abiEncodeInt256(value) {
  return rawEncode(["int256"], [value]).toString("hex");
}


