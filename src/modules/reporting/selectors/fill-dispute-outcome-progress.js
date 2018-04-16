import { calculateNonAccountPercentage, calculatePercentage } from 'modules/reporting/helpers/progress-calculations'

export default function (disputeBond, outcome) {
  if (!outcome) return
  outcome.percentageComplete = 0
  outcome.percentageAccount = 0

  const {
    bondSizeTotal,
    accountStakeTotal,
    tentativeWinning,
  } = outcome

  if (tentativeWinning) return outcome

  outcome.percentageComplete = calculateNonAccountPercentage(disputeBond, bondSizeTotal || 0, accountStakeTotal || 0)
  outcome.percentageAccount = calculatePercentage(disputeBond, accountStakeTotal || 0)
  outcome.bondSizeOfNewStake = disputeBond
  return outcome
}
