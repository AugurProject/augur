import { createBigNumber } from 'utils/create-big-number'
import { constants } from 'services/augurjs'

export const isAlmostZero = n => createBigNumber(n, 10).abs().lte(constants.PRECISION.zero)

export const isZero = n => createBigNumber(n, 10).eq(constants.ZERO)
