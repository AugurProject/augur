import { tickSizeToNumTickWithDisplayPrices } from '@augurproject/sdk';
import {
  convertDisplayAmountToOnChainAmount,
  convertOnChainAmountToDisplayAmount,
  encodeNumberAsBase10String,
  encodeNumberAsJSNumber,
  unfix,
} from '@augurproject/sdk-lite';
import {
  ETHER,
  GWEI_CONVERSION,
  SCALAR,
  TEN,
  ZERO,
  CASH_LABEL_FORMATS,
  THOUSAND,
  MILLION,
  BILLION,
  TRILLION,
} from './constants';
import addCommas from './add-commas-to-number';
import getPrecision from './get-number-precision';
import { FormattedNumber, FormattedNumberOptions } from './types';
import { BigNumber, createBigNumber } from './create-big-number';

type NumStrBigNumber = number | BigNumber | string;

export const ETHER_NUMBER_OF_DECIMALS = 4;
export const SHARES_SCALAR_NUMBER_OF_DECIMALS = 4;
export const SHARES_NUMBER_OF_DECIMALS = 0;

const SMALLEST_NUMBER_DECIMAL_PLACES = 8;
const USUAL_NUMBER_DECIMAL_PLACES = 4;
const YES_NO_TICK_SIZE = createBigNumber("0.001");

export const getCashFormat = (cashName: string) => {
  let out = {
    prepend: true,
    symbol: '',
    displayDecimals: USUAL_NUMBER_DECIMAL_PLACES,
    icon: null,
  };
  if (CASH_LABEL_FORMATS[cashName]?.symbol) {
    out = CASH_LABEL_FORMATS[cashName];
  }
  return out;
}

