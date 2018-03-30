import { WrappedBigNumber } from 'utils/wrapped-big-number'
import { constants } from 'services/augurjs'

export const isAlmostZero = n => WrappedBigNumber(n, 10).abs().lte(constants.PRECISION.zero)

export const isZero = n => WrappedBigNumber(n, 10).eq(constants.ZERO)
