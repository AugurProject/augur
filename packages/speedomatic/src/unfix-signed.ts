import { hex } from "./hex";
import { unfix } from "./unfix";

export function unfixSigned(n, encoding) {
  return unfix(hex(n, true), encoding);
}


