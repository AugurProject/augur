import BigNumber from "bignumber.js";

export function fixedPointToDecimal(fixedPointValue: BigNumber, conversionFactor: BigNumber): BigNumber {
  return fixedPointValue.dividedBy(conversionFactor);
}

export function convertFixedPointToDecimal(fixedPointValue: string|number|BigNumber, conversionFactor: string|number): string {
  return fixedPointToDecimal(new BigNumber(fixedPointValue, 10), new BigNumber(conversionFactor, 10)).toString();
}

export function decimalToFixedPoint(decimalValue: BigNumber, conversionFactor: BigNumber): BigNumber {
  return decimalValue.times(conversionFactor);
}

export function convertDecimalToFixedPoint(decimalValue: string|number, conversionFactor: string|number): string {
  return decimalToFixedPoint(new BigNumber(decimalValue, 10), new BigNumber(conversionFactor, 10)).toString();
}

export function numTicksToTickSize(numTicks: BigNumber, minPrice: BigNumber, maxPrice: BigNumber): BigNumber {
  return maxPrice.minus(minPrice).dividedBy(numTicks);
}

export function convertNumTicksToTickSize(numTicks: string|number, minPrice: string|number, maxPrice: string|number): string {
  return numTicksToTickSize(new BigNumber(maxPrice, 10), new BigNumber(minPrice, 10), new BigNumber(numTicks, 10)).toString();
}
