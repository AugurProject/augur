import BigNumber from 'bignumber.js';
import {
  MarketData,
} from './logs';
import {
  CommonOutcomes,
  MarketType,
  MarketTypeName,
  YesNoOutcomes,
} from './constants';
import {
  calculatePayoutNumeratorsValue,
  describeCategoricalOutcome,
  describeMarketOutcome,
  describeScalarOutcome,
  describeUniverseOutcome,
  describeYesNoOutcome,
  isWellFormedCategorical,
  isWellFormedScalar,
  isWellFormedYesNo,
  marketTypeToName,
  PayoutNumeratorValue,
} from './markets';
import {
  convertDisplayAmountToOnChainAmount,
  convertDisplayPriceToOnChainPrice,
  convertOnChainAmountToDisplayAmount,
  convertOnChainPriceToDisplayPrice,
  numTicksToTickSize,
  numTicksToTickSizeWithDisplayPrices,
} from '@augurproject/utils';
import {
  countNonZeroes,
} from './utils';

test('numTicksToTickSize', () => {
  const minPrice = new BigNumber(0);
  const maxPrice = new BigNumber(1e18).times(10);
  const numTicks = new BigNumber(10000);
  expect(numTicksToTickSize(numTicks, minPrice, maxPrice).toString()).toEqual(
    '0.001'
  );
});

test('numTicksToTickSizeWithDisplayPrices', () => {
  const minPrice = new BigNumber(0);
  const maxPrice = new BigNumber(10);
  const numTicks = new BigNumber(10000);
  expect(
    numTicksToTickSizeWithDisplayPrices(numTicks, minPrice, maxPrice).toString()
  ).toEqual('0.001');
});

test('convertOnChainAmountToDisplayAmount', () => {
  const onChainAmount = new BigNumber(1e18).times(23);
  const tickSize = new BigNumber('0.001');
  expect(
    convertOnChainAmountToDisplayAmount(onChainAmount, tickSize).toString()
  ).toEqual('23000');
});

test('convertDisplayAmountToOnChainAmount', () => {
  const displayAmount = new BigNumber(23);
  const tickSize = new BigNumber('0.001');
  expect(
    convertDisplayAmountToOnChainAmount(displayAmount, tickSize).toString()
  ).toEqual('23000000000000000');
});

test('convertOnChainPriceToDisplayPrice', () => {
  const onChainPrice = new BigNumber(20000);
  const minPrice = new BigNumber(1e18).times(3);
  const tickSize = new BigNumber('0.001');
  expect(
    convertOnChainPriceToDisplayPrice(
      onChainPrice,
      minPrice,
      tickSize
    ).toString()
  ).toEqual('23');
});

test('convertDisplayPriceToOnChainPrice', () => {
  const displayPrice = new BigNumber(23);
  const minPrice = new BigNumber(3);
  const tickSize = new BigNumber('0.001');
  expect(
    convertDisplayPriceToOnChainPrice(
      displayPrice,
      minPrice,
      tickSize
    ).toString()
  ).toEqual('20000');
});

test('calculate payout numerators value : malformed : no payout', () => {
  const value = calculatePayoutNumeratorsValue('', '', '10000', '', []);
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
    ['3000', '4000', '3000']
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
  expect(
    isWellFormedCategorical(['1', '0', '0', '0', '0', '0', '0', '0', '0'])
  ).toEqual(false);

  expect(isWellFormedCategorical(['1', '0', '0'])).toEqual(true);
  expect(isWellFormedCategorical(['0', '1', '0'])).toEqual(true);
  expect(
    isWellFormedCategorical(['0', '0', '0', '0', '0', '0', '0', '1110'])
  ).toEqual(true);
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
  const outcomes = ['real', 'a dream', 'a trick'];
  expect(describeCategoricalOutcome(0, outcomes)).toEqual(
    CommonOutcomes.Invalid
  );
  expect(describeCategoricalOutcome(1, outcomes)).toEqual('real');
  expect(describeCategoricalOutcome(2, outcomes)).toEqual('a dream');
  expect(describeCategoricalOutcome(3, outcomes)).toEqual('a trick');
});

