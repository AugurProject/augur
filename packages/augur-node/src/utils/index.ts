import { BigNumber } from "../types";
import  speedomatic = require("speedomatic");

export function convertOnChainAmountToDisplayAmount(onChainAmount:BigNumber, tickSize:BigNumber) {
  return speedomatic.unfix(onChainAmount.div(tickSize));
}

export function convertOnChainPriceToDisplayPrice(onChainPrice:BigNumber, minDisplayPrice:BigNumber, tickSize:BigNumber) {
  return onChainPrice.mul(tickSize).add(minDisplayPrice);
}
