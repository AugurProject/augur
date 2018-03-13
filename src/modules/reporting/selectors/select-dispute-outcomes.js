import { SCALAR } from 'modules/markets/constants/market-types'
import calculatePayoutNumeratorsValue from 'utils/calculate-payout-numerators-value'
import { isEmpty } from 'lodash'

export default function (market, disputeStakes) {
  if (isEmpty(disputeStakes)) return market.reportableOutcomes
  const { marketType, reportableOutcomes } = market
  const outcomes = reportableOutcomes.slice()
  const disputeOutcomes = disputeStakes.map(stake => populateFromOutcome(marketType, outcomes, market, stake))
  const tentativeWinner = disputeOutcomes.find(stake => stake.tentativeWinning)
  return disputeOutcomes.reduce((p, stake) => {
    if (!p.find(o => o.id === stake.id)) {
      if (stake.id === tentativeWinner.id) {
        return [...p, tentativeWinner]
      }
      return [...p, stake]
    }
    return p
  }, [])
    .sort((a, b) => a.totalStake < b.totalStake).slice(0, 8)
    .reduce(fillInOutcomes, outcomes)
    .sort((a, b) => a.totalStake < b.totalStake)

}

const fillInOutcomes = (collection, outcome) => {
  const index = collection.map(e => e.id).indexOf(outcome.id.toString())
  if (index === -1) {
    return [...collection, outcome]
  }
  collection[index] = outcome
  return collection
}

const populateFromOutcome = (marketType, outcomes, market, stake) => {
  if (!stake) return {}
  if (stake.payout.length === 0) return {}

  let outcome
  if (stake.isInvalid) {
    // '0.5' is the indetermine/invalid id from reportable outcomes
    outcome = outcomes.find(outcome => outcome.id === '0.5')
    return { ...outcome, ...stake }
  }

  stake.id = calculatePayoutNumeratorsValue(market, stake.payout, stake.isInvalid).toString()
  outcome = outcomes.find(outcome => outcome.id === stake.id)

  if (marketType === SCALAR) stake.name = stake.id
  return { ...stake, ...outcome }
}
