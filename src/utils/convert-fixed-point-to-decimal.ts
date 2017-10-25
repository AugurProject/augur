import BigNumber from "bignumber.js";

export function convertFixedPointToDecimal(fixedPointValue: string|number, conversionFactor: string|number): string {
  return new BigNumber(fixedPointValue, 10).dividedBy(new BigNumber(conversionFactor, 10)).toFixed();
}

export function convertDecimalToFixedPoint(decimalValue: string|number, conversionFactor: string|number): string {
  return new BigNumber(decimalValue, 10).times(new BigNumber(conversionFactor, 10)).toFixed();
}
