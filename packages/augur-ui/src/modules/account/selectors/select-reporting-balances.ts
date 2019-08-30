import { createSelector } from 'reselect';
import { Getters } from '@augurproject/sdk';
import {
  selectLoginAccountReportingState,
  selectLoginAccountBalancesState,
} from 'store/select-state';
import { AccountBalances } from 'modules/types';
import {
  formatAttoRep,
  formatPercent,
  formatNumber,
} from 'utils/format-number';
import { ZERO } from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';

export const selectReportingBalances = createSelector(
  selectLoginAccountReportingState,
  selectLoginAccountBalancesState,
  (
    accountReporting: Getters.Accounts.AccountReportingHistory,
    accountBalances: AccountBalances
  ) => {
    const {
      reporting,
      disputing,
      pariticipationTokens,
      profitAmount,
      profitLoss,
    } = accountReporting;
    const repBalanceFormatted = formatAttoRep(accountBalances.rep);
    const repProfitLossPercentageFormatted = formatPercent(
      createBigNumber(profitLoss || ZERO).times(100),
      { decimalsRounded: 2 }
    );
    const repProfitAmountFormatted = formatAttoRep(profitAmount || ZERO);
    let participationAmountFormatted = formatNumber(ZERO);
    let reportingAmountFormatted = formatNumber(ZERO);
    let disputingAmountFormatted = formatNumber(ZERO);

    if (pariticipationTokens && pariticipationTokens.totalAmount)
      participationAmountFormatted = formatNumber(
        pariticipationTokens.totalAmount
      );
    if (reporting && reporting.totalAmount)
      reportingAmountFormatted = formatNumber(reporting.totalAmount);
    if (disputing && disputing.totalAmount)
      disputingAmountFormatted = formatNumber(disputing.totalAmount);

    return {
      repBalanceFormatted,
      repProfitLossPercentageFormatted,
      repProfitAmountFormatted,
      disputingAmountFormatted,
      reportingAmountFormatted,
      participationAmountFormatted,
    };
  }
);

export const selectDefaultReportingBalances = () => {
  const repBalanceFormatted = formatNumber(ZERO);
  const repProfitLossPercentageFormatted = formatPercent(
    createBigNumber(ZERO),
    { decimalsRounded: 2 }
  );
  const repProfitAmountFormatted = formatNumber(ZERO);
  let participationAmountFormatted = formatNumber(ZERO);
  let reportingAmountFormatted = formatNumber(ZERO);
  let disputingAmountFormatted = formatNumber(ZERO);

  return {
    repBalanceFormatted,
    repProfitLossPercentageFormatted,
    repProfitAmountFormatted,
    disputingAmountFormatted,
    reportingAmountFormatted,
    participationAmountFormatted,
  };
};
