import { formatAttoRep } from 'utils/format-number'
import BigNumber from 'bignumber.js'
import { augur } from 'services/augurjs'

export const calculatePercentage = (size, totalStake) => {
  if (size === 0) return 0
  if (size === null || totalStake === null) return 0
  if (typeof size === "undefined" || typeof totalStake === "undefined") return 0
  const BNSize = new BigNumber(size)
  const BNtotalStake = new BigNumber(totalStake)
  if (BNSize.lt(0) || BNtotalStake.lt(0)) return 0
  if (BNtotalStake.isEqualTo(0)) return 0
  const ratio = BNSize.minus(BNtotalStake).dividedBy(BNSize)
  return (new BigNumber(1).minus(ratio).times(new BigNumber(100))).integerValue().toNumber()
}

export const calculateNonAccountPercentage = (size, stakeCurrent, accountStakeCurrent) => {
  const result = calculatePercentage(size, new BigNumber(stakeCurrent).minus(new BigNumber(accountStakeCurrent)))
  return result
}

export const calculateAddedStakePercentage = (size, accountStake, addedStake) => {
  const attoRep = convertRepToAttoRep(addedStake)
  const addedAccountStake = new BigNumber(accountStake).plus(new BigNumber(attoRep))
  const result = calculatePercentage(size, new BigNumber(addedAccountStake).toNumber())
  return result
}

export const calculateTentativeRemainingRep = (size, totalStake, tentativeStake) => {
  const attoRep = convertRepToAttoRep(tentativeStake)
  const result = calculateRemainingValue(size, new BigNumber(totalStake).plus(new BigNumber(attoRep)).toNumber())
  if (result <= 0) return '0'
  return formatAttoRep(result, { decimals: 4, denomination: ' REP' }).formatted
}

const calculateRemainingValue = (total, portion) => {
  const result = new BigNumber(total).minus(new BigNumber(portion)).toNumber()
  return result
}

const convertRepToAttoRep = (num) => {
  if (!num || num === 0 || isNaN(num)) return 0
  const { ETHER } = augur.rpc.constants
  const result = new BigNumber(num).times(ETHER).toNumber()
  return result
}

