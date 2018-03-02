import BigNumber from 'bignumber.js'
import { formatEtherTokens } from 'utils/format-number'
import selectMyPositionsSummary from 'modules/my-positions/selectors/my-positions-summary'
import selectMyMarketsSummary from 'modules/my-markets/selectors/my-markets-summary'

export default function () {
  const positionsSummary = selectMyPositionsSummary()
  const marketsSummary = selectMyMarketsSummary()

  const totalValue = formatEtherTokens(new BigNumber((positionsSummary && positionsSummary.totalNet && positionsSummary.totalNet.value) || 0, 10).plus(new BigNumber((marketsSummary && marketsSummary.totalNet) || 0, 10)))
  const netChange = formatEtherTokens(new BigNumber((positionsSummary && positionsSummary.netChange && positionsSummary.netChange.value) || 0, 10).plus(new BigNumber((marketsSummary && marketsSummary.totalValue) || 0, 10)))

  return {
    totalValue,
    netChange,
  }
}
