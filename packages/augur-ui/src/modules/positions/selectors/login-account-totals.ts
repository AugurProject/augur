import { ZERO } from 'modules/common/constants';
import { formatPercent } from 'utils/format-number';
import { createBigNumber } from 'utils/create-big-number';
import { AppStatus } from 'modules/app/store/app-status';

export default function() {
  return selectLoginAccountTotals();
}

export const selectLoginAccountTotals = () => {
  const {
    loginAccount: { tradingPositionsTotal: totals },
  } = AppStatus.get();
  if (!totals) {
    return formatPercent(ZERO, { decimalsRounded: 2 }).formatted;
  }
  return formatPercent(
    createBigNumber(totals.unrealizedRevenue24hChangePercent || ZERO).times(
      100
    ),
    {
      decimalsRounded: 2,
    }
  ).formatted;
};
