import { describe, it } from 'mocha';
import { assert } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

// import memProfile =
// import * as selector from 'modules/my-positions/selectors/my-positions-summary';
// import positionsSummaryAssertions from 'assertions/positions-summary';
// import { abi } from 'services/augurjs';

import * as myPositionsSummary from 'modules/my-positions/selectors/my-positions-summary';

import { formatEther, formatShares, formatNumber } from 'utils/format-number';

describe(`modules/my-positions/selectors/my-positions-summary.js`, () => {

  describe('default', () => {
    proxyquire.noPreserveCache().noCallThru();

    const test = (t) => {
      it(t.description, () => {
        t.assertions();
      });
    };

    test({
      description: `default should return null if there ARE NO markets with positions`,
      assertions: (store) => {
        const mockSelectMyPositions = sinon.stub().returns([]);

        const selector = proxyquire('../../../src/modules/my-positions/selectors/my-positions-summary', {
          './my-positions': mockSelectMyPositions
        });

        const actual = selector.default();

        const expected = null;

        assert.strictEqual(actual, expected, `Didn't return the expect object`);
      }
    });

    test({
      description: `default should return the expected object if there ARE markets with positions AND no outcomes have position object`,
      assertions: (store) => {
        const mockSelectMyPositions = sinon.stub().returns([
          {
            id: '0xMARKETID1',
            myPositionsSummary: {
              numPositions: formatNumber(1, {
                decimals: 0,
                decimalsRounded: 0,
                denomination: 'Positions',
                positiveSign: false,
                zeroStyled: false
              }),
              qtyShares: formatShares(1),
              purchasePrice: formatEther(0.2),
              realizedNet: formatEther(0),
              unrealizedNet: formatEther(0),
              totalNet: formatEther(0)
            },
            outcomes: [{}]
          }
        ]);

        const selector = proxyquire('../../../src/modules/my-positions/selectors/my-positions-summary', {
          './my-positions': mockSelectMyPositions
        });

        const actual = selector.default();

        const expected = {
          numPositions: formatNumber(0, {
            decimals: 0,
            decimalsRounded: 0,
            denomination: 'Positions',
            positiveSign: false,
            zeroStyled: false
          }),
          qtyShares: formatShares(0),
          purchasePrice: formatEther(0),
          realizedNet: formatEther(0),
          unrealizedNet: formatEther(0),
          totalNet: formatEther(0),
          positionOutcomes: []
        };

        assert.deepEqual(actual, expected, `Didn't return the expect object`);
      }
    });
  });
});
