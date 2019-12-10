import { convertUnixToFormattedDate } from "utils/format-date";
import { createBigNumber } from "utils/create-big-number";
import { orderBy } from "lodash";

export const marketTradingPriceTimeSeries = (marketPriceHistory, outcome) => {
  const sortedPriceHistory = orderBy(
    marketPriceHistory,
    ["timestamp", "logIndex"],
    ["desc", "desc"]
  );
  const datedPriceHistory = sortedPriceHistory.reduce((p, item, i) => {
    if (item.outcome !== outcome) return p;
    const dateBreakDown = convertUnixToFormattedDate(item.timestamp);
    const date = dateBreakDown.formattedLocalShortDate;
    const time = dateBreakDown.formattedShortTime;
    // todo: need to undo this rounding here
    const trade = {
      amount: createBigNumber(item.amount),
      price: createBigNumber(item.price),
      type: item.type,
      date,
      time,
      key: date + item.time + item.price + item.amount + i
    };
    const dayItems = p[date] || [];
    return { ...p, [date]: [...dayItems, trade] };
  }, {});

  return datedPriceHistory;
};
