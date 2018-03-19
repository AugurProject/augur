import { SCALAR } from 'modules/markets/constants/market-types'
import calculatePayoutNumeratorsValue from 'utils/calculate-payout-numerators-value'
import { isEmpty } from 'lodash'
import BigNumber from 'bignumber.js'

export default function (market, disputeStakes, newOutcomeDisputeBond) {
  if (isEmpty(disputeStakes)) return market.reportableOutcomes
  const { marketType, reportableOutcomes } = market
  const outcomes = reportableOutcomes.slice()
  const defaultStake = {
    stakeCurrent: '0',
    accountStakeCurrent: '0',
    accountStakeCompleted: '0',
    bondSizeCurrent: newOutcomeDisputeBond,
    stakeCompleted: '0',
    stakeRemaining: newOutcomeDisputeBond,
    tentativeWinning: false,
  }
  const addDefaultStakeOutcomes = outcomes.reduce((p, o) => {
    const result = [...p, Object.assign(o, defaultStake)]
    return result
  }, [])

  const disputeOutcomes = disputeStakes.map(stake => populateFromOutcome(marketType, addDefaultStakeOutcomes, market, stake, newOutcomeDisputeBond))
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
    .sort((a, b) => sortOutcomes(a, b)).slice(0, 8)
  return [tentativeWinner, ...filteredOutcomes]
}

const sortOutcomes = (a, b) => {
  const stakeSort = new BigNumber(a.stakeRemaining).gt(new BigNumber(b.stakeRemaining))
  const currentSort = new BigNumber(a.stakeCurrent).lt(new BigNumber(b.stakeCurrent))
  if (stakeSort) return 1
  if (!stakeSort && currentSort) return 1
  if (!stakeSort) return -1
}
const fillInOutcomes = (collection, outcome) => {
  const index = collection.map(e => e.id).indexOf(outcome.id.toString())
  if (index === -1) {
    return [...collection, outcome]
  }
  collection[index] = outcome
  return collection
}

const populateFromOutcome = (marketType, outcomes, market, stake, newOutcomeDisputeBond) => {
  if (!stake || !stake.payout) return {}
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

  // TODO: verify that switching is the best way
  return { ...outcome, ...stake }
}
