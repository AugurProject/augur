import { createSelector } from "reselect";
import { ZERO } from "modules/common/constants";
import store from "appStore";
import { selectLoginAccountTotalsState } from "appStore/select-state";
import { formatPercent } from "utils/format-number";
import { createBigNumber } from "utils/create-big-number";

export default function() {
  return selectLoginAccountTotals(store.getState());
}

export const selectLoginAccountTotals = createSelector(
  selectLoginAccountTotalsState,
  (totals) => {
    if (!totals) {
      return formatPercent(ZERO, { decimalsRounded: 2 }).formatted;
    }
    return formatPercent(
      createBigNumber(totals.unrealizedRevenue24hChangePercent || ZERO).times(
        100,
      ),
      {
        decimalsRounded: 2,
      },
    ).formatted;
  },
);
