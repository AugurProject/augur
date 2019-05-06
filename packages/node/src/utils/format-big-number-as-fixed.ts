import { BigNumber as BigNumberJS } from "bignumber.js";
import { BigNumber } from "../types";


export function formatBigNumberAsFixed<InputType, OutputType> (row: InputType): OutputType {
  if (row === null || typeof row !== "object") throw new Error(`Invalid row provided to formatBigNumberAsFixed: ${row}`);

  const copy: any = {};
  for (const key in row) {
    if (row.hasOwnProperty(key)) {
      const field: any = row[key];
      if (field && (BigNumber.isBigNumber(field) || BigNumberJS.isBigNumber(field))) {
        copy[key] = field.toString();
      } else {
        copy[key] = field;
      }
    }
  }

  return copy as OutputType;
}
