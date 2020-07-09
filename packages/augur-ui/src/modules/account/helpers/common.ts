import {
  formatAttoRep,
  formatPercent,
  formatRep
} from 'utils/format-number';
import { ZERO } from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';
import { AppStatus } from 'modules/app/store/app-status';

export const hasStakeInMarket = (marketId: string) => {
  const { loginAccount: { reporting: accountReporting }} = AppStatus.get();
  const { reporting, disputing } = accountReporting;
  if (!accountReporting) return false;
  let hasStaked = false;

  if (reporting?.contracts?.length > 0) {
    hasStaked = !!reporting.contracts.find(c => c.marketId === marketId);
  }

  if (hasStaked) return hasStaked;

  if (disputing?.contracts?.length > 0) {
    hasStaked = !!disputing.contracts.find(c => c.marketId === marketId);
  }
  return hasStaked;
};

export const selectReportingBalances = (
  accountReporting,
  accountBalances
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

  return {
    repBalanceFormatted,
    repProfitLossPercentageFormatted,
    repProfitAmountFormatted,
    disputingAmountFormatted,
    reportingAmountFormatted,
    participationAmountFormatted,
    repTotalAmountStakedFormatted,
    hasStakedRep
  };
};

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
    hasStakedRep: false,
  };
};
