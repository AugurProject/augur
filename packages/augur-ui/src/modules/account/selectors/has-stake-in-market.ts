import type { Getters } from '@augurproject/sdk';
import { selectLoginAccountReportingState } from 'appStore/select-state';
import { createSelector } from 'reselect';

export const hasStakeInMarket = (state, marketId: string) => {
  if (!marketId) return false;
  return selectMarketStake(state, { marketId });
};

const getMarketid = (state, props) => props.marketId;

const selectMarketStake = createSelector(
  selectLoginAccountReportingState,
  getMarketid,
  (
    accountReporting: Getters.Accounts.AccountReportingHistory,
    marketId: string
  ) => {
    if (!accountReporting) return false;
    const { reporting, disputing } = accountReporting;
    let hasStaked = false;

    if (reporting && reporting.contracts.length > 0)
      hasStaked = !!reporting.contracts.find(c => c.marketId === marketId);

    if (hasStaked) return true;

    if (disputing && disputing.contracts.length > 0)
      hasStaked = !!disputing.contracts.find(c => c.marketId === marketId);

    return hasStaked;
  }
);
