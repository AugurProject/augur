import { describe, it } from 'mocha';
import { assert } from 'chai';
import sinon from 'sinon';

import { selectAggregateOrderBook, __RewireAPI__ as selectOrderBookRewireAPI } from 'modules/bids-asks/helpers/select-order-book';

describe('modules/bids-asks/helpers/select-order-book.js', () => {
  const test = t => it(t.description, done => t.assertions(done));

  describe('selectAggregateOrderBook', () => {
    test({
      description: `should return the expected object when 'marketOrderBook' is null`,
      assertions: (done) => {
        const actual = selectAggregateOrderBook('1', null, {});

        const expected = {
          bids: [],
          asks: []
        };

        assert.deepEqual(actual, expected, `didn't return the expected object`);

        done();
      }
    });

    test({
      description: `should return the expected object when 'marketOrderBook' is null`,
      assertions: (done) => {
        const selectAggregatePricePoints = sinon.stub().returns(['test']);
        selectOrderBookRewireAPI.__Rewire__('selectAggregatePricePoints', selectAggregatePricePoints);

        const actual = selectAggregateOrderBook('1', { buy: [], sell: [] }, {});

        const expected = {
          bids: ['test'],
          asks: ['test']
        };

        assert.deepEqual(actual, expected, `didn't return the expected object`);

        done();
      }
    });
  });
});
