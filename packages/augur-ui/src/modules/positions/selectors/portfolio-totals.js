import { createBigNumber } from "utils/create-big-number";
import { formatEther } from "utils/format-number";
import { generateMarketsPositionsSummary } from "modules/positions/selectors/positions-summary";
import selectAllMarkets from "modules/markets/selectors/markets-all";
import selectMarketsSummary from "modules/markets/selectors/markets-summary";

export default function() {
  const positionsSummary = generateMarketsPositionsSummary(selectAllMarkets());
  const marketsSummary = selectMarketsSummary();

  const totalValue = formatEther(
    createBigNumber(
      (positionsSummary &&
        positionsSummary.totalNet &&
        positionsSummary.totalNet.value) ||
        0,
      10
    ).plus(
      createBigNumber((marketsSummary && marketsSummary.totalNet) || 0, 10)
    )
  );
  const netChange = formatEther(
    createBigNumber(
      (positionsSummary &&
        positionsSummary.netChange &&
        positionsSummary.netChange.value) ||
        0,
      10
    ).plus(
      createBigNumber((marketsSummary && marketsSummary.totalValue) || 0, 10)
    )
  );

  return {
    totalValue,
    netChange
  };
}
