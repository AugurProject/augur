import { createSelector } from 'reselect';
import { formatDai, formatNone, formatDaiAbbr } from 'utils/format-number';
import { selectAccountFunds } from 'modules/auth/selectors/login-account';
import { AuthStatus } from 'modules/types';
import { selectAuthStatus } from 'appStore/select-state';

export const selectOutcomeLastPrice = (
  marketOutcomeData: any,
  outcomeId: any
) => {
  if (!marketOutcomeData || !outcomeId) return null;
  return (marketOutcomeData[outcomeId] || {}).price;
};

export const selectCoreStats = createSelector(
  selectAccountFunds,
  selectAuthStatus,
  (accountFunds: any, authStatus: AuthStatus) => {
    const availableFunds = {
      label: 'Available Funds',
      value: formatDaiAbbr(accountFunds.totalAvailableTradingBalance, {
        removeComma: true,
      }),
      useFull: true,
    };
    const frozenFunds = {
      label: 'Frozen Funds',
      value: formatDaiAbbr(accountFunds.totalFrozenFunds, {
        removeComma: true,
      }),
      useFull: true,
    };
    const totalFunds = {
      label: 'Total Funds',
      value: formatDaiAbbr(accountFunds.totalAccountValue, {
        removeComma: true,
      }),
      useFull: true,
    };
    const realizedPL = {
      label: '30 Day P/L',
      value: formatDaiAbbr(accountFunds.totalRealizedPL, {
        removeComma: true,
       }),
      useFull: true,
    };
    if (!authStatus.isLogged) {
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
