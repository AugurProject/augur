import {
  calculatePayoutNumeratorsValue,
  convertDisplayAmountToOnChainAmount,
  convertDisplayPriceToOnChainPrice,
  convertOnChainAmountToDisplayAmount,
  convertOnChainPriceToDisplayPrice,
  countNonZeroes,
  describeCategoricalOutcome,
  describeMarketOutcome,
  describeScalarOutcome,
  describeUniverseOutcome,
  describeYesNoOutcome,
  isWellFormedCategorical,
  isWellFormedScalar,
  isWellFormedYesNo,
  marketTypeToName,
  numTicksToTickSize,
  numTicksToTickSizeWithDisplayPrices,
  PayoutNumeratorValue,
} from './utils';
import {
  CommonOutcomes,
  MarketCreatedLog,
  MarketType,
  MarketTypeName,
  YesNoOutcomes
} from './state/logs/types';
import { formatBytes32String } from 'ethers/utils';
import BigNumber from 'bignumber.js';


test('numTicksToTickSize', () => {
  const minPrice = new BigNumber(0);
  const maxPrice = new BigNumber(1e18).times(10);
  const numTicks = new BigNumber(10000);
  expect(numTicksToTickSize(numTicks, minPrice, maxPrice).toString()).toEqual('0.001');
});

test('numTicksToTickSizeWithDisplayPrices', () => {
  const minPrice = new BigNumber(0);
  const maxPrice = new BigNumber(10);
  const numTicks = new BigNumber(10000);
  expect(numTicksToTickSizeWithDisplayPrices(numTicks, minPrice, maxPrice).toString()).toEqual('0.001');
});

test('convertOnChainAmountToDisplayAmount', () => {
  const onChainAmount = new BigNumber(1e18).times(23);
  const tickSize = new BigNumber('0.001');
  expect(convertOnChainAmountToDisplayAmount(onChainAmount, tickSize).toString()).toEqual('23000');
});

test('convertDisplayAmountToOnChainAmount', () => {
  const displayAmount = new BigNumber(23);
  const tickSize = new BigNumber('0.001');
  expect(convertDisplayAmountToOnChainAmount(displayAmount, tickSize).toString()).toEqual('23000000000000000');
});

test('convertOnChainPriceToDisplayPrice', () => {
  const onChainPrice = new BigNumber(20000);
  const minPrice = new BigNumber(1e18).times(3);
  const tickSize = new BigNumber('0.001');
  expect(convertOnChainPriceToDisplayPrice(onChainPrice, minPrice, tickSize).toString()).toEqual('23');
});

test('convertDisplayPriceToOnChainPrice', () => {
  const displayPrice = new BigNumber(23);
  const minPrice = new BigNumber(3);
  const tickSize = new BigNumber('0.001');
  expect(convertDisplayPriceToOnChainPrice(displayPrice, minPrice, tickSize).toString()).toEqual('20000');
});

test('calculate payout numerators value : malformed : no payout', () => {
  const value = calculatePayoutNumeratorsValue(
    '',
    '',
    '10000',
    '',
    []
  );
  expect(value).toEqual({ outcome: null, malformed: true });
});

test('calculate payout numerators value : scalar : malformed', () => {
  const value = calculatePayoutNumeratorsValue(
    '10',
    '-10',
    '10000',
    MarketTypeName.Scalar,
    ['5000', '5000', '0']
  );
  expect(value).toEqual({ outcome: null, malformed: true });
});

test('calculate payout numerators value : scalar : invalid', () => {
  const value = calculatePayoutNumeratorsValue(
    '10',
    '-10',
    '10000',
    MarketTypeName.Scalar,
    ['10000', '0', '0']
  );
  expect(value).toEqual({ outcome: '0', invalid: true });
});

test('calculate payout numerators value : scalar : outcome is zero without being invalid', () => {
  const value = calculatePayoutNumeratorsValue(
    '10',
    '-10',
    '10000',
    MarketTypeName.Scalar,
    ['0', '5000', '5000']
  );
  expect(value).toEqual({ outcome: '0' });
});

test('calculate payout numerators value : scalar', () => {
  const value = calculatePayoutNumeratorsValue(
    '10',
    '-10',
    '10000',
    MarketTypeName.Scalar,
    ['0', '5001', '4999']
  );
  expect(value).toEqual({ outcome: '-0.002' });
});