test('describe scalar outcome', () => {
  expect(describeScalarOutcome(0, ['-10', '10'])).toEqual(
    CommonOutcomes.Invalid
  );
  expect(describeScalarOutcome(1, ['-10', '10'])).toEqual('-10');
  expect(describeScalarOutcome(2, ['-10', '10'])).toEqual('10');
});

test('describe universe outcome : malformed', () => {
  const outcome: PayoutNumeratorValue = { outcome: null, malformed: true };
  const marketData = {} as MarketData;
  expect(describeUniverseOutcome(outcome, marketData)).toEqual(
    CommonOutcomes.Malformed
  );
});

test('describe universe outcome : invalid', () => {
  const outcome: PayoutNumeratorValue = { outcome: '0', invalid: true };
  const marketData = {} as MarketData;
  expect(describeUniverseOutcome(outcome, marketData)).toEqual(
    CommonOutcomes.Invalid
  );
});

test('describe universe outcome : yes-no : no', () => {
  const outcome: PayoutNumeratorValue = { outcome: '1' };
  const marketData = {
    marketType: MarketType.YesNo,
  } as MarketData;
  expect(describeUniverseOutcome(outcome, marketData)).toEqual(
    YesNoOutcomes.No
  );
});

test('describe universe outcome : yes-no : yes', () => {
  const outcome: PayoutNumeratorValue = { outcome: '2' };
  const marketData = {
    marketType: MarketType.YesNo,
  } as MarketData;
  expect(describeUniverseOutcome(outcome, marketData)).toEqual(
    YesNoOutcomes.Yes
  );
});

test('describe universe outcome : categorical', () => {
  const outcome: PayoutNumeratorValue = { outcome: '1' };
  const marketData = {
    marketType: MarketType.Categorical,
    outcomes: ['real', 'a dream', 'a trick'],
  } as MarketData;
  expect(describeUniverseOutcome(outcome, marketData)).toEqual('real');
});

test('describe universe outcome : scalar', () => {
  const outcome: PayoutNumeratorValue = { outcome: '42' };
  const marketData = {
    marketType: MarketType.Scalar,
  } as MarketData;
  expect(describeUniverseOutcome(outcome, marketData)).toEqual('42');
});

test('describe market outcome : invalid', () => {
  const marketData = {} as MarketData;
  expect(describeMarketOutcome(0, marketData)).toEqual(CommonOutcomes.Invalid);
  expect(describeMarketOutcome('0x00', marketData)).toEqual(
    CommonOutcomes.Invalid
  );
});

test('describe market outcome : yes-no', () => {
  const marketData = { marketType: MarketType.YesNo } as MarketData;
  expect(describeMarketOutcome('0x01', marketData)).toEqual(YesNoOutcomes.No);
  expect(describeMarketOutcome('0x02', marketData)).toEqual(YesNoOutcomes.Yes);
});

test('describe market outcome : categorical', () => {
  const marketData = {
    marketType: MarketType.Categorical,
    outcomes: ['real', 'a dream', 'a trick'],
  } as MarketData;
  expect(describeMarketOutcome('0x01', marketData)).toEqual('real');
  expect(describeMarketOutcome('0x02', marketData)).toEqual('a dream');
  expect(describeMarketOutcome('0x03', marketData)).toEqual('a trick');
});

test('describe market outcome : scalar', () => {
  const marketData = {
    marketType: MarketType.Scalar,
    prices: ['-10', '10'],
  } as MarketData;
  expect(describeMarketOutcome('0x01', marketData)).toEqual('-10');
  expect(describeMarketOutcome('0x02', marketData)).toEqual('10');
});

test('market type to name', async () => {
  expect(marketTypeToName(MarketType.YesNo)).toEqual(MarketTypeName.YesNo);
  expect(marketTypeToName(MarketType.Categorical)).toEqual(
    MarketTypeName.Categorical
  );
  expect(marketTypeToName(MarketType.Scalar)).toEqual(MarketTypeName.Scalar);
});
