import { createBigNumber } from "utils/create-big-number";
import selectMyMarkets from "modules/markets/selectors/user-markets";
import { ZERO } from "modules/common-elements/constants";

export default function() {
  const markets = selectMyMarkets();

  const numMarkets = markets.length;
  const totalValue = markets
    .reduce(
      (prevTotal, currentMarket) =>
        prevTotal.plus(createBigNumber(currentMarket.fees.value, 10)),
      ZERO
    )
    .toNumber();

  return {
    numMarkets,
    totalValue
  };
}
