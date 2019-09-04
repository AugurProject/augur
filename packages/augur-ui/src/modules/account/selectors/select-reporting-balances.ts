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
  formatRep
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
    const repBalanceFormatted = formatRep(accountBalances.rep);
    const repProfitLossPercentageFormatted = formatPercent(
      createBigNumber(profitLoss || ZERO).times(100),
      { decimalsRounded: 2 }
    );
    const repProfitAmountFormatted = formatAttoRep(profitAmount || ZERO);
    let participationAmountFormatted = formatAttoRep(ZERO);
    let reportingAmountFormatted = formatAttoRep(ZERO);
    let disputingAmountFormatted = formatAttoRep(ZERO);

    if (pariticipationTokens && pariticipationTokens.totalAmount)
      participationAmountFormatted = formatAttoRep(
        pariticipationTokens.totalAmount
      );
    if (reporting && reporting.totalAmount)
      reportingAmountFormatted = formatAttoRep(reporting.totalAmount);
    if (disputing && disputing.totalAmount)
      disputingAmountFormatted = formatAttoRep(disputing.totalAmount);

    const repTotalAmountStaked = createBigNumber(participationAmountFormatted.value)
      .plus(createBigNumber(reportingAmountFormatted.value))
      .plus(createBigNumber(disputingAmountFormatted.value));
    const repTotalAmountStakedFormatted = formatRep(repTotalAmountStaked);
    return {
      repBalanceFormatted,
      repProfitLossPercentageFormatted,
      repProfitAmountFormatted,
      disputingAmountFormatted,
      reportingAmountFormatted,
      participationAmountFormatted,
      repTotalAmountStakedFormatted
    };
  }
);

export const selectDefaultReportingBalances = () => {
  const repBalanceFormatted = formatAttoRep(ZERO);
  const repProfitLossPercentageFormatted = formatPercent(
    createBigNumber(ZERO),
    { decimalsRounded: 2 }
  );
  const repProfitAmountFormatted = formatAttoRep(ZERO);
  const participationAmountFormatted = formatAttoRep(ZERO);
  const reportingAmountFormatted = formatAttoRep(ZERO);
  const disputingAmountFormatted = formatAttoRep(ZERO);
  const repTotalAmountStakedFormatted = formatAttoRep(ZERO);

  return {
    repBalanceFormatted,
    repProfitLossPercentageFormatted,
    repProfitAmountFormatted,
    disputingAmountFormatted,
    reportingAmountFormatted,
    participationAmountFormatted,
    repTotalAmountStakedFormatted,
  };
};
