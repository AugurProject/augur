import { createBigNumber } from 'utils/create-big-number'

export const ZERO = createBigNumber(0)
export const ONE = createBigNumber(1, 10)
export const TWO = createBigNumber(2, 10)
export const TEN = createBigNumber(10, 10)
export const TEN_TO_THE_EIGHTEENTH_POWER = TEN.exponentiatedBy(18)
