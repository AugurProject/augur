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
