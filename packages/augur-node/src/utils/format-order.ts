import BigNumber from "bignumber.js";
import { roundToPrecision } from "./round-to-precision";
import { MINIMUM_TRADE_SIZE, PRECISION } from "../constants";

export function formatOrderAmount(fullPrecisionAmount: string|number|BigNumber): string {
  return roundToPrecision(fullPrecisionAmount, MINIMUM_TRADE_SIZE);
}

export function formatOrderPrice(orderType: string, minPrice: string|number|BigNumber, maxPrice: string|number|BigNumber, fullPrecisionPrice: string|number|BigNumber): string {
  if (orderType !== "buy" && orderType !== "sell") throw new Error("order type must be 'buy' or 'sell'");
  return orderType === "buy" ?
    roundToPrecision(fullPrecisionPrice, PRECISION.zero, "floor", BigNumber.ROUND_DOWN) :
    roundToPrecision(fullPrecisionPrice, PRECISION.zero, "ceil", BigNumber.ROUND_UP);
}
