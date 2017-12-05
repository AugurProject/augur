import BigNumber from 'bignumber.js'
import { formatEtherTokens, formatPercent, formatRep } from 'utils/format-number'
import { formatDate } from 'utils/format-date'
import { TWO } from 'modules/trade/constants/numbers'
import store from 'src/store'

export default function () {
  const { marketsWithAccountReport, marketsData } = store.getState()

  if (!marketsWithAccountReport) {
    return []
  }

  const reports = Object.keys(marketsWithAccountReport)
    .map((marketID) => {
      const expirationDate = marketsWithAccountReport[marketID].expirationDate || null
      const isFinal = marketsWithAccountReport[marketID].isFinal || null
      const description = marketsWithAccountReport[marketID].description || null
      const formattedDescription = marketsWithAccountReport[marketID].formattedDescription || null
      const outcome = marketsWithAccountReport[marketID].marketOutcome || null
      const outcomePercentage = (marketsWithAccountReport[marketID].proportionCorrect && formatPercent(new BigNumber(marketsWithAccountReport[marketID].proportionCorrect, 10).times(100))) || null
      const reported = marketsWithAccountReport[marketID].accountReport || null
      const isReportEqual = (outcome != null && reported != null && outcome === reported) || null // Can be done here
      const feesEarned = calculateFeesEarned(marketsWithAccountReport[marketID])
      const repEarned = (marketsWithAccountReport[marketID].repEarned && formatRep(marketsWithAccountReport[marketID].repEarned)) || null
      const endDate = (expirationDate && formatDate(expirationDate)) || null
      const isChallenged = marketsWithAccountReport[marketID].isChallenged || null
      const isChallengeable = isFinal != null && isChallenged != null && !isFinal && !isChallenged
      const period = marketsWithAccountReport[marketID].period || null
      const { isSubmitted } = marketsWithAccountReport[marketID]

      return {
        ...marketsData[marketID] || {}, // TODO -- clean up this object
        marketID,
        description,
        formattedDescription,
        outcome,
        outcomePercentage,
        reported,
        isReportEqual,
        feesEarned,
        repEarned,
        endDate,
        isChallenged,
        isChallengeable,
        period,
        isSubmitted
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
  return formatEtherTokens(new BigNumber(market.marketFees, 10)
    .times(new BigNumber(market.repBalance, 10))
    .dividedBy(TWO)
    .dividedBy(new BigNumber(market.marketWeight, 10)))
}
