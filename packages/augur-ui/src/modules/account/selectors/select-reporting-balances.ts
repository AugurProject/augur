import type { Getters } from '@augurproject/sdk';
import {
  selectLoginAccountBalancesState,
  selectLoginAccountReportingState,
} from 'appStore/select-state';
import loginAccount from 'modules/auth/selectors/login-account';
import { ZERO } from 'modules/common/constants';
import { AccountBalances } from 'modules/types';
import { createSelector } from 'reselect';
import { createBigNumber } from 'utils/create-big-number';
import { formatAttoRep, formatPercent, formatRep } from 'utils/format-number';

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
      participationTokens,
    } = accountReporting;
    let hasStakedRep = false;
    const repBalanceFormatted = formatRep(accountBalances.rep);
    // TODO: need to get profit for staking when available on getter
    const repProfitLossPercentageFormatted = formatPercent(
      createBigNumber(ZERO).times(100),
      { decimalsRounded: 2 }
    );
    const repProfitAmountFormatted = formatAttoRep(ZERO);
    let participationAmountFormatted = formatAttoRep(ZERO);
    let reportingAmountFormatted = formatAttoRep(ZERO);
    let disputingAmountFormatted = formatAttoRep(ZERO);

    if (participationTokens && participationTokens.totalStaked) {
      participationAmountFormatted = formatAttoRep(
        participationTokens.totalStaked
      );
      if (!hasStakedRep) hasStakedRep = true;
    }
    if (reporting && reporting.totalStaked) {
      reportingAmountFormatted = formatAttoRep(reporting.totalStaked);
      if (!hasStakedRep) hasStakedRep = true;
    }
    if (disputing && disputing.totalStaked) {
      disputingAmountFormatted = formatAttoRep(disputing.totalStaked);
      if (!hasStakedRep) hasStakedRep = true;
    }

    const repTotalAmountStaked = createBigNumber(participationAmountFormatted.value)
      .plus(createBigNumber(reportingAmountFormatted.value))
      .plus(createBigNumber(disputingAmountFormatted.value));
    const repTotalAmountStakedFormatted = formatRep(repTotalAmountStaked);


    // TODO: wire this up when governance contracts are in
    const stakedSrep = '0';
    return {
      repBalanceFormatted,
      repProfitLossPercentageFormatted,
      repProfitAmountFormatted,
      disputingAmountFormatted,
      reportingAmountFormatted,
      participationAmountFormatted,
      repTotalAmountStakedFormatted,
      hasStakedRep,
      stakedSrep,
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
  const stakedSrep = formatAttoRep(ZERO);

  return {
    repBalanceFormatted,
    repProfitLossPercentageFormatted,
    repProfitAmountFormatted,
    disputingAmountFormatted,
    reportingAmountFormatted,
    participationAmountFormatted,
    repTotalAmountStakedFormatted,
    stakedSrep
  };
};
