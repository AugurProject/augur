import { constants } from 'services/augurjs';
import speedomatic from 'speedomatic';

export const isAlmostZero = n => speedomatic.bignum(n).abs().lte(constants.PRECISION.zero);

export const isZero = n => speedomatic.bignum(n).eq(constants.ZERO);
