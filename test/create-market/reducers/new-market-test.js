import { describe, it } from 'mocha';
import { assert } from 'chai';

import newMarket from 'modules/create-market/reducers/new-market';

import {
  ADD_VALIDATION_TO_NEW_MARKET,
  REMOVE_VALIDATION_FROM_NEW_MARKET,
  ADD_ORDER_TO_NEW_MARKET,
  REMOVE_ORDER_FROM_NEW_MARKET,
  UPDATE_NEW_MARKET,
  CLEAR_NEW_MARKET
} from 'modules/create-market/actions/update-new-market';

import { TAKER_FEE_DEFAULT, MAKER_FEE_DEFAULT } from 'modules/create-market/constants/new-market-constraints';

import BigNumber from 'bignumber.js';

describe('modules/create-market/reducers/new-market.js', () => {
  const test = (t) => {
    it(t.describe, () => {
      t.assertions();
    });
  };

  test({
    describe: 'should return the default value',
    assertions: () => {
      const actual = newMarket(undefined, { type: null });

      const expected = {
        isValid: false,
        validations: [],
        currentStep: 0,
        type: '',
        outcomes: [],
        scalarSmallNum: '',
        scalarBigNum: '',
        description: '',
        expirySourceType: '',
        expirySource: '',
        endDate: {},
        detailsText: '',
        topic: '',
        keywords: [],
        takerFee: TAKER_FEE_DEFAULT,
        makerFee: MAKER_FEE_DEFAULT,
        orderBook: {},
        orderBookSorted: {},
        orderBookSeries: {},
        initialLiquidityEth: new BigNumber(0),
        initialLiquidityGas: new BigNumber(0),
        initialLiquidityFees: new BigNumber(0)
      };

      assert.deepEqual(actual, expected, `Didn't return the expected default value`);
    }
  });
});
