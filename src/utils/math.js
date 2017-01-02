import { abi, constants } from '../services/augurjs';

export const isAlmostZero = n => abi.bignum(n).abs().lte(constants.PRECISION.zero);

export const isZero = n => abi.bignum(n).eq(constants.ZERO);
