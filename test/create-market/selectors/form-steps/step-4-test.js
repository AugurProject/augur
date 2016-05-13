import {
  assert
} from 'chai';
import {
  TRADING_FEE_MIN,
  TRADING_FEE_MAX,
  INITIAL_LIQUIDITY_MIN,
  TRADING_FEE_DEFAULT,
  INITIAL_LIQUIDITY_DEFAULT
} from '../../../../src/modules/create-market/constants/market-values-constraints';
import * as selector from '../../../../src/modules/create-market/selectors/form-steps/step-4';

describe(`modules/create-market/selectors/form-steps/step-4.js`, () => {
  let formState, out;

  it('should handle returning correct data shape', () => {
    out = {
      tradingFeePercent: TRADING_FEE_DEFAULT,
      initialLiquidity: INITIAL_LIQUIDITY_DEFAULT
    };
    assert.deepEqual(selector.select({}), out, `Didn't produce the expected return object for select()`);
  });

  it(`should handle validation of step 4`, () => {
    formState = {
      tradingFeePercent: '',
      initialLiquidity: ''
    };
    assert(!selector.isValid(formState), `Didn't invalidate a blank tradingFeePercent`);
    formState.tradingFeePercent = 'testNonNumeric';
    assert(!selector.isValid(formState), `Didn't invalidate a tradingFeePercent that wasn't a number`);
    formState.tradingFeePercent = (TRADING_FEE_MIN - 1);
    assert(!selector.isValid(formState), `Didn't invalidate a tradingFeePercent that is below the Trading Fee min`);
    formState.tradingFeePercent = (TRADING_FEE_MAX + 1);
    assert(!selector.isValid(formState), `Didn't invalidate a tradingFeePercent that is above the Trading Fee max`);
    formState.tradingFeePercent = TRADING_FEE_DEFAULT;
    assert(!selector.isValid(formState), `Didn't invalidate a initialLiquidity of empty string`);
    formState.initialLiquidity = 'testNonNumeric';
    assert(!selector.isValid(formState), `Didn't invalidate a non numeric initialLiquidity`);
    formState.initialLiquidity = (INITIAL_LIQUIDITY_MIN - 1);
    assert(!selector.isValid(formState), `Didn't invalidate a initialLiquidity that was below the minumum`);
    formState.initialLiquidity = (INITIAL_LIQUIDITY_MIN + 10);
    assert(selector.isValid(formState), `Didn't validate a valid formState`);

  });

  it(`should handle errors in step 4`, () => {
    formState = {
      tradingFeePercent: '',
      initialLiquidity: ''
    };
    out = {
      tradingFeePercent: 'Please specify a trading fee %',
      initialLiquidity: 'Please provide some initial liquidity'
    };
    assert.deepEqual(selector.errors(formState), out, `Didn't error on a blank tradingFeePercent`);

    formState.tradingFeePercent = 'testNonNumeric';
    out = {
      tradingFeePercent: 'Trading fee must be a number',
      initialLiquidity: 'Please provide some initial liquidity'
    };
    assert.deepEqual(selector.errors(formState), out, `Didn't error on a tradingFeePercent that wasn't a number`);

    formState.tradingFeePercent = (TRADING_FEE_MIN - 1);
    out = {
      tradingFeePercent: 'Please specify a trading fee %',
      initialLiquidity: 'Please provide some initial liquidity'
    };
    assert.deepEqual(selector.errors(formState), out, `Didn't error on a tradingFeePercent that is below the Trading Fee min`);

    formState.tradingFeePercent = (TRADING_FEE_MAX + 1);
    out = {
      tradingFeePercent: 'Trading fee must be between +1.0% and +12.5%',
      initialLiquidity: 'Please provide some initial liquidity'
    };
    assert.deepEqual(selector.errors(formState), out, `Didn't error on a tradingFeePercent that is above the Trading Fee max`);

    formState.tradingFeePercent = TRADING_FEE_DEFAULT;
    out = {
      tradingFeePercent: undefined,
      initialLiquidity: 'Please provide some initial liquidity'
    };
    assert.deepEqual(selector.errors(formState), out, `Didn't error on a initialLiquidity of empty string`);

    formState.initialLiquidity = 'testNonNumeric';
    out = {
      tradingFeePercent: undefined,
      initialLiquidity: 'Initial liquidity must be numeric'
    };
    assert.deepEqual(selector.errors(formState), out, `Didn't error on a non numeric initialLiquidity`);

    formState.initialLiquidity = (INITIAL_LIQUIDITY_MIN - 1);
    out = {
      tradingFeePercent: undefined,
      initialLiquidity: 'Initial liquidity must be at least +50.00Eth'
    };
    assert.deepEqual(selector.errors(formState), out, `Didn't error on a initialLiquidity that was below the minumum`);

    formState.initialLiquidity = (INITIAL_LIQUIDITY_MIN + 10);
    out = {
      tradingFeePercent: undefined,
      initialLiquidity: undefined
    };
    assert.deepEqual(selector.errors(formState), out, `Didn't return no errors for a valid formState`);

  });
});