test('calculate payout numerators value : categorical : malformed', () => {
  const value = calculatePayoutNumeratorsValue(
    '',
    '',
    '',
    MarketTypeName.Categorical,
    ['3000', '4000', '3000', '0']
  );
  expect(value).toEqual({ outcome: null, malformed: true });
});

test('calculate payout numerators value : categorical : invalid', () => {
  const value = calculatePayoutNumeratorsValue(
    '',
    '',
    '',
    MarketTypeName.Categorical,
    ['10000', '0', '0', '0']
  );
  expect(value).toEqual({ outcome: '0', invalid: true });
});

test('calculate payout numerators value : categorical', () => {
  const value = calculatePayoutNumeratorsValue(
    '',
    '',
    '',
    MarketTypeName.Categorical,
    ['0', '0', '0', '10000']
  );
  expect(value).toEqual({ outcome: '3' });
});

test('calculate payout numerators value : yes/no : malformed', () => {
  const value = calculatePayoutNumeratorsValue(
    '',
    '',
    '',
    MarketTypeName.YesNo,
    ['3000', '4000', '3000',]
  );
  expect(value).toEqual({ outcome: null, malformed: true });
});

test('calculate payout numerators value : yes/no : invalid', () => {
  const value = calculatePayoutNumeratorsValue(
    '',
    '',
    '',
    MarketTypeName.YesNo,
    ['10000', '0', '0']
  );
  expect(value).toEqual({ outcome: '0', invalid: true });
});

test('calculate payout numerators value : yes/no', () => {
  const value = calculatePayoutNumeratorsValue(
    '',
    '',
    '',
    MarketTypeName.YesNo,
    ['0', '0', '10000']
  );
  expect(value).toEqual({ outcome: '2' });
});

test('is well-formed scalar', () => {
  expect(isWellFormedYesNo([])).toEqual(false);
  expect(isWellFormedYesNo(['1'])).toEqual(false);
  expect(isWellFormedYesNo(['1', '0'])).toEqual(false);
  expect(isWellFormedYesNo(['1', '0', '1'])).toEqual(false);

  expect(isWellFormedYesNo(['1', '0', '0'])).toEqual(true);
  expect(isWellFormedYesNo(['0', '1', '0'])).toEqual(true);
});

test('is well-formed categorical', () => {
  expect(isWellFormedCategorical([])).toEqual(false);
  expect(isWellFormedCategorical(['1'])).toEqual(false);
  expect(isWellFormedCategorical(['1', '0'])).toEqual(false);
  expect(isWellFormedCategorical(['1', '0', '0', '0', '0', '0', '0', '0', '0'])).toEqual(false);

  expect(isWellFormedCategorical(['1', '0', '0'])).toEqual(true);
  expect(isWellFormedCategorical(['0', '1', '0'])).toEqual(true);
  expect(isWellFormedCategorical(['0', '0', '0', '0', '0', '0', '0', '1110'])).toEqual(true);
});

test('is well-formed scalar', () => {
  expect(isWellFormedScalar([])).toEqual(false);
  expect(isWellFormedScalar(['0', '0', '0'])).toEqual(false);
  expect(isWellFormedScalar(['34', '33', '33'])).toEqual(false);
  expect(isWellFormedScalar(['34', '33', '0'])).toEqual(false);
  expect(isWellFormedScalar(['34', '0', '33'])).toEqual(false);

  expect(isWellFormedScalar(['100', '0', '0'])).toEqual(true);
  expect(isWellFormedScalar(['0', '30', '33'])).toEqual(true);
  expect(isWellFormedScalar(['0', '33', '0'])).toEqual(true);
  expect(isWellFormedScalar(['0', '0', '44'])).toEqual(true);
});

test('count non-zeroes', () => {
  expect(countNonZeroes([])).toEqual(0);
  expect(countNonZeroes(['0'])).toEqual(0);
  expect(countNonZeroes(['1'])).toEqual(1);
  expect(countNonZeroes(['0', '1', '34234', '0', '0', '23'])).toEqual(3);
});

test('describe yes-no outcome', () => {
  expect(describeYesNoOutcome(0)).toEqual(CommonOutcomes.Invalid);
  expect(describeYesNoOutcome(1)).toEqual(YesNoOutcomes.No);
  expect(describeYesNoOutcome(2)).toEqual(YesNoOutcomes.Yes);
});

