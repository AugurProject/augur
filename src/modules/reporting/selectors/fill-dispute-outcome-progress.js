import { calculateNonAccountPercentage, calculatePercentage } from 'modules/reporting/helpers/progress-calculations'

export default function (disputeBond, outcome) {
  if (!outcome) return
  outcome.percentageComplete = 0
  outcome.percentageAccount = 0

  const {
    bondSizeCurrent,
    stakeCurrent,
    accountStakeCurrent,
    tentativeWinning,
  } = outcome

  if (tentativeWinning) return outcome

  outcome.percentageComplete = calculateNonAccountPercentage(bondSizeCurrent, stakeCurrent || 0, accountStakeCurrent || 0)
  outcome.percentageAccount = calculatePercentage(bondSizeCurrent, accountStakeCurrent || 0)
  return outcome
}
