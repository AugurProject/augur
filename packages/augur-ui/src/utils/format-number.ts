import { BigNumber, createBigNumber } from "utils/create-big-number";
import {
  encodeNumberAsBase10String,
  encodeNumberAsJSNumber,
  unfix,
} from "speedomatic";
import { constants } from "services/constants";
import { ZERO, TEN, ETHER } from "modules/common-elements/constants";
import addCommas from "utils/add-commas-to-number";
import { FormattedNumber, FormattedNumberOptions } from "modules/types";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  Produces a formatted number object used for display and calculations
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

The main function is `formatNumber`, however there are top-level functions that wrap for common cases like `formatEther`, `formatShares`, etc.

A formatted number generally has three parts: the sign (+ or -), the stylized number, and a denomination (Eth, Rep, %, etc.)

The formatted number object that is returned looks something like this:
  {
    value: the parsed number in numerical form, 0 if a bad input was passed in, can be used in calculations

    formattedValue: the value in numerical form, possibly rounded, can be used in calculations
    formatted: the value in string form with possibly additional formatting, like comma separator, used for display

    o.roundedValue: the value in numerical form, with extra rounding, can be used in calculations
    o.rounded: the value in string form, with extra rounding
    o.roundedFormatted: the value in string form, with formatting, like comma separator, used for display

    o.minimized: the value in string form, with trailing 0 decimals omitted, for example if the `formatted` value is 1.00, this minimized value would be 1
  }

The reason the number object has multiple states of rounding simultaneously,
is because the ui can use it for multiple purposes. For example, when showing ether,
we generally like to show it with 2 decimals, however when used in totals,
maximum precision is not necessary, and we can opt to show the `rounded` display, which is only 1 decimal.
Similar logic applies for `minimized`, sometimes we don't need to be consistent with the decimals
and just show the prettiest, smallest representation of the value.

The options object that is passed into `formatNumber` that enables all of this looks like:
  {
    decimals: the number of decimals for the precise case, can be 0-infinity
    decimalsRounded: the number of decimals for the prettier case, can be 0-infinity
    denomination: the string denomination of the number (ex. Eth, Rep, %), can be blank
    positiveSign: boolean whether to include a plus sign at the beginning of positive numbers
    zeroStyled: boolean, if true, when the value is 0, it formates it as a dash (-) instead
  }

TIP
Sometimes (not always) it is a good idea to use the formatted values in calculations,
rather than the original input number, so that values match up in the ui. For example, if you are
adding the numbers 1.11 and 1.44, but displaying them as 1.1 and 1.4, it may look awkward
if 1.1 + 1.4 = 2.6. If perfect precision isn't necessary, consider adding them using the formatted values.

*/

export const ETHER_NUMBER_OF_DECIMALS = 4;
export const SHARES_NUMBER_OF_DECIMALS = 4;

const SMALLEST_NUMBER_DECIMAL_PLACES = 8;
const USUAL_NUMBER_DECIMAL_PLACES = 4;

