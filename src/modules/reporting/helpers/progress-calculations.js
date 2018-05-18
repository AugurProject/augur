import { formatAttoRep } from 'utils/format-number'
import { createBigNumber } from 'utils/create-big-number'
import { augur } from 'services/augurjs'


const ONE = createBigNumber(1)
const ONE_HUNDRED = createBigNumber(100)

// Percentages are ALWAYS in number range so results are returned as number
export const calculatePercentage = (numSize, numTotalStake) => {
  if (numSize === null || numTotalStake === null) return 0
  if (typeof numSize === 'undefined' || typeof numTotalStake === 'undefined') return 0

  // NB: Remove whence paramaters are converted outside
  const size = createBigNumber(numSize, 10)
  const totalStake = createBigNumber(numTotalStake, 10)
  // NB: Remove whence paramaters are converted outside

  if (size.isEqualTo(0)) return 0
  if (size.lt(0) || totalStake.lt(0)) return 0
  if (totalStake.isEqualTo(0)) return 0

  const ratio = size.minus(totalStake).dividedBy(size)
  const value = ONE.minus(ratio).times(ONE_HUNDRED).toFixed(4, 1)
  return createBigNumber(value).toNumber()
}

export const calculateNonAccountPercentage = (size, numStakeCurrent, numAccountStakeCurrent) => {
  // NB: Remove whence paramaters are converted outside
  const stakeCurrent = createBigNumber(numStakeCurrent, 10)
  const accountStakeCurrent = createBigNumber(numAccountStakeCurrent, 10)
  // NB: Remove whence paramaters are converted outside

  return calculatePercentage(size, stakeCurrent.minus(accountStakeCurrent))
}

export const calculateAddedStakePercentage = (size, numAccountStake, numAddedStake) => {
  // NB: Remove whence paramaters are converted outside
  const accountStake = createBigNumber(numAccountStake, 10)
  const addedStake = createBigNumber(numAddedStake, 10)
  // NB: Remove whence paramaters are converted outside

  return calculatePercentage(size, accountStake.plus(addedStake))
}

export const calculateTentativeCurrentRep = (numTotalStake, numTentativeStake) => {
  // NB: Remove whence paramaters are converted outside
  const totalStake = createBigNumber(numTotalStake, 10)
  const tentativeStake = createBigNumber(numTentativeStake, 10)
  // NB: Remove whence paramaters are converted outside

  const result = totalStake.plus(convertRepToAttoRep(tentativeStake)).toNumber()
  if (result < 0) return '0'

  return formatAttoRep(result, { decimals: 4, denomination: ' REP' }).formatted
}

const convertRepToAttoRep = (num) => {
  if (!num || num.isEqualTo(0)) return augur.constants.ZERO
  return num.times(augur.rpc.constants.ETHER)
}