export function formatCash(num: NumStrBigNumber, cashName: string, opts: FormattedNumberOptions = {}): FormattedNumber {
  const { prepend, symbol, displayDecimals } = getCashFormat(cashName);
  return formatNumber(num, {
    decimals: displayDecimals,
    decimalsRounded: displayDecimals,
    denomination: v => prepend ? `${symbol}${v}` : `${v} ${symbol}`,
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatSimpleShares(num: NumStrBigNumber, opts: FormattedNumberOptions = {}): FormattedNumber {
  return formatNumber(num, {
    decimals: USUAL_NUMBER_DECIMAL_PLACES,
    decimalsRounded: USUAL_NUMBER_DECIMAL_PLACES,
    denomination: v => `${v}`,
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  })
}

export function formatCashPrice(num: NumStrBigNumber, cashName: string, opts: FormattedNumberOptions = {}): FormattedNumber {
  const { prepend, symbol } = getCashFormat(cashName);
  return formatNumber(num, {
    decimals: 2,
    decimalsRounded: 2,
    denomination: v => prepend ? `${symbol}${v}` : `${v} ${symbol}`,
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatEther(
  num: NumStrBigNumber,
  opts: FormattedNumberOptions = {}
): FormattedNumber {
  return formatNumber(num, {
    decimals: ETHER_NUMBER_OF_DECIMALS,
    decimalsRounded: ETHER_NUMBER_OF_DECIMALS,
    denomination: v => `${v} ETH`,
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatEtherEstimate(
  num: NumStrBigNumber,
  opts: FormattedNumberOptions = {}
): FormattedNumber {
  return formatNumber(num, {
    decimals: ETHER_NUMBER_OF_DECIMALS,
    decimalsRounded: ETHER_NUMBER_OF_DECIMALS,
    denomination: v => `${v} ETH (estimated)`,
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatPercent(
  num: NumStrBigNumber,
  opts: FormattedNumberOptions = {}
): FormattedNumber {
  return formatNumber(num, {
    decimals: 2,
    decimalsRounded: 0,
    denomination: v => `${v}%`,
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatFractional(
  num: NumStrBigNumber,
  opts: FormattedNumberOptions = {}
): FormattedNumber {
  return formatNumber(num, {
    decimals: 4,
    decimalsRounded: 0,
    denomination: v => `${v}/1`,
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatShares(
  num: NumStrBigNumber,
  opts: FormattedNumberOptions = {}
): FormattedNumber {
  const formattedShares = formatNumber(num, {
    decimals: SHARES_NUMBER_OF_DECIMALS,
    decimalsRounded: SHARES_NUMBER_OF_DECIMALS,
    denomination: v => `${v}`,
    minimized: false,
    zeroStyled: false,
    blankZero: false,
    roundDown: true,
    bigUnitPostfix: true,
    ...opts,
  });

  return formattedShares;
}

export function formatMarketShares(
  marketType: string,
  num: NumStrBigNumber,
  opts: FormattedNumberOptions = {}
): FormattedNumber {
  let decimals = SHARES_NUMBER_OF_DECIMALS
  if (marketType === SCALAR) {
    decimals = SHARES_SCALAR_NUMBER_OF_DECIMALS;
  }
  const formattedShares = formatNumber(num, {
    decimals: decimals,
    decimalsRounded: decimals,
    denomination: v => `${v} Shares`,
    minimized: false,
    zeroStyled: false,
    blankZero: false,
    roundDown: true,
    bigUnitPostfix: true,
    ...opts,
  });

  return formattedShares;
}

export function formatBestPrice(
  num: NumStrBigNumber,
  tickSize: number,
  opts: FormattedNumberOptions = {}
): FormattedNumber {
  let decimals = 0;
  if (String(tickSize).indexOf('.') >= 0) {
    decimals = String(tickSize).split(".")[1].length;
  }
  return formatNumber(num, {
    decimals,
    decimalsRounded: decimals,
    denomination: v => {
      const isNegative = Number(v) < 0;
      const formattedNegative = createBigNumber(createBigNumber(v).toFixed(2)).lt(0);
      const val = isNegative
        ? createBigNumber(v)
          .abs()
          .toFixed(2)
        : v;
      return `${formattedNegative ? '-' : ''}${val}`;
    },
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatSimplePrice(
  num: NumStrBigNumber,
): FormattedNumber {
  return formatDai(num, {
    decimals: 2,
    decimalsRounded: 2,
  });
}

export function formatDai(
  num: NumStrBigNumber,
  opts: FormattedNumberOptions = {}
): FormattedNumber {
  return formatNumber(num, {
    decimals: 2,
    decimalsRounded: 2,
    denomination: v => {
      const isNegative = Number(v) < 0;
      const val = isNegative
        ? createBigNumber(v)
          .abs()
          .toFixed(2)
        : v;
      return `${isNegative ? '-$' : '$'}${val}`;
    },
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatRep(
  num: NumStrBigNumber,
  opts: FormattedNumberOptions = {}
): FormattedNumber {
  return formatNumber(num, {
    decimals: 4,
    decimalsRounded: 4,
    denomination: v => `${v} REPv2`,
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatRepTokens(
  num: NumStrBigNumber,
  opts: FormattedNumberOptions = {}
): FormattedNumber {
  return formatNumber(num, {
    decimals: 2,
    decimalsRounded: 2,
    denomination: v => `${v} REPv2 Tokens`,
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatNone(): FormattedNumber {
  return {
    value: 0,
    formattedValue: 0,
    formatted: '-',
    roundedValue: 0,
    rounded: '-',
    roundedFormatted: '-',
    minimized: '-',
    denomination: '',
    full: '-',
    fullPrecision: '0',
    percent: 0,
  };
}

export function formatBlank(): FormattedNumber {
  return {
    value: 0,
    formattedValue: 0,
    formatted: '',
    roundedValue: 0,
    rounded: '',
    roundedFormatted: '',
    minimized: '',
    denomination: '',
    full: '',
    fullPrecision: '0',
    percent: 0,
  };
}

export function optionsBlank(): FormattedNumberOptions {
  return {
    decimals: 0,
    decimalsRounded: 0,
    denomination: v => `${v}`,
    roundUp: false,
    roundDown: false,
    positiveSign: false,
    zeroStyled: true,
    minimized: false,
    blankZero: false,
    bigUnitPostfix: false,
    precisionFullLabel: false,
  };
}
export function sumAndformatGasCostToEther(
  gases: NumStrBigNumber[],
  opts: FormattedNumberOptions = optionsBlank(),
  gasPrice: NumStrBigNumber
): string {
  const summedGas = gases.reduce(
    (p, g) => createBigNumber(unfix(g, 'number')).plus(p),
    ZERO
  );

  const estimatedGasCost = createBigNumber(summedGas).times(
    createBigNumber(gasPrice)
  );

  return formatGasCost(estimatedGasCost, opts).formatted;
}

export function formatGasCostToEther(
  num: NumStrBigNumber,
  opts: FormattedNumberOptions = optionsBlank(),
  gasPrice: NumStrBigNumber
): string {
  return sumAndformatGasCostToEther([num], opts, gasPrice);
}

export function formatAttoRep(
  num: NumStrBigNumber,
  opts: FormattedNumberOptions = {}
): FormattedNumber {
  if (!num) return formatBlank();
  return formatNumber(
    createBigNumber(num.toString())
      .dividedBy(ETHER),
    {
      decimals: 4,
      decimalsRounded: 4,
      blankZero: false,
      roundDown: true,
      denomination: v => `${v} REPv2`,
      ...opts,
    }
  );
}

export function formatAttoDai(num: NumStrBigNumber, optsInc: FormattedNumberOptions = optionsBlank()): FormattedNumber {
  const opts = Object.assign(optionsBlank(), {
    decimals: 2,
    decimalsRounded: 2,
    ...optsInc,
    denomination: v => {
      const isNegative = Number(v) < 0;
      const val = isNegative
        ? createBigNumber(v)
          .abs()
          .toFixed(2)
        : v;
      return `${isNegative ? '-' : ''}$${val}`;
    },
  });
  return formatAttoEth(num, opts);
}

// At some point potentially refactor all this to be more generic (e.g formatAttoAmount)
export function formatAttoEth(
  num: NumStrBigNumber,
  opts: FormattedNumberOptions = optionsBlank()
): FormattedNumber {
  if (!num) return formatBlank();
  return formatNumber(
    createBigNumber(num.toString())
      .dividedBy(ETHER)
      .toNumber(),
    {
      decimals: ETHER_NUMBER_OF_DECIMALS,
      decimalsRounded: ETHER_NUMBER_OF_DECIMALS,
      blankZero: false,
      ...opts,
    }
  );
}

export function formatGasCost(
  num: NumStrBigNumber,
  opts: FormattedNumberOptions
): FormattedNumber {
  return formatNumber(num, {
    decimals: 0,
    decimalsRounded: 0,
    denomination: v => `${v} WEI`,
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatGasCostGwei(
  num: NumStrBigNumber,
  opts: FormattedNumberOptions
): FormattedNumber {
  const inGwei = (gasPrice) => {
    return createBigNumber(gasPrice).dividedBy(
      createBigNumber(GWEI_CONVERSION)
    );
  }

  return formatNumber(inGwei(num), {
    decimals: 0,
    decimalsRounded: 0,
    denomination: v => `${v} GWEI`,
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatAmerican(
  num: NumStrBigNumber,
  opts: FormattedNumberOptions = optionsBlank()
): FormattedNumber {
  const value = createBigNumber(num, 10).decimalPlaces(4);
  const processedNum = formatNumber(value, { ...opts, positiveSign: true });
  processedNum.fullPrecision = createBigNumber(num, 10).toFixed();
  return processedNum;
}

export function formatNumber(
  num: NumStrBigNumber,
  opts: FormattedNumberOptions = optionsBlank()
): FormattedNumber {
  const value = num != null ? createBigNumber(num, 10) : ZERO;
  const { minimized, bigUnitPostfix } = opts;
  const o: FormattedNumber = formatBlank();
  let {
    decimals,
    decimalsRounded,
    denomination,
    roundUp,
    roundDown,
    positiveSign,
    zeroStyled,
    blankZero,
    removeComma = false,
    precisionFullLabel = false,
  } = opts;

  decimals = decimals || 0;
  decimalsRounded = decimalsRounded || 0;
  denomination = denomination || (v => `${v}`);
  positiveSign = !!positiveSign;
  roundUp = !!roundUp;
  roundDown = !!roundDown;
  zeroStyled = zeroStyled !== false;
  blankZero = blankZero !== false;

  if (value.eq(ZERO)) {
    if (zeroStyled) return formatNone();
    if (blankZero) return formatBlank();
  }

  const decimalsValue = TEN.exponentiatedBy(decimals);
  const decimalsRoundedValue = TEN.exponentiatedBy(decimalsRounded);

  let roundingMode;
  if (roundDown) {
    roundingMode = BigNumber.ROUND_DOWN;
  } else if (roundUp) {
    roundingMode = BigNumber.ROUND_UP;
  } else {
    roundingMode = BigNumber.ROUND_HALF_EVEN;
  }
  let formatSigFig = false;
  if (typeof num === 'string' && isNaN(parseFloat(num))) {
    o.value = 0;
    o.formattedValue = 0;
    o.formatted = '0';
    o.roundedValue = '0';
    o.rounded = 0;
    o.roundedFormatted = '0';
    o.minimized = '0';
    o.fullPrecision = '0';
  } else {
    const useSignificantFiguresThreshold = TEN.exponentiatedBy(
      new BigNumber(decimals, 10)
        .minus(1)
        .negated()
        .toNumber()
    );
    const roundToZeroThreshold = ZERO;
    o.value = value.toNumber();
    if (value.abs().lt(roundToZeroThreshold)) {
      // value is less than zero
      o.formattedValue = '0';
    } else if (value.abs().lt(useSignificantFiguresThreshold)) {
      if (!decimals) {
        o.formattedValue = String(value);
      } else {
        formatSigFig = true;
        o.formattedValue = value.toPrecision(decimals, roundingMode);
      }
    } else {
      o.formattedValue = value
        .times(decimalsValue)
        .integerValue(roundingMode)
        .dividedBy(decimalsValue)
        .toFixed(decimals);
    }

    const zeroFixed = ZERO.toFixed(USUAL_NUMBER_DECIMAL_PLACES);

    if (bigUnitPostfix && !formatSigFig) {
      o.formatted = addBigUnitPostfix(value, o.formattedValue, removeComma);
    } else if (formatSigFig) {
      // for numbers smaller than the set number of decimals - ie ones with scientific notation
      let formatted = value.toFixed(decimals || USUAL_NUMBER_DECIMAL_PLACES);

      if (formatted === zeroFixed || formatted === '-' + zeroFixed) {
        // if this is equal to zero, try to show significant digits up to 8 digit places
        formatted = value.toFixed(SMALLEST_NUMBER_DECIMAL_PLACES);
        if (
          formatted === ZERO.toFixed(SMALLEST_NUMBER_DECIMAL_PLACES) ||
          formatted === '-' + ZERO.toFixed(SMALLEST_NUMBER_DECIMAL_PLACES)
        ) {
          formatted = zeroFixed; // if there are no significant digits in the 8 decimal places, just use zero
        } else {
          formatted = value.toFixed(
            1 - Math.floor(Math.log(value.abs().toNumber()) / Math.log(10))
          ); // find first two significant digit
        }
      }
      o.formatted = formatted;
    } else {
      o.formatted = addCommas(o.formattedValue, removeComma);
    }
    o.fullPrecision = value.toFixed();
    o.roundedValue = value
      .times(decimalsRoundedValue)
      .integerValue(roundingMode)
      .dividedBy(decimalsRoundedValue).toNumber();
    o.roundedFormatted = bigUnitPostfix
      ? addBigUnitPostfix(value, o.roundedValue.toFixed(decimalsRounded), removeComma)
      : addCommas(o.roundedValue.toFixed(decimalsRounded), removeComma);
    o.minimized = addCommas(encodeNumberAsBase10String(o.formattedValue), removeComma);
    o.rounded = encodeNumberAsBase10String(o.roundedValue);
    o.formattedValue = encodeNumberAsJSNumber(o.formattedValue, false);
  }

  if (positiveSign && !bigUnitPostfix) {
    if (o.formattedValue && o.formattedValue > 0) {
      o.formatted = `+${o.formatted}`;
      o.minimized = `+${o.minimized}`;
    }
    if (o.roundedValue >= 0) {
      o.rounded = `+${o.rounded}`;
    }
  }

  if (minimized) {
    o.formatted = o.minimized;
  }

  o.denomination = denomination('');
  o.full = precisionFullLabel ? denomination(createBigNumber(o.formatted).toPrecision()) : denomination(o.formatted);

  if (
    (typeof num === 'string' && isNaN(parseFloat(num))) ||
    o.formatted === '0'
  ) {
    o.formatted = ZERO.toFixed(decimalsRounded);
  }
  return o;
}

function addBigUnitPostfix(value, formattedValue, removeComma = false) {
  let postfixed;
  if (value.gt(TRILLION)) {
    postfixed = '> 1T';
  } else if (value.gt(BILLION)) {
    postfixed =
      addCommas(`${value.dividedBy(BILLION).toFixed(2)}B`, removeComma);
  } else if (value.gt(MILLION)) {
    postfixed =
      addCommas(`${value.dividedBy(MILLION).toFixed(2)}M`, removeComma);
  } else if (value.gt(THOUSAND.times(TEN))) {
    postfixed = addCommas(`${value.dividedBy(THOUSAND).toFixed(2)}K`, removeComma);
  } else {
    postfixed = addCommas(formattedValue, removeComma);
  }
  return postfixed;
}

export function cutOffDecimal(value, numDigits) {
  const decimals = (value + '').split('.');
  if (decimals[1] && decimals[1].length > numDigits) {
    return decimals[0] + '.' + decimals[1].substring(0, numDigits);
  }
  return value;
}

export function calcPriceFromPercentage(
  percentage: string,
  minPrice: string,
  maxPrice: string,
  tickSize: number
): number {
  if (percentage === undefined || percentage === null) return Number(0);
  const numTicks = tickSizeToNumTickWithDisplayPrices(
    createBigNumber(tickSize),
    createBigNumber(minPrice),
    createBigNumber(maxPrice)
  );
  const bnMinPrice = createBigNumber(minPrice);
  const bnMaxPrice = createBigNumber(maxPrice);
  const percentNumTicks = createBigNumber(numTicks).times(
    createBigNumber(percentage).dividedBy(100)
  );
  if (percentNumTicks.lt(tickSize)) {
    return bnMinPrice.plus(tickSize).toNumber();
  }
  const calcPrice = percentNumTicks.times(tickSize).plus(bnMinPrice);
  if (calcPrice.eq(maxPrice)) {
    return bnMaxPrice.minus(tickSize).toNumber();
  }
  const correctDec = formatBestPrice(calcPrice, tickSize);
  const precision = getPrecision(tickSize, 0);
  const value = createBigNumber(correctDec.fullPrecision).toFixed(precision);
  return Number(value);
}

export function calcPercentageFromPrice(
  price: string,
  minPrice: string,
  maxPrice: string,
): number {
  if (price === undefined || price === null) return Number(minPrice);
  const bnMinPrice = createBigNumber(minPrice);
  const bnMaxPrice = createBigNumber(maxPrice);
  const bnPrice = createBigNumber(price);
  if (bnPrice.lt(bnMinPrice)) return 0;
  if (bnPrice.gt(bnMaxPrice)) return 100;
  const bnPriceRange = bnMaxPrice.minus(bnMinPrice);
  const bnNormalizedPrice = bnPrice.minus(bnMinPrice);
  const percentage = bnNormalizedPrice.dividedBy(bnPriceRange).times(100);
  return Number(percentage.toFixed(2));
}

export function convertOnChainSharesToDisplayShareAmount(
  onChainAmount: NumStrBigNumber,
  precision: NumStrBigNumber,
): BigNumber {
  return convertOnChainAmountToDisplayAmount(createBigNumber(onChainAmount), YES_NO_TICK_SIZE, createBigNumber(10).pow(createBigNumber(precision)));
}

export function convertDisplayShareAmountToOnChainShareAmount(displayAmount: NumStrBigNumber, precision: NumStrBigNumber): BigNumber {
  return convertDisplayAmountToOnChainAmount(createBigNumber(displayAmount), YES_NO_TICK_SIZE, createBigNumber(10).pow(createBigNumber(precision)));
}

export function convertOnChainCashAmountToDisplayCashAmount(
  onChainAmount: NumStrBigNumber,
  precision: NumStrBigNumber,
) {
  return createBigNumber(onChainAmount).dividedBy(createBigNumber(10).pow(createBigNumber(precision)));
}

export function convertDisplayCashAmountToOnChainCashAmount(
  onChainAmount: NumStrBigNumber,
  precision: NumStrBigNumber,
): BigNumber {
  return createBigNumber(onChainAmount).times(createBigNumber(10).pow(createBigNumber(precision)));
}

export const isSameAddress = (address1: string, address2: string) =>
  address1 && address2 && address1.toLowerCase() === address2.toLowerCase();
