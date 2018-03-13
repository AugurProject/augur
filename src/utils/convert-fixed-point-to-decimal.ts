import BigNumber from "bignumber.js";
import { fix } from "speedomatic";

export function convertFixedPointToDecimal(fixedPointValue: string|number, conversionFactor: string|number): string {
  return new BigNumber(fixedPointValue, 10).dividedBy(new BigNumber(conversionFactor, 10)).toFixed();
}

export function convertDecimalToFixedPoint(decimalValue: string|number, conversionFactor: string|number): string {
  return new BigNumber(decimalValue, 10).times(new BigNumber(conversionFactor, 10)).toFixed();
}

export function convertNumTicksToTickSize(numTicks: string|number, minPrice: string|number, maxPrice: string|number): string {
  return (new BigNumber(maxPrice, 10).minus(new BigNumber(minPrice, 10))).dividedBy(new BigNumber(numTicks, 10)).toFixed();
}
