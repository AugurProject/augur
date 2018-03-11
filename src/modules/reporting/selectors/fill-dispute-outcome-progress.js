import { formatAttoRep } from 'utils/format-number'
import BigNumber from 'bignumber.js'

export default function (disputeBond, outcome) {
  const format = { decimals: 4, denomination: ' REP' }
  if (!outcome) return
  outcome.remainingRep = 0
  outcome.percentageComplete = 0
  outcome.accountPercentage = 0

  // past dispute no progress, set size and remaining
  if (outcome.size && outcome.size !== disputeBond) {
    outcome.size = disputeBond
    outcome.remainingRep = calculateRemainingRep(new BigNumber(disputeBond), 0, format)
    return outcome
  }

  // defaults if not present
  if (!outcome.size) outcome.size = disputeBond
  if (!outcome.currentStake) outcome.currentStake = 0
  if (!outcome.accountStakeComplete) outcome.accountStakeComplete = 0
  if (outcome.currentStake.toString() === '0') {
    outcome.remainingRep = calculateRemainingRep(new BigNumber(disputeBond), 0, format)
  }

  const { size, currentStake, accountStakeComplete } = outcome
  const BNSize = new BigNumber(size)
  const BNCurrentStake = new BigNumber(currentStake)

  const BNAccountStakeComplete = new BigNumber(accountStakeComplete)
  if (outcome.currentStake > 0) {
    outcome.percentageComplete = calculatePercentage(BNSize, BNCurrentStake)
    outcome.remainingRep = calculateRemainingRep(BNSize, BNCurrentStake, format)
  }

  if (accountStakeComplete > 0) outcome.accountPercentage = calculatePercentage(BNSize, BNAccountStakeComplete, format)
  return outcome
}

const calculatePercentage = (BNSize, BNCurrentStake) => {
  const ratio = BNSize.minus(BNCurrentStake).dividedBy(BNSize)
  return Math.round(new BigNumber(1).minus(ratio).times(new BigNumber(100)).toNumber())
}

const calculateRemainingRep = (BNSize, BNCurrentStake, format) => {
  const BNRemaining = BNSize.minus(BNCurrentStake)
  const remaining = formatAttoRep(BNRemaining.toNumber(), format)
  return remaining.formatted
}
