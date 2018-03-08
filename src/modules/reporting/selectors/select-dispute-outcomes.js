import { BINARY } from 'modules/markets/constants/market-types'
import { revertPayoutNumerators } from 'utils/revert-payout-numerators'

export default function (market, disputeStakes) {
  const stakes = disputeStakes.sort((a, b) => a.totalStake > b.totalStake)
  // only take the top 8 outcomes
  // const topDisputes = disputeStakes.slice(8)
  const { marketType, reportableOutcomes } = market
  const outcomes = reportableOutcomes.slice()
  const disputeOutcomes = stakes.map(stake => populateNameId(marketType, outcomes, market, stake))
  const finishedOutcomes = outcomes.reduce(fillInOutcomes, disputeOutcomes)
  return finishedOutcomes
}

const fillInOutcomes = (collection, outcome) => {
  if (!collection.find(item => item.id.toString() === outcome.id)) {
    return [...collection, outcome]
  }
  return collection
}

const populateNameId = (marketType, outcomes, market, stake) => {
  if (!stake) return {}
  if (stake.payout.length === 0) return {}

  // TODO: issue with falsy in augur-node isInvalid returning incorrectly
  // if (stake.isInvalid === true) return stake
  // TODO: stake.invalid needs to be sent to revert payout numerators
  stake.id = revertPayoutNumerators(market, stake.payout, false)
  stake.name = stake.id
  let outcome = outcomes.find(outcome => outcome.id === stake.id.toString())
  if (outcome) {
    outcome = { ...stake, ...outcome }
  } else {
    outcome = { ...stake }
    if (marketType === BINARY && stake.id === 0) stake.name = 'No'
  }

  return outcome
}
