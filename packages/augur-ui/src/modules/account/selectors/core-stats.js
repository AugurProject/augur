import { createSelector } from "reselect";
import { formatEther } from "utils/format-number";
import {
  selectLoginAccount,
  selectAccountFunds
} from "modules/auth/selectors/login-account";

export const selectOutcomeLastPrice = (marketOutcomeData, outcomeId) => {
  if (!marketOutcomeData || !outcomeId) return null;
  return (marketOutcomeData[outcomeId] || {}).price;
};

export const selectCoreStats = createSelector(
  selectLoginAccount,
  selectAccountFunds,
  (loginAccount, accountFunds) => [
    {
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
      }
    },
    {
      realizedPL: {
        label: "Realized P/L",
        value: formatEther(loginAccount.realizedPL).formatted
      }
    }
  ]
);
