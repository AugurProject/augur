import { convertUnixToFormattedDate } from "utils/format-date";
import { ZERO } from "modules/common/constants";
import { createBigNumber } from "utils/create-big-number";
import { DateFormattedObject } from "modules/types";

export const getLastTradeTimestamp = (marketTradeHistory): DateFormattedObject =>
  convertUnixToFormattedDate(
    (marketTradeHistory || []).reduce(
      (p, t) =>
        createBigNumber(t.timestamp || 0).gt(p)
          ? createBigNumber(t.timestamp)
          : p,
      ZERO,
    ),
  );
