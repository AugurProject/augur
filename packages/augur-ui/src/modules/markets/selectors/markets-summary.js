import { createBigNumber } from "utils/create-big-number";
import { getUserMarkets } from "modules/markets/selectors/user-markets";
import { ZERO } from "modules/trades/constants/numbers";

export default function(state) {
  const markets = getUserMarkets(state);
  if (!markets || markets.length === 0) return {};

  const numMarkets = markets.length;
  const totalValue = markets
    .reduce(
      (prevTotal, currentMarket) =>
        prevTotal.plus(
          createBigNumber(
            (currentMarket.fees && currentMarket.fees.value) || "0",
            10
          )
        ),
      ZERO
    )
    .toNumber();

  return {
    numMarkets,
    totalValue
  };
}