test('describe categorical outcome', () => {
  const outcomes = ['real', 'a dream', 'a trick'].map(formatBytes32String);
  expect(describeCategoricalOutcome(0, outcomes)).toEqual(CommonOutcomes.Invalid);
  expect(describeCategoricalOutcome(1, outcomes)).toEqual('real'.padEnd(32, '\u0000'));
  expect(describeCategoricalOutcome(2, outcomes)).toEqual('a dream'.padEnd(32, '\u0000'));
  expect(describeCategoricalOutcome(3, outcomes)).toEqual('a trick'.padEnd(32, '\u0000'));
});

test('describe scalar outcome', () => {
  expect(describeScalarOutcome(0, ['-10', '10'])).toEqual(CommonOutcomes.Invalid);
  expect(describeScalarOutcome(1, ['-10', '10'])).toEqual('-10');
  expect(describeScalarOutcome(2, ['-10', '10'])).toEqual('10');
});

test('describe universe outcome : malformed', () => {
  const outcome: PayoutNumeratorValue = { outcome: null, malformed: true };
  const log = {} as MarketCreatedLog;
  expect(describeUniverseOutcome(outcome, log)).toEqual(CommonOutcomes.Malformed);
});

test('describe universe outcome : invalid', () => {
  const outcome: PayoutNumeratorValue = { outcome: '0', invalid: true };
  const log = {} as MarketCreatedLog;
  expect(describeUniverseOutcome(outcome, log)).toEqual(CommonOutcomes.Invalid);
});

test('describe universe outcome : yes-no : no', () => {
  const outcome: PayoutNumeratorValue = { outcome: '1' };
  const log = {
    marketType: MarketType.YesNo,
  } as MarketCreatedLog;
  expect(describeUniverseOutcome(outcome, log)).toEqual(YesNoOutcomes.No);
});

test('describe universe outcome : yes-no : yes', () => {
  const outcome: PayoutNumeratorValue = { outcome: '2' };
  const log = {
    marketType: MarketType.YesNo,
  } as MarketCreatedLog;
  expect(describeUniverseOutcome(outcome, log)).toEqual(YesNoOutcomes.Yes);
});

test('describe universe outcome : categorical', () => {
  const outcome: PayoutNumeratorValue = { outcome: '1' };
  const log = {
    marketType: MarketType.Categorical,
    outcomes: ['real', 'a dream', 'a trick'].map(formatBytes32String),
  } as MarketCreatedLog;
  expect(describeUniverseOutcome(outcome, log)).toEqual('real'.padEnd(32, '\u0000'));
});

test('describe universe outcome : scalar', () => {
  const outcome: PayoutNumeratorValue = { outcome: '42' };
  const log = {
    marketType: MarketType.Scalar,
  } as MarketCreatedLog;
  expect(describeUniverseOutcome(outcome, log)).toEqual('42');
});

test('describe market outcome : invalid', () => {
  const log = {} as MarketCreatedLog;
  expect(describeMarketOutcome(0, log)).toEqual(CommonOutcomes.Invalid);
  expect(describeMarketOutcome('0x00', log)).toEqual(CommonOutcomes.Invalid);
});

test('describe market outcome : yes-no', () => {
  const log = { marketType: MarketType.YesNo } as MarketCreatedLog;
  expect(describeMarketOutcome('0x01', log)).toEqual(YesNoOutcomes.No);
  expect(describeMarketOutcome('0x02', log)).toEqual(YesNoOutcomes.Yes);
});

test('describe market outcome : categorical', () => {
  const log = {
    marketType: MarketType.Categorical,
    outcomes: ['real', 'a dream', 'a trick'].map(formatBytes32String),
  } as MarketCreatedLog;
  expect(describeMarketOutcome('0x01', log)).toEqual('real'.padEnd(32, '\u0000'));
  expect(describeMarketOutcome('0x02', log)).toEqual('a dream'.padEnd(32, '\u0000'));
  expect(describeMarketOutcome('0x03', log)).toEqual('a trick'.padEnd(32, '\u0000'));
});

test('describe market outcome : scalar', () => {
  const log = {
    marketType: MarketType.Scalar,
    prices: ['-10', '10'],
  } as MarketCreatedLog;
  expect(describeMarketOutcome('0x01', log)).toEqual('-10');
  expect(describeMarketOutcome('0x02', log)).toEqual('10');
});

test('market type to name', async () => {
  expect(marketTypeToName(MarketType.YesNo)).toEqual(MarketTypeName.YesNo);
  expect(marketTypeToName(MarketType.Categorical)).toEqual(MarketTypeName.Categorical);
  expect(marketTypeToName(MarketType.Scalar)).toEqual(MarketTypeName.Scalar);
});

