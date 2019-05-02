import { convertUnixToFormattedDate } from "utils/format-date";
import { ZERO } from "modules/common-elements/constants";
import { createBigNumber } from "utils/create-big-number";

export const getLastTradeTimestamp = marketTradeHistory =>
  convertUnixToFormattedDate(
    (marketTradeHistory || []).reduce(
      (p, t) =>
        createBigNumber(t.timestamp || 0).gt(p)
          ? createBigNumber(t.timestamp)
          : p,
      ZERO
    )
  );
