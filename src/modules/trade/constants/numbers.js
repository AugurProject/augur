import { BigNumber } from 'utils/wrapped-big-number'

export const ZERO = new BigNumber(0)
export const ONE = new BigNumber(1, 10)
export const TWO = new BigNumber(2, 10)
export const TEN = new BigNumber(10, 10)
export const TEN_TO_THE_EIGHTEENTH_POWER = TEN.exponentiatedBy(18)
