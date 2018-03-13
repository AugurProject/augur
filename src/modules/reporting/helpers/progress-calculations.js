import { formatAttoRep } from 'utils/format-number'
import BigNumber from 'bignumber.js'
import { augur } from 'services/augurjs'

export const calculatePercentage = (size, totalStake) => {
  if (size === 0) throw Error('Can not divide by 0')
  if (size === null || totalStake === null) throw Error('Can not use null values')
  if (isNaN(size) || isNaN(totalStake)) throw Error('Can not use NaN for calculations')
  if (size < 0 || totalStake < 0) throw Error('Can not have negative percentage')
  const BNSize = new BigNumber(size)
  const BNtotalStake = new BigNumber(totalStake)
  const ratio = BNSize.minus(BNtotalStake).dividedBy(BNSize)
  return Math.round(new BigNumber(1).minus(ratio).times(new BigNumber(100)).toNumber())
}

export const calculateRemainingRep = (size, totalStake) => {
  const remaining = calculateRemainingValue(size, totalStake)
  return formatAttoRep(remaining, { decimals: 4, denomination: ' REP' }).formatted
}

export const calculateTentativeStakePercentage = (size, totalStake, tentativeStake) => {
  const attoRep = convertRepToAttoRep(tentativeStake)
  const result = calculatePercentage(size, new BigNumber(totalStake).plus(new BigNumber(attoRep)).toNumber())
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
  const result = new BigNumber(num).mul(ETHER).toNumber()
  return result
}

