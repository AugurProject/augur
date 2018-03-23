import { formatAttoRep } from 'utils/format-number'
import BigNumber from 'bignumber.js'
import { augur } from 'services/augurjs'


const ONE = new BigNumber(1);
const ONE_HUNDRED = new BigNumber(100);

// Percentages are ALWAYS in number range so results are returned as number
export const calculatePercentage = (size, totalStake) => {
  if (size === null || totalStake === null) return 0
  if (typeof size === 'undefined' || typeof totalStake === 'undefined') return 0

  // NB: Remove whence paramaters are converted outside
  size = new BigNumber(size, 10);
  totalStake = new BigNumber(totalStake, 10);
  // NB: Remove whence paramaters are converted outside

  if (size.isEqualTo(0)) return 0
  if (size.lt(0) || totalStake.lt(0)) return 0
  if (totalStake.isEqualTo(0)) return 0

  const ratio = size.minus(totalStake).dividedBy(size)
  return (ONE.minus(ratio).times(ONE_HUNDRED)).integerValue().toNumber()
}

export const calculateNonAccountPercentage = (size, stakeCurrent, accountStakeCurrent) => {
  // NB: Remove whence paramaters are converted outside
  stakeCurrent = new BigNumber(stakeCurrent, 10);
  accountStakeCurrent = new BigNumber(accountStakeCurrent, 10);
  // NB: Remove whence paramaters are converted outside

  return calculatePercentage(size, stakeCurrent.minus(accountStakeCurrent))
}

export const calculateAddedStakePercentage = (size, accountStake, addedStake) => {
  // NB: Remove whence paramaters are converted outside
  accountStake = new BigNumber(accountStake, 10);
  addedStake = new BigNumber(addedStake, 10);
  // NB: Remove whence paramaters are converted outside

  return calculatePercentage(size, accountStake.plus(convertRepToAttoRep(addedStake)))
}

export const calculateTentativeRemainingRep = (size, totalStake, tentativeStake) => {
  // NB: Remove whence paramaters are converted outside
  totalStake = new BigNumber(totalStake, 10);
  tentativeStake = new BigNumber(tentativeStake, 10);
  // NB: Remove whence paramaters are converted outside

  const result = calculateRemainingValue(size, totalStake.plus(convertRepToAttoRep(tentativeStake))).toNumber();
  if (result < 0) return '0'

  return formatAttoRep(result, { decimals: 4, denomination: ' REP' }).formatted
}

const calculateRemainingValue = (total, portion) => {
  return total.minus(portion);
}

const convertRepToAttoRep = (num) => {
  if (!num || num.isEqualTo(0) ) return augur.constants.ZERO
  return num.times(augur.rpc.constants.ETHER)
}

