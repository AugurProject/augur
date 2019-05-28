import { createSelector } from "reselect";
import { formatEther } from "utils/format-number";
import { selectAccountFunds } from "modules/auth/selectors/login-account";

export const selectOutcomeLastPrice = (marketOutcomeData: any, outcomeId: any) => {
  if (!marketOutcomeData || !outcomeId) return null;
  return (marketOutcomeData[outcomeId] || {}).price;
};

export const selectCoreStats = createSelector(
  selectAccountFunds,
  (accountFunds: any) => 
    ({
      availableFunds: {
        label: "Available Funds",
        value: formatEther(accountFunds.totalAvailableTradingBalance).formatted
      },
      frozenFunds: {
        label: "Frozen Funds",
        value: formatEther(accountFunds.totalFrozenFunds).formatted
      },
      totalFunds: {
        label: "Total Funds",
        value: formatEther(accountFunds.totalAccountValue).formatted
      },
      realizedPL: {
        label: "Realized P/L",
        value: "0" // need to get realized PnL from contract log emitted
      }
    })
);
