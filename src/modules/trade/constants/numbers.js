import { WrappedBigNumber } from 'utils/wrapped-big-number'

export const ZERO = WrappedBigNumber(0)
export const ONE = WrappedBigNumber(1, 10)
export const TWO = WrappedBigNumber(2, 10)
export const TEN = WrappedBigNumber(10, 10)
export const TEN_TO_THE_EIGHTEENTH_POWER = TEN.exponentiatedBy(18)
