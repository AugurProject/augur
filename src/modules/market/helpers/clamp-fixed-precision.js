import { clamp } from 'lodash/fp'
import { LOWER_FIXED_PRECISION_BOUND, UPPER_FIXED_PRECISION_BOUND } from 'src/modules/market/constants'

export const precisionClampFunction = clamp(UPPER_FIXED_PRECISION_BOUND, LOWER_FIXED_PRECISION_BOUND)
