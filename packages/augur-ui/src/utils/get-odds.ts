import {
  ODDS_TYPE,
  BID,
  NEGATIVE_ONE,
  ONE,
  FIFTY,
  HUNDRED,
} from 'modules/common/constants';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import { AppStatus } from 'modules/app/store/app-status';
import {
  formatNumber,
  formatPercent,
  formatFractional,
  formatAmerican,
} from './format-number';
import { FormattedNumber } from 'modules/types';

const { DECIMAL, FRACTIONAL, AMERICAN, PERCENT } = ODDS_TYPE;

const mockExamples = [
  {
    price: 0.35,
    min: 0,
    max: 1,
    type: BID,
  },
  {
    price: 0.35,
    min: 0,
    max: 1,
    type: 'ask',
  },
  {
    price: 350,
    min: 0,
    max: 1000,
    type: BID,
  },
  {
    price: 10,
    min: -10,
    max: 50,
    type: 'ask',
  },
  {
    price: 10,
    min: -10,
    max: 50,
    type: BID,
  },
];

export const test = (examples = mockExamples) => {
  examples.forEach(example => console.log(convertToOdds({ ...example })));
};

interface ConvertToNormalizedPriceType {
  price: number | string | BigNumber;
  min?: number | string | BigNumber;
  max?: number | string | BigNumber;
  type?: string;
  toDecimals?: number;
}

export const convertToOdds = (normalizedPrice, toDecimals = 4) => {
  const { oddsType } = AppStatus.get();
  const odds = getOddsObject(createBigNumber(normalizedPrice), toDecimals);
  return odds[oddsType];
};

export const convertToNormalizedPrice = ({
  price,
  min = 0,
  max = 1,
  type = BID,
}: ConvertToNormalizedPriceType) => {
  const bnPrice = createBigNumber(price);
  const bnMin = createBigNumber(min);
  const bnMax = createBigNumber(max);
  let normalizedPrice = bnPrice.minus(bnMin).dividedBy(bnMax.minus(bnMin));
  normalizedPrice =
    type === BID
      ? normalizedPrice
      : createBigNumber(bnMax).minus(normalizedPrice);

  return normalizedPrice;
};

export const convertToWin = (maxPrice, shares, toDecimals = 2) => {
  if (!shares) return null;
  const bnShares = createBigNumber(shares);
  return bnShares.times(createBigNumber(maxPrice)).toFixed(toDecimals);
};

export const getWager = (shares, price) => {
  return shares && price
    ? createBigNumber(shares)
        .times(createBigNumber(price))
        .toString()
    : null;
};

export const getShares = (wager, price) => {
  return wager && price
    ? createBigNumber(wager)
        .div(createBigNumber(price))
        .toString()
    : null;
};

export const getOddsObject = (normalizedValue: BigNumber, toDecimals = 4) => {
  const percentage: BigNumber = convertToPercentage(
    createBigNumber(normalizedValue)
  );
  const decimal: BigNumber = convertToDecimal(percentage);
  const fractional: BigNumber = convertToFractional(decimal);
  const american: BigNumber = convertToAmerican(percentage);

  return {
    [DECIMAL]: formatNumber(decimal, {
      decimals: toDecimals,
      precisionFullLabel: true,
    }),
    [FRACTIONAL]: formatFractional(fractional, {
      precisionFullLabel: true,
    }),
    [AMERICAN]: formatAmerican(american),
    [PERCENT]: formatPercent(percentage, {
      decimalsRounded: 2,
      precisionFullLabel: true,
    }),
  };
};

