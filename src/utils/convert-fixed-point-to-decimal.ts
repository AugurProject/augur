import BigNumber from "bignumber.js";
import { fix } from "speedomatic";

export function fixedPointToDecimal(fixedPointValue: BigNumber, conversionFactor: BigNumber): BigNumber {
  return fixedPointValue.dividedBy(conversionFactor);
}

export function convertFixedPointToDecimal(fixedPointValue: string|number, conversionFactor: string|number): string {
  return fixedPointToDecimal(new BigNumber(fixedPointValue, 10), new BigNumber(conversionFactor, 10)).toFixed();
}

export function decimalToFixedPoint(decimalValue: BigNumber, conversionFactor: BigNumber): BigNumber {
  return decimalValue.times(conversionFactor);
}

export function convertDecimalToFixedPoint(decimalValue: string|number, conversionFactor: string|number): string {
  return decimalToFixedPoint(new BigNumber(decimalValue, 10), new BigNumber(conversionFactor, 10)).toFixed();
}

export function onChainSharesToHumanReadableShares(onChainShares: BigNumber, tickSize: BigNumber): BigNumber {
  return fixedPointToDecimal(onChainShares, fix(tickSize) as BigNumber);
}

export function convertOnChainSharesToHumanReadableShares(onChainShares: string|number, tickSize: string|number): string {
  return onChainSharesToHumanReadableShares(new BigNumber(onChainShares, 10), new BigNumber(tickSize, 10)).toFixed();
}

export function humanReadableSharesToOnChainShares(humanReadableShares: BigNumber, tickSize: BigNumber): BigNumber {
  return decimalToFixedPoint(humanReadableShares, tickSize);
}

export function convertHumanReadableSharesToOnChainShares(humanReadableShares: string|number, tickSize: string): string {
  return humanReadableSharesToOnChainShares(new BigNumber(humanReadableShares, 10), fix(tickSize) as BigNumber).toFixed();
}

export function numTicksToTickSize(numTicks: BigNumber, minPrice: BigNumber, maxPrice: BigNumber): BigNumber {
  return maxPrice.minus(minPrice).dividedBy(numTicks);
}

export function convertNumTicksToTickSize(numTicks: string|number, minPrice: string|number, maxPrice: string|number): string {
  return numTicksToTickSize(new BigNumber(maxPrice, 10), new BigNumber(minPrice, 10), new BigNumber(numTicks, 10)).toFixed();
}
