import { createSelector } from 'reselect';
import { formatDai, formatNone } from 'utils/format-number';
import { selectAccountFunds } from 'modules/auth/selectors/login-account';
import { AppStatusState } from 'modules/app/store/app-status';

export const selectOutcomeLastPrice = (
  marketOutcomeData: any,
  outcomeId: any
) => {
  if (!marketOutcomeData || !outcomeId) return null;
  return (marketOutcomeData[outcomeId] || {}).price;
};

export const selectCoreStats = createSelector(
  selectAccountFunds,
  (accountFunds: any) => {
    const availableFunds = {
      label: 'Available Funds',
      value: formatDai(accountFunds.totalAvailableTradingBalance, {
        removeComma: true,
      }),
      useFull: true,
    };
    const frozenFunds = {
      label: 'Frozen Funds',
      value: formatDai(accountFunds.totalFrozenFunds, { removeComma: true }),
      useFull: true,
    };
    const totalFunds = {
      label: 'Total Funds',
      value: formatDai(accountFunds.totalAccountValue, { removeComma: true }),
      useFull: true,
    };
    const realizedPL = {
      label: '30 Day P/L',
      value: formatDai(accountFunds.totalRealizedPL, { removeComma: true }),
      useFull: true,
    };
    if (!AppStatusState.get().isLogged) {
      availableFunds.value = formatNone();
      frozenFunds.value = formatNone();
      totalFunds.value = formatNone();
      realizedPL.value = formatNone();
    }
    return {
      availableFunds,
      frozenFunds,
      totalFunds,
      realizedPL,
    };
  }
);
