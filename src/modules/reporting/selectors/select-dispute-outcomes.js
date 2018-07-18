import { SCALAR } from 'modules/markets/constants/market-types'
import calculatePayoutNumeratorsValue from 'utils/calculate-payout-numerators-value'
import { isEmpty } from 'lodash'
import { createBigNumber } from 'utils/create-big-number'

export default function (market, disputeStakes, newOutcomeDisputeBond, forkThreshold) {
  const TopOutcomeCount = 8
  const invalidMarketId = '0.5'
  if (isEmpty(disputeStakes)) return market.reportableOutcomes
  const { marketType, reportableOutcomes } = market
  const outcomes = reportableOutcomes.slice()
  const defaultStake = {
    stakeCurrent: '0',
    accountStakeCurrent: '0',
    accountStakeCompleted: '0',
    bondSizeCurrent: newOutcomeDisputeBond,
    potentialFork: false,
    stakeCompleted: '0',
    stakeRemaining: newOutcomeDisputeBond,
    tentativeWinning: false,
  }
  const addDefaultStakeOutcomes = outcomes.reduce((p, o) => {
    const result = [...p, Object.assign(o, defaultStake)]
    return result
  }, [])

  const disputeOutcomes = disputeStakes.map(stake => populateFromOutcome(marketType, addDefaultStakeOutcomes, market, stake, newOutcomeDisputeBond, forkThreshold))
  const tentativeWinner = disputeOutcomes.find(stake => stake.tentativeWinning)
  const filteredOutcomes = disputeOutcomes.reduce((p, stake) => {
    if (!p.find(o => o.id === stake.id)) {
      if (stake.id === tentativeWinner.id) {
        return [...p, tentativeWinner]
      }
      return [...p, stake]
    }
    return p
  }, [])
    .reduce(fillInOutcomes, addDefaultStakeOutcomes)
    .filter(o => !o.tentativeWinning)

  const invalidOutcome = getInvalidOutcome(filteredOutcomes, addDefaultStakeOutcomes, invalidMarketId)

  invalidOutcome.potentialFork = !invalidOutcome.tentativeWinning && createBigNumber(invalidOutcome.bondSizeCurrent || newOutcomeDisputeBond, 10).gt(forkThreshold)
  const sortedOutcomes = filteredOutcomes.sort((a, b) => sortOutcomes(a, b)).slice(0, TopOutcomeCount)
  const allDisputedOutcomes = [tentativeWinner, ...sortedOutcomes]
  // check that market invalid is in list
  if (allDisputedOutcomes.find(o => o.id === invalidMarketId)) return allDisputedOutcomes

  return [...allDisputedOutcomes, invalidOutcome]
}

const getInvalidOutcome = (filteredOutcomes, addDefaultStakeOutcomes, invalidMarketId) => {
  const invalidOutcome = filteredOutcomes.find(o => o.id === invalidMarketId)
  if (invalidOutcome) return invalidOutcome
  return addDefaultStakeOutcomes.find(o => o.id === invalidMarketId)
}

const sortOutcomes = (a, b) => {
  const first = createBigNumber(a.stakeRemaining || 0, 10)
  const second = createBigNumber(b.stakeRemaining || 0, 10)
  return first.minus(second)
}

const fillInOutcomes = (collection, outcome) => {
  const index = collection.map(e => e.id).indexOf(outcome.id.toString())
  if (index === -1) {
    return [...collection, outcome]
  }
  collection[index] = outcome
  return collection
}

const populateFromOutcome = (marketType, outcomes, market, stake, newOutcomeDisputeBond, forkThreshold) => {
  if (!stake || !stake.payout) return {}
  if (stake.payout.length === 0) return {}

  const potentialFork = !stake.tentativeWinning && createBigNumber(stake.bondSizeCurrent || newOutcomeDisputeBond, 10).gt(forkThreshold)

  let outcome
  if (stake.isInvalid) {
    // '0.5' is the indetermine/invalid id from reportable outcomes
    outcome = outcomes.find(outcome => outcome.id === '0.5')
    return { ...outcome, ...stake, potentialFork }
  }

  stake.id = calculatePayoutNumeratorsValue(market, stake.payout, stake.isInvalid).toString()
  outcome = outcomes.find(outcome => outcome.id === stake.id)

  if (marketType === SCALAR) stake.name = stake.id

  // TODO: verify that switching is the best way
  return { ...outcome, ...stake, potentialFork }
}
