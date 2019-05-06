import { BigNumber } from "../types";
import { BigNumber as BigNumberJS } from "bignumber.js";


export function safeBigNumberCompare(left: BigNumber | null | undefined, right: BigNumber | null | undefined) {
  if (typeof(left) === "undefined" && right === null) return -1;
  if (typeof(right) === "undefined" && left === null) return 1;
  if (right == null && left == null) return 0;
  return new BigNumberJS(left!.toString()).comparedTo(new BigNumberJS(right!.toString()));
}
