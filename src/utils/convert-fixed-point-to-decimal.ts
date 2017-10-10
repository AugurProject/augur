import BigNumber from "bignumber.js";

export function convertFixedPointToDecimal(fixedPointValue: string|number, conversionFactor: number) {
  return new BigNumber(fixedPointValue, 10).dividedBy(new BigNumber(conversionFactor, 10)).floor().toFixed();
}

export function convertDecimalToFixedPoint(decimalValue: string|number, conversionFactor: number) {
  return new BigNumber(decimalValue, 10).times(new BigNumber(conversionFactor, 10)).toFixed();
}
