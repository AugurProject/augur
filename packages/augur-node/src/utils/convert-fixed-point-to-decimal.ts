import { BigNumber } from "../types";

export function fixedPointToDecimal(fixedPointValue: BigNumber, conversionFactor: BigNumber): BigNumber {
  return fixedPointValue.div(conversionFactor);
}

export function convertFixedPointToDecimal(fixedPointValue: string|number|BigNumber, conversionFactor: string|number): string {
  return fixedPointToDecimal(new BigNumber(fixedPointValue), new BigNumber(conversionFactor)).toString();
}

export function decimalToFixedPoint(decimalValue: BigNumber, conversionFactor: BigNumber): BigNumber {
  return decimalValue.multipliedBy(conversionFactor);
}

export function convertDecimalToFixedPoint(decimalValue: string|number, conversionFactor: string|number): string {
  return decimalToFixedPoint(new BigNumber(decimalValue), new BigNumber(conversionFactor)).toString();
}

export function numTicksToTickSize<TBigNumber>(numTicks: BigNumber, minPrice: BigNumber, maxPrice: BigNumber): BigNumber {
  return maxPrice.minus(minPrice).div(numTicks);
}

export function convertNumTicksToTickSize(numTicks: string|number, minPrice: string|number, maxPrice: string|number): string {
  return numTicksToTickSize(new BigNumber(maxPrice), new BigNumber(minPrice), new BigNumber(numTicks)).toString();
}