export function formatEther(num: number, opts: FormattedNumberOptions = optionsBlank()): FormattedNumber {
  return formatNumber(num, {
    decimals: ETHER_NUMBER_OF_DECIMALS,
    decimalsRounded: ETHER_NUMBER_OF_DECIMALS,
    denomination: " ETH",
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatEtherEstimate(num, opts: FormattedNumberOptions = optionsBlank()): FormattedNumber {
  return formatNumber(num, {
    decimals: ETHER_NUMBER_OF_DECIMALS,
    decimalsRounded: ETHER_NUMBER_OF_DECIMALS,
    denomination: " ETH (estimated)",
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatPercent(num, opts: FormattedNumberOptions = optionsBlank()): FormattedNumber {
  return formatNumber(num, {
    decimals: 2,
    decimalsRounded: 0,
    denomination: "%",
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatShares(num, opts: FormattedNumberOptions = optionsBlank()): FormattedNumber {
  const formattedShares = formatNumber(num, {
    decimals: SHARES_NUMBER_OF_DECIMALS,
    decimalsRounded: SHARES_NUMBER_OF_DECIMALS,
    denomination: ` Share${encodeNumberAsJSNumber(num, false) !== 1 ? "s" : ""}`,
    minimized: false,
    zeroStyled: false,
    blankZero: false,
    roundDown: true,
    bigUnitPostfix: true,
    ...opts,
  });

  if (formattedShares.formattedValue === 1) {
    formattedShares.full = makeFull(formattedShares.formatted, " Share");
  }

  return formattedShares;
}

export function formatDai(num, opts: FormattedNumberOptions = optionsBlank()): FormattedNumber {
  return formatNumber(num, {
    decimals: 2,
    decimalsRounded: 2,
    denomination: " DAI",
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatRep(num, opts: FormattedNumberOptions = optionsBlank()): FormattedNumber {
  return formatNumber(num, {
    decimals: 4,
    decimalsRounded: 0,
    denomination: " REP",
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatRepTokens(num, opts: FormattedNumberOptions = optionsBlank()): FormattedNumber {
  return formatNumber(num, {
    decimals: 2,
    decimalsRounded: 2,
    denomination: " REP Tokens",
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatConfirmations(num, opts: FormattedNumberOptions = optionsBlank()): FormattedNumber {
  return formatNumber(Math.max(num, 0), {
    decimals: 0,
    decimalsRounded: 0,
    denomination: "confirmations",
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
    formatted: "-",
    roundedValue: 0,
    rounded: "-",
    roundedFormatted: "-",
    minimized: "-",
    denomination: "",
    full: "-",
    fullPrecision: "0",
  };
}

export function formatBlank(): FormattedNumber {
  return {
    value: 0,
    formattedValue: 0,
    formatted: "",
    roundedValue: 0,
    rounded: "",
    roundedFormatted: "",
    minimized: "",
    denomination: "",
    full: "",
    fullPrecision: "0",
  };
}

export function optionsBlank(): FormattedNumberOptions {
  return {
    decimals: 0,
    decimalsRounded: 0,
    denomination: "",
    roundUp: false,
    roundDown: false,
    positiveSign: false,
    zeroStyled: true,
    minimized: false,
    blankZero: false,
    bigUnitPostfix: false,
  };
}
export function sumAndformatGasCostToEther(gases: Array<string>, opts: FormattedNumberOptions = optionsBlank(), gasPrice: string): string {
  const summedGas = gases.reduce(
    (p, g) => createBigNumber(unfix(g, "number")).plus(p),
    ZERO,
  );

  const estimatedGasCost = createBigNumber(summedGas).times(
    createBigNumber(gasPrice),
  );

  return formatGasCost(estimatedGasCost, opts).roundedFormatted;
}

export function formatGasCostToEther(num: string, opts: FormattedNumberOptions = optionsBlank(), gasPrice: string): string {
  return sumAndformatGasCostToEther([num], opts, gasPrice);
}

export function formatAttoRep(num: number, opts: FormattedNumberOptions = optionsBlank()): FormattedNumber {
  if (!num || num === 0 || isNaN(num)) return formatBlank();
  return formatNumber(
    createBigNumber(num.toString())
      .dividedBy(ETHER)
      .toNumber(),
    { blankZero: false, ...opts },
  );
}

// At some point potentially refactor all this to be more generic (e.g formatAttoAmount)
export function formatAttoEth(num: number, opts: FormattedNumberOptions = optionsBlank()): FormattedNumber {
  if (!num || num === 0 || isNaN(num)) return formatBlank();
  return formatNumber(
    createBigNumber(num.toString())
      .dividedBy(ETHER)
      .toNumber(),
    { blankZero: false, ...opts },
  );
}

export function formatGasCost(num: number, opts: FormattedNumberOptions = optionsBlank()): FormattedNumber {
  return formatNumber(num, {
    decimals: 0,
    decimalsRounded: 0,
    denomination: " GWEI",
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatNumber(
  num,
  opts: FormattedNumberOptions = optionsBlank(),
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
  } = opts;

  decimals = decimals || 0;
  decimalsRounded = decimalsRounded || 0;
  denomination = denomination || "";
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
  if (isNaN(parseFloat(num))) {
    o.value = 0;
    o.formattedValue = 0;
    o.formatted = "0";
    o.roundedValue = 0;
    o.rounded = "0";
    o.roundedFormatted = "0";
    o.minimized = "0";
    o.fullPrecision = "0";
  } else {
    const useSignificantFiguresThreshold = TEN.exponentiatedBy(
      new BigNumber(decimals, 10)
        .minus(1)
        .negated()
        .toNumber(),
    );
    const roundToZeroThreshold = constants.PRECISION.zero;
    o.value = value.toNumber();
    if (value.abs().lt(roundToZeroThreshold)) {
      // value is less than zero
      o.formattedValue = "0";
    } else if (value.abs().lt(useSignificantFiguresThreshold)) {
      if (!decimals) {
        o.formattedValue = "0";
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

    const zeroFixed = constants.PRECISION.zero.toFixed(
      USUAL_NUMBER_DECIMAL_PLACES,
    );

    if (bigUnitPostfix && !formatSigFig) {
      o.formatted = addBigUnitPostfix(value, o.formattedValue);
    } else if (formatSigFig) {
      // for numbers smaller than the set number of decimals - ie ones with scientific notation
      let formatted = value.toFixed(USUAL_NUMBER_DECIMAL_PLACES);

      if (formatted === zeroFixed || formatted === "-" + zeroFixed) {
        // if this is equal to zero, try to show significant digits up to 8 digit places
        formatted = value.toFixed(SMALLEST_NUMBER_DECIMAL_PLACES);
        if (
          formatted ===
            constants.PRECISION.zero.toFixed(SMALLEST_NUMBER_DECIMAL_PLACES) ||
          formatted ===
            "-" +
              constants.PRECISION.zero.toFixed(SMALLEST_NUMBER_DECIMAL_PLACES)
        ) {
          formatted = zeroFixed; // if there are no significant digits in the 8 decimal places, just use zero
        } else {
          formatted = value.toFixed(
            1 - Math.floor(Math.log(value.abs()) / Math.log(10)),
          ); // find first two significant digit
        }
      }
      o.formatted = formatted;
    } else {
      o.formatted = addCommas(o.formattedValue);
    }
    o.fullPrecision = value.toFixed();
    o.roundedValue = value
      .times(decimalsRoundedValue)
      .integerValue(roundingMode)
      .dividedBy(decimalsRoundedValue);
    o.roundedFormatted = bigUnitPostfix
      ? addBigUnitPostfix(value, o.roundedValue.toFixed(decimalsRounded))
      : addCommas(o.roundedValue.toFixed(decimalsRounded));
    o.minimized = addCommas(encodeNumberAsBase10String(o.formattedValue));
    o.rounded = encodeNumberAsBase10String(o.roundedValue);
    o.formattedValue = encodeNumberAsJSNumber(o.formattedValue, false);
    o.roundedValue = o.roundedValue;
  }

  if (positiveSign && !bigUnitPostfix) {
    if (o.formattedValue || 0 >= 0) {
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

  o.denomination = denomination;
  o.full = makeFull(o.formatted, o.denomination); // should this use this?

  if (isNaN(parseFloat(num)) || o.formatted === "0") {
    o.formatted = constants.PRECISION.zero.toFixed(decimalsRounded);
  }
  return o;
}

function addBigUnitPostfix(value, formattedValue) {
  let postfixed;
  if (value.gt(createBigNumber("1000000000000", 10))) {
    postfixed = "> 1T";
  } else if (value.gt(createBigNumber("10000000000", 10))) {
    postfixed =
      value.dividedBy(createBigNumber("1000000000", 10)).toFixed(0) + "B";
  } else if (value.gt(createBigNumber("10000000", 10))) {
    postfixed =
      value.dividedBy(createBigNumber("1000000", 10)).toFixed(0) + "M";
  } else if (value.gt(createBigNumber("10000", 10))) {
    postfixed = value.dividedBy(createBigNumber("1000", 10)).toFixed(0) + "K";
  } else {
    postfixed = addCommas(formattedValue);
  }
  return postfixed;
}

export function makeFull(formatted, denomination) {
  return formatted + denomination;
}

export function cutOffDecimal(value, numDigits) {
  const decimals = (value + "").split(".");
  if (decimals[1] && decimals[1].length > numDigits) {
    return decimals[0] + "." + decimals[1].substring(0, numDigits);
  }
  return value;
}
