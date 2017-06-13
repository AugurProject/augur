import { describe, it } from 'mocha';
import { assert } from 'chai';
import sinon from 'sinon';

import { selectAggregateOrderBook, selectTopBid, __RewireAPI__ as selectOrderBookRewireAPI } from 'modules/bids-asks/helpers/select-order-book';

describe('modules/bids-asks/helpers/select-order-book.js', () => {
  const test = t => it(t.description, () => t.assertions());

  describe('selectAggregateOrderBook', () => {
    test({
      description: `should return the expected object when 'marketOrderBook' is null`,
      assertions: () => {
        const actual = selectAggregateOrderBook('1', null, {});

        const expected = {
          bids: [],
          asks: []
        };

        assert.deepEqual(actual, expected, `didn't return the expected object`);
      }
    });

    test({
      description: `should return the expected object when 'marketOrderBook' is null`,
      assertions: () => {
        const selectAggregatePricePoints = sinon.stub().returns(['test']);
        selectOrderBookRewireAPI.__Rewire__('selectAggregatePricePoints', selectAggregatePricePoints);

        const actual = selectAggregateOrderBook('1', { buy: [], sell: [] }, {});

        const expected = {
          bids: ['test'],
          asks: ['test']
        };

        assert.deepEqual(actual, expected, `didn't return the expected object`);
      }
    });
  });

  describe('selectTopBid', () => {
    const marketOrderBook = {
      bids: [
        {
          isOfCurrentUser: true,
          price: '0.4'
        },
        {
          price: '0.3'
        },
        {
          price: '0.2'
        },
        {
          price: '0.1'
        },
      ]
    };

    test({
      description: `should return null when not bids exist and including current user`,
      assertions: () => {
        const actual = selectTopBid({ bids: [] });

        const expected = null;

        assert.strictEqual(actual, expected, `didn't return the expected top bid`);
      }
    });

    test({
      description: `should return null when not bids exist and excluding current user`,
      assertions: () => {
        const actual = selectTopBid({ bids: [] }, true);

        const expected = null;

        assert.strictEqual(actual, expected, `didn't return the expected top bid`);
      }
    });

    test({
      description: `should return the topBid, including current user`,
      assertions: () => {
        const actual = selectTopBid(marketOrderBook);

        const expected = {
          isOfCurrentUser: true,
          price: '0.4'
        };

        assert.deepEqual(actual, expected, `didn't return the expected top bid`);
      }
    });

    test({
      description: `should return the topBid, excluding current user`,
      assertions: () => {
        const actual = selectTopBid(marketOrderBook, true);

        const expected = {
          price: '0.3'
        };

        assert.deepEqual(actual, expected, `didn't return the expected top bid`);
      }
    });
  });
});
