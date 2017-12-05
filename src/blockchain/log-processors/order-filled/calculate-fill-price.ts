import Augur from "augur.js";
import BigNumber from "bignumber.js";

export function calculateFillPrice(augur: Augur, price: string|number, minPrice: string|number, maxPrice: string|number, orderType: string): string {
  const normalizedPrice = augur.trading.normalizePrice({ minPrice, maxPrice, price });
  return orderType === "sell" ? normalizedPrice : new BigNumber(1, 10).minus(new BigNumber(normalizedPrice, 10)).toFixed();
}
