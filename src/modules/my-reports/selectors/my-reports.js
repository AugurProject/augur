import { createBigNumber } from 'utils/create-big-number'
import { formatEther, formatPercent, formatRep } from 'utils/format-number'
import { formatDate } from 'utils/format-date'
import { TWO } from 'modules/trade/constants/numbers'
import store from 'src/store'

export default function () {
  const { marketsWithAccountReport, marketsData } = store.getState()

  if (!marketsWithAccountReport) {
    return []
  }

  const reports = Object.keys(marketsWithAccountReport)
    .map((marketId) => {
      const expirationDate = marketsWithAccountReport[marketId].expirationDate || null
      const isFinal = marketsWithAccountReport[marketId].isFinal || null
      const description = marketsWithAccountReport[marketId].description || null
      const formattedDescription = marketsWithAccountReport[marketId].formattedDescription || null
      const outcome = marketsWithAccountReport[marketId].marketOutcome || null
      const outcomePercentage = (marketsWithAccountReport[marketId].proportionCorrect && formatPercent(createBigNumber(marketsWithAccountReport[marketId].proportionCorrect, 10).times(100))) || null
      const reported = marketsWithAccountReport[marketId].accountReport || null
      const isReportEqual = (outcome != null && reported != null && outcome === reported) || null // Can be done here
      const feesEarned = calculateFeesEarned(marketsWithAccountReport[marketId])
      const repEarned = (marketsWithAccountReport[marketId].repEarned && formatRep(marketsWithAccountReport[marketId].repEarned)) || null
      const endTime = (expirationDate && formatDate(expirationDate)) || null
      const isChallenged = marketsWithAccountReport[marketId].isChallenged || null
      const isChallengeable = isFinal != null && isChallenged != null && !isFinal && !isChallenged
      const period = marketsWithAccountReport[marketId].period || null
      const { isSubmitted } = marketsWithAccountReport[marketId]

      return {
        ...(marketsData[marketId] || {}), // TODO -- clean up this object
        marketId,
        description,
        formattedDescription,
        outcome,
        outcomePercentage,
        reported,
        isReportEqual,
        feesEarned,
        repEarned,
        endTime,
        isChallenged,
        isChallengeable,
        period,
        isSubmitted,
      }
    })
    .sort((a, b) => {
      if (a.period && b.period) {
        return b.period - a.period
      }
      return 1
    })

  return reports
}

export const calculateFeesEarned = (market) => {
  if (!market.marketFees || !market.repBalance || !market.marketWeight) return null
  return formatEther(createBigNumber(market.marketFees, 10)
    .times(createBigNumber(market.repBalance, 10))
    .dividedBy(TWO)
    .dividedBy(createBigNumber(market.marketWeight, 10)))
}
