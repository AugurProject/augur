import { createSelector } from 'reselect';
import { Getters } from '@augurproject/sdk';
import { selectLoginAccountReportingState } from 'appStore/select-state';

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
