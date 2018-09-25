import { BigNumber } from "bignumber.js";

export function formatBigNumberAsFixed<InputType, OutputType> (row: InputType): OutputType {
  if (row === null || typeof row !== "object") return row;

  const copy: any = {};
  for (const key in row) {
    if (row.hasOwnProperty(key)) {
      const field: any = row[key];
      if (field && BigNumber.isBigNumber(field)) {
        copy[key] = field.toFixed();
      } else {
        copy[key] = field;
      }
    }
  }

  return copy as OutputType;
}
