import BigNumber from 'bignumber.js'
import { formatEther } from 'utils/format-number'
import { generateMarketsPositionsSummary } from 'modules/my-positions/selectors/my-positions-summary'
import selectAllMarkets from 'modules/markets/selectors/markets-all'
import selectMyMarketsSummary from 'modules/my-markets/selectors/my-markets-summary'

export default function () {
  const positionsSummary = generateMarketsPositionsSummary(selectAllMarkets())
  const marketsSummary = selectMyMarketsSummary()

  const totalValue = formatEther(new BigNumber((positionsSummary && positionsSummary.totalNet && positionsSummary.totalNet.value) || 0, 10).plus(new BigNumber((marketsSummary && marketsSummary.totalNet) || 0, 10)))
  const netChange = formatEther(new BigNumber((positionsSummary && positionsSummary.netChange && positionsSummary.netChange.value) || 0, 10).plus(new BigNumber((marketsSummary && marketsSummary.totalValue) || 0, 10)))

  return {
    totalValue,
    netChange,
  }
}
