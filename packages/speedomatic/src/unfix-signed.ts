let hex = require("./hex");
let unfix = require("./unfix");

export function unfixSigned(n, encoding) {
  return unfix(hex(n, true), encoding);
}


