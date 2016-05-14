import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe(`modules/positions/selectors/position.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  let selector, out, test;
  let mockPosition = {
    selectPositionsSummary: () => {}
  };
  sinon.stub(mockPosition, 'selectPositionsSummary', (arg1, arg2, arg3, arg4) => {
    return {
      arg1,
      arg2,
      arg3,
      arg4
    }
  });

  selector = proxyquire('../../../src/modules/positions/selectors/position.js', {
    '../../positions/selectors/positions-summary': mockPosition
  });

  it(`should select position from outcome of account trades`, () => {
    let outcomes = [
      {
        id: 'test1',
        qtyShares: 5,
        purchasePrice: 2
      },
      {
        id: 'test2',
        qtyShares: 15,
        purchasePrice: 5
      },
      {
        id: 'test3',
        qtyShares: 25,
        purchasePrice: 10
      }
    ];

    test = selector.selectPositionFromOutcomeAccountTrades(outcomes, 5);

    out = { arg1: 3, arg2: 45, arg3: 225, arg4: 335 };
    assert(mockPosition.selectPositionsSummary.calledOnce, `Didn't call selectPositionSummary once as expected`);
    assert.equal(selector.selectPositionFromOutcomeAccountTrades({}, 5), null, `Didn't break with no outcomes`);

    assert.deepEqual(test, out, `Didn't return the expected object`);
  });
});
