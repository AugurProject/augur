import Augur from "augur.js";
import BigNumber from "bignumber.js";

export function calculateFillPrice(augur: Augur, price: BigNumber, minPrice: BigNumber, maxPrice: BigNumber, orderType: string): BigNumber {
  const normalizedPrice = new BigNumber(augur.trading.normalizePrice({ minPrice, maxPrice, price }), 10);
  return orderType === "sell" ? normalizedPrice : new BigNumber(1, 10).minus(normalizedPrice);
}
