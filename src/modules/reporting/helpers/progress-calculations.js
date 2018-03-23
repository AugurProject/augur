import { formatAttoRep } from 'utils/format-number'
import BigNumber from 'bignumber.js'
import { augur } from 'services/augurjs'


const ONE = new BigNumber(1)
const ONE_HUNDRED = new BigNumber(100)

// Percentages are ALWAYS in number range so results are returned as number
export const calculatePercentage = (numSize, numTotalStake) => {
  if (numSize === null || numTotalStake === null) return 0
  if (typeof numSize === 'undefined' || typeof numTotalStake === 'undefined') return 0

  // NB: Remove whence paramaters are converted outside
  const size = new BigNumber(numSize, 10)
  const totalStake = new BigNumber(numTotalStake, 10)
  // NB: Remove whence paramaters are converted outside

  if (size.isEqualTo(0)) return 0
  if (size.lt(0) || totalStake.lt(0)) return 0
  if (totalStake.isEqualTo(0)) return 0

  const ratio = size.minus(totalStake).dividedBy(size)
  return (ONE.minus(ratio).times(ONE_HUNDRED)).integerValue().toNumber()
}

export const calculateNonAccountPercentage = (size, numStakeCurrent, numAccountStakeCurrent) => {
  // NB: Remove whence paramaters are converted outside
  const stakeCurrent = new BigNumber(numStakeCurrent, 10)
  const accountStakeCurrent = new BigNumber(numAccountStakeCurrent, 10)
  // NB: Remove whence paramaters are converted outside

  return calculatePercentage(size, stakeCurrent.minus(accountStakeCurrent))
}

export const calculateAddedStakePercentage = (size, numAccountStake, numAddedStake) => {
  // NB: Remove whence paramaters are converted outside
  const accountStake = new BigNumber(numAccountStake, 10)
  const addedStake = new BigNumber(numAddedStake, 10)
  // NB: Remove whence paramaters are converted outside

  return calculatePercentage(size, accountStake.plus(convertRepToAttoRep(addedStake)))
}

export const calculateTentativeRemainingRep = (size, numTotalStake, numTentativeStake) => {
  // NB: Remove whence paramaters are converted outside
  const totalStake = new BigNumber(numTotalStake, 10)
  const tentativeStake = new BigNumber(numTentativeStake, 10)
  // NB: Remove whence paramaters are converted outside

  const result = calculateRemainingValue(new BigNumber(size), totalStake.plus(convertRepToAttoRep(tentativeStake))).toNumber()
  if (result < 0) return '0'

  return formatAttoRep(result, { decimals: 4, denomination: ' REP' }).formatted
}

const calculateRemainingValue = (total, portion) => total.minus(portion)

const convertRepToAttoRep = (num) => {
  if (!num || num.isEqualTo(0)) return augur.constants.ZERO
  return num.times(augur.rpc.constants.ETHER)
}

