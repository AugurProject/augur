import { describe, it } from 'mocha';
import { assert } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
// import * as selector from 'modules/my-positions/selectors/my-positions-summary';
// import positionsSummaryAssertions from 'assertions/positions-summary';
// import { abi } from 'services/augurjs';

describe(`modules/my-positions/selectors/my-positions-summary.js`, () => {

  describe('default', () => {
    proxyquire.noPreserveCache().noCallThru();

    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    const test = (t) => {
      it(t.description, () => {
        const store = mockStore(t.state || {});
        t.assertions(store);
      });
    };

    test({
      description: `default should return null if there are no markets with positions`,
      state: {},
      assertions: (store) => {
        const mockSelectMyPositions = sinon.stub().returns({});

        const selector = proxyquire('../../../src/modules/my-positions/selectors/my-positions-summary', {
          './my-positions': mockSelectMyPositions
        });

        const actual = selector.default();

        const expected = null;

        assert.strictEqual(actual, expected, `Didn't return the expect object`);
      }
    });
  });
});
