import BigNumber from "bignumber.js";

export function denormalizePrice(minPrice: string|number|BigNumber, maxPrice: string|number|BigNumber, normalizedPrice: string|number|BigNumber): BigNumber {
  const bnMinPrice: BigNumber = new BigNumber(minPrice, 10);
  const bnMaxPrice: BigNumber = new BigNumber(maxPrice, 10);
  const bnNormalizedPrice: BigNumber = new BigNumber(normalizedPrice, 10);
  if (bnMinPrice.gt(bnMaxPrice)) throw new Error("Minimum value larger than maximum value");
  if (bnNormalizedPrice.lt(0)) throw new Error("Normalized price is below 0");
  if (bnNormalizedPrice.gt(1)) throw new Error("Normalized price is above 1");
  return bnNormalizedPrice.times(bnMaxPrice.minus(bnMinPrice)).plus(bnMinPrice);
}
