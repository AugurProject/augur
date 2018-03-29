import { BigNumber } from 'utils/wrapped-big-number'
import { constants } from 'services/augurjs'

export const isAlmostZero = n => new BigNumber(n, 10).abs().lte(constants.PRECISION.zero)

export const isZero = n => new BigNumber(n, 10).eq(constants.ZERO)
