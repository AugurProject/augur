import { BINARY } from 'modules/markets/constants/market-types'
import { calculatePayoutNumeratorsValue } from 'utils/calculate-payout-numerators-value'

export default function (market, disputeStakes) {
  const stakes = disputeStakes.sort((a, b) => a.totalStake > b.totalStake)
  // only take the top 8 outcomes
  // const topDisputes = disputeStakes.slice(8)
  const { marketType, reportableOutcomes } = market
  const outcomes = reportableOutcomes.slice()
  const disputeOutcomes = stakes.map(stake => populateNameId(marketType, outcomes, market, stake))
  const tentativeWinner = disputeOutcomes.find(stake => stake.tentativeWinning)
  const uniqueStakes = disputeOutcomes.reduce((p, stake) => {
    if (!p.find(o => o.id === stake.id)) {
      if (stake.id === tentativeWinner.id) {
        return [...p, tentativeWinner]
      }
      return [...p, stake]
    }
    return p
  }, [])
    .reduce(fillInOutcomes, outcomes)
  return uniqueStakes
}

const fillInOutcomes = (collection, outcome) => {
  const index = collection.map(e => e.id).indexOf(outcome.id)
  if (index === -1) {
    return [...collection, outcome]
  }
  collection[index] = outcome
  return collection
}

const populateNameId = (marketType, outcomes, market, stake) => {
  if (!stake) return {}
  if (stake.payout.length === 0) return {}

  let outcome
  if (stake.isInvalid) {
    // '0.5' is the indetermine/invalid id from reportable outcomes
    outcome = outcomes.find(outcome => outcome.id === '0.5')
  } else {
    stake.id = calculatePayoutNumeratorsValue(market, stake.payout, stake.isInvalid)
    stake.name = stake.id
    outcome = outcomes.find(outcome => outcome.id === stake.id.toString())
  }

  if (outcome) {
    outcome = { ...stake, ...outcome }
  } else {
    outcome = { ...stake }
    if (marketType === BINARY && stake.id === 0) stake.name = 'No'
  }

  return outcome
}
