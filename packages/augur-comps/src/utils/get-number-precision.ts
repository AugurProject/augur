import { formatNumber } from "./format-number";
import { FormattedNumber } from "./types";
// get the precision of the number, the length to the right of the decimal
export default function getPrecision(value: number | string, defaultValue: number): number {
  if (!value) return defaultValue;
  const numValue: FormattedNumber = formatNumber(value);
  const values = numValue.fullPrecision.toString().split(".");
  if (values.length === 1) return 0; // no decimal
  return values[1].length;
}
