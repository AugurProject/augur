import { createSelector } from 'reselect';
import { formatDai } from 'utils/format-number';
import { selectAccountFunds } from 'modules/auth/selectors/login-account';

export const selectOutcomeLastPrice = (
  marketOutcomeData: any,
  outcomeId: any
) => {
  if (!marketOutcomeData || !outcomeId) return null;
  return (marketOutcomeData[outcomeId] || {}).price;
};

export const selectCoreStats = createSelector(
  selectAccountFunds,
  (accountFunds: any) => ({
    availableFunds: {
      label: 'Available Funds',
      value: formatDai(accountFunds.totalAvailableTradingBalance, {
        removeComma: true,
      }),
      useFull: true,
    },
    frozenFunds: {
      label: 'Frozen Funds',
      value: formatDai(accountFunds.totalFrozenFunds, { removeComma: true }),
      useFull: true,
    },
    totalFunds: {
      label: 'Total Funds',
      value: formatDai(accountFunds.totalAccountValue, { removeComma: true }),
      useFull: true,
    },
    realizedPL: {
      label: 'Realized P/L',
      value: formatDai(accountFunds.totalRealizedPL, { removeComma: true }),
      useFull: true,
    },
  })
);
