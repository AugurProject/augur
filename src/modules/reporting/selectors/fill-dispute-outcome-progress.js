import { calculatePercentage, calculateRemainingRep } from 'modules/reporting/helpers/progress-calculations'

export default function (disputeBond, outcome) {
  if (!outcome) return
  outcome.remainingRep = 0
  outcome.percentageComplete = 0
  outcome.accountPercentage = 0

  // past dispute no progress, set size and remaining
  if (outcome.size && outcome.size !== disputeBond) {
    outcome.size = disputeBond
    outcome.remainingRep = calculateRemainingRep(disputeBond, 0)
    return outcome
  }

  // defaults if not present
  if (!outcome.size) outcome.size = disputeBond
  if (!outcome.currentStake) outcome.currentStake = 0
  if (!outcome.accountStakeComplete) outcome.accountStakeComplete = 0
  if (outcome.currentStake.toString() === '0') {
    outcome.remainingRep = calculateRemainingRep(disputeBond, 0)
  }

  const { size, currentStake, accountStakeComplete } = outcome

  if (outcome.currentStake > 0) {
    outcome.percentageComplete = calculatePercentage(size, currentStake)
    outcome.remainingRep = calculateRemainingRep(size, currentStake)
  }

  if (accountStakeComplete > 0) {
    outcome.accountPercentage = calculatePercentage(size, accountStakeComplete)
  }

  return outcome
}
