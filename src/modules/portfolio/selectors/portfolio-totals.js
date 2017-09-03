import { formatEtherTokens } from 'utils/format-number';
import selectMyPositionsSummary from 'modules/my-positions/selectors/my-positions-summary';
import selectMyMarketsSummary from 'modules/my-markets/selectors/my-markets-summary';
import speedomatic from 'speedomatic';

export default function () {
  const positionsSummary = selectMyPositionsSummary();
  const marketsSummary = selectMyMarketsSummary();

  const totalValue = formatEtherTokens(speedomatic.bignum((positionsSummary && positionsSummary.totalValue && positionsSummary.totalValue.value) || 0).plus(speedomatic.bignum((marketsSummary && marketsSummary.totalValue) || 0)));
  const netChange = formatEtherTokens(speedomatic.bignum((positionsSummary && positionsSummary.netChange && positionsSummary.netChange.value) || 0).plus(speedomatic.bignum((marketsSummary && marketsSummary.totalValue) || 0)));

  return {
    totalValue,
    netChange
  };
}