export const convertOddsToPrice = (odds: string) => {
  const { oddsType } = AppStatus.get();
  let result = null;
  const cleanOdds = odds
    .replace(',', '')
    .replace('%', '')
    .trim();
  switch (oddsType) {
    case DECIMAL: {
      result = convertPercentToNormalizedPrice(
        convertDecimalToPercentage(cleanOdds)
      );
      break;
    }
    case FRACTIONAL: {
      const fractionIndex = cleanOdds.indexOf('/');
      const numerator =
        fractionIndex > 0
          ? createBigNumber(cleanOdds.slice(0, fractionIndex))
          : createBigNumber(cleanOdds);
      const denominator =
        fractionIndex > 0
          ? createBigNumber(cleanOdds.slice(fractionIndex + 1))
          : ONE;
      result = convertPercentToNormalizedPrice(
        convertFractionalToPercentage(numerator, denominator)
      );
      break;
    }
    case AMERICAN: {
      result = convertPercentToNormalizedPrice(
        convertAmericanToPercentage(cleanOdds)
      );
      break;
    }
    case PERCENT: {
      result = convertPercentToNormalizedPrice(createBigNumber(cleanOdds));
      break;
    }
    default:
      break;
  }
  return result;
};

const convertPercentToNormalizedPrice = (percent: BigNumber): FormattedNumber =>
  formatNumber(percent.dividedBy(HUNDRED), { decimalsRounded: 2 });
const convertDecimalToPercentage = (decimal: string): BigNumber =>
  ONE.dividedBy(decimal).times(HUNDRED);
const convertFractionalToPercentage = (
  numerator: BigNumber,
  denomintor: BigNumber = ONE
): BigNumber =>
  ONE.dividedBy(numerator.dividedBy(denomintor).plus(ONE)).times(HUNDRED);
const convertAmericanToPercentage = (american: string): BigNumber => {
  const absAmerican = createBigNumber(
    american.replace('-', '').replace('+', '')
  );
  const absAmericanPlus100 = absAmerican.plus(HUNDRED);
  const americanConverted = american.includes('-')
    ? convertNegativeAmericanToPercentage(absAmerican, absAmericanPlus100)
    : convertPositiveAmericanToPercentage(absAmericanPlus100);
  return americanConverted.times(HUNDRED);
};
const convertNegativeAmericanToPercentage = (
  american: BigNumber,
  americanPlus100: BigNumber
): BigNumber => american.dividedBy(americanPlus100);

const convertPositiveAmericanToPercentage = (
  americanPlus100: BigNumber
): BigNumber => HUNDRED.dividedBy(americanPlus100);

const convertToPercentage = (normalizedValue: BigNumber): BigNumber =>
  normalizedValue.times(HUNDRED);

const convertToDecimal = (percentage: BigNumber): BigNumber =>
  ONE.dividedBy(percentage.dividedBy(HUNDRED));

const convertToFractional = (decimal: BigNumber): BigNumber =>
  decimal.minus(ONE);

const convertToPositiveAmerican = (percentage: BigNumber): BigNumber =>
  HUNDRED.dividedBy(percentage.dividedBy(HUNDRED)).minus(HUNDRED);

const convertToNegativeAmerican = (percentage: BigNumber): BigNumber =>
  percentage
    .dividedBy(ONE.minus(percentage.dividedBy(HUNDRED)))
    .times(NEGATIVE_ONE);

const convertToAmerican = (percentage: BigNumber): BigNumber =>
  percentage.lte(FIFTY)
    ? convertToPositiveAmerican(percentage)
    : convertToNegativeAmerican(percentage);

// Percentage = normalized price times 100, e.g. a normalized price of .85 = .85 * 100 = 85.

// Decimal - 1 divided by (the percentage divided by 100) e.g. a probability of 50% = 1 / (50 / 100) = 2.

// Fraction - (1 divided by (the percentage divided by 100)) minus 1 e.g. a probability of 25% = (1 / (25 / 100)) - 1 = 3 = 3/1.

// American:
// Positive odds - (100 divided by (the percentage divided by 100)) minus 100 e.g. a probability of 10% = (100 / (10 / 100)) - 100 = 900.

// Negative odds - The probability divided by (1 minus (the probability divided by 100)) then multiply by -1 to convert into a negative e.g. a probability of 20% = (20 / (1 - (20/100))) * -1 = -25.
