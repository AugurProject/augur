import Augur from 'augur.js';
import speedomatic from 'speedomatic';
import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mocks from 'test/mockStore';
import { tradeTestState } from 'test/trade/constants';
import noop from 'utils/noop';

describe(`modules/trade/actions/place-trade.js`, () => {
  proxyquire.noPreserveCache();
  const test = t => it(t.description, (done) => {
    const augur = new Augur();
    const { state, mockStore } = mocks.default;
    const testState = {
      ...state,
      ...tradeTestState,
      eventsAPI: { TradeAmountRemaining: { signature: 'TRADE_AMOUNT_REMAINING_SIGNATURE' } }
    };
    testState.loginAccount = { privateKey: Buffer.from('PRIVATE_KEY', 'utf8') };
    const store = mockStore(testState);
    const SelectMarket = { selectMarket: () => {} };
    const Speedomatic = {
      fix: (n, enc) => speedomatic.fix(n, enc),
      unfix: (n, enc) => speedomatic.unfix(n, enc)
    };
    const AugurJS = {
      augur: {
        api: t.mock.augur.api,
        constants: augur.constants,
        trading: t.mock.augur.trading
      }
    };
    sinon.stub(SelectMarket, 'selectMarket', marketID => store.getState().marketsData[marketID]);
    const action = proxyquire('../../../src/modules/trade/actions/place-trade.js', {
      speedomatic: Speedomatic,
      '../../../services/augurjs': AugurJS,
      '../../market/selectors/market': SelectMarket
    });
    store.dispatch(action.placeTrade(t.params.marketID, t.params.outcomeID, t.params.tradeInProgress, t.params.doNotMakeOrders, noop, done));
  });
  test({
    description: 'buy 10 outcome 2 @ 0.5',
    params: {
      marketID: 'testBinaryMarketID',
      outcomeID: '2',
      tradeInProgress: {
        side: 'buy',
        numShares: '10',
        limitPrice: '0.5',
        tradeGroupID: '0x1'
      },
      doNotMakeOrders: false
    },
    mock: {
      augur: {
        api: {
          Trade: {
            publicTakeBestOrder: (p) => {
              assert.fail();
            },
            publicTrade: (p) => {
              assert.strictEqual(p._signer.toString('utf8'), 'PRIVATE_KEY');
              assert.strictEqual(p.direction, 1);
              assert.strictEqual(p.market, 'testBinaryMarketID');
              assert.strictEqual(p.outcome, '2');
              assert.strictEqual(p.fxpAmount, '0x8ac7230489e80000');
              assert.strictEqual(p.fxpPrice, '0x6f05b59d3b20000');
              assert.strictEqual(p.tradeGroupID, '0x1');
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              p.onSuccess({ hash: 'TRANSACTION_HASH' });
            }
          }
        },
        trading: {
          normalizePrice: (minValue, maxValue, price) => price,
          getTradeAmountRemaining: (p, callback) => {
            callback(null, '0x0');
          }
        }
      }
    }
  });
  test({
    description: 'buy 10 outcome 2 @ 0.5 (3 remaining)',
    params: {
      marketID: 'testBinaryMarketID',
      outcomeID: '2',
      tradeInProgress: {
        side: 'buy',
        numShares: '10',
        limitPrice: '0.5',
        tradeGroupID: '0x1'
      },
      doNotMakeOrders: false
    },
    mock: {
      augur: {
        api: {
          Trade: {
            publicTakeBestOrder: (p) => {
              assert.fail();
            },
            publicTrade: (p) => {
              assert.strictEqual(p._signer.toString('utf8'), 'PRIVATE_KEY');
              assert.strictEqual(p.direction, 1);
              assert.strictEqual(p.market, 'testBinaryMarketID');
              assert.strictEqual(p.outcome, '2');
              assert(p.fxpAmount === '0x8ac7230489e80000' || p.fxpAmount === '0x29a2241af62c0000');
              assert.strictEqual(p.fxpPrice, '0x6f05b59d3b20000');
              assert.strictEqual(p.tradeGroupID, '0x1');
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              if (p.fxpAmount === '0x8ac7230489e80000') {
                p.onSuccess({ hash: 'TRANSACTION_HASH_1' });
              } else {
                p.onSuccess({ hash: 'TRANSACTION_HASH_2' });
              }
            }
          }
        },
        trading: {
          normalizePrice: (minValue, maxValue, price) => price,
          getTradeAmountRemaining: (p, callback) => {
            if (p.transactionHash === 'TRANSACTION_HASH_1') {
              callback(null, '0x29a2241af62c0000'); // 3*10^18
            } else {
              callback(null, '0x0');
            }
          }
        }
      }
    }
  });
  test({
    description: 'sell 10 outcome 2 @ 0.5',
    params: {
      marketID: 'testBinaryMarketID',
      outcomeID: '2',
      tradeInProgress: {
        side: 'sell',
        numShares: '10',
        limitPrice: '0.5',
        tradeGroupID: '0x1'
      },
      doNotMakeOrders: false
    },
    mock: {
      augur: {
        api: {
          Trade: {
            publicTakeBestOrder: (p) => {
              assert.fail();
            },
            publicTrade: (p) => {
              assert.strictEqual(p._signer.toString('utf8'), 'PRIVATE_KEY');
              assert.strictEqual(p.direction, 2);
              assert.strictEqual(p.market, 'testBinaryMarketID');
              assert.strictEqual(p.outcome, '2');
              assert.strictEqual(p.fxpAmount, '0x8ac7230489e80000');
              assert.strictEqual(p.fxpPrice, '0x6f05b59d3b20000');
              assert.strictEqual(p.tradeGroupID, '0x1');
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              p.onSuccess({ hash: 'TRANSACTION_HASH' });
            }
          }
        },
        trading: {
          normalizePrice: (minValue, maxValue, price) => price,
          getTradeAmountRemaining: (p, callback) => {
            callback(null, '0x0');
          }
        }
      }
    }
  });
  test({
    description: 'close position (take-only) 10 outcome 2 @ 0.5',
    params: {
      marketID: 'testBinaryMarketID',
      outcomeID: '2',
      tradeInProgress: {
        side: 'sell',
        numShares: '10',
        limitPrice: '0.5',
        tradeGroupID: '0x1'
      },
      doNotMakeOrders: true
    },
    mock: {
      augur: {
        api: {
          Trade: {
            publicTakeBestOrder: (p) => {
              assert.strictEqual(p._signer.toString('utf8'), 'PRIVATE_KEY');
              assert.strictEqual(p.direction, 2);
              assert.strictEqual(p.market, 'testBinaryMarketID');
              assert.strictEqual(p.outcome, '2');
              assert.strictEqual(p.fxpAmount, '0x8ac7230489e80000');
              assert.strictEqual(p.fxpPrice, '0x6f05b59d3b20000');
              assert.strictEqual(p.tradeGroupID, '0x1');
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              p.onSuccess({ hash: 'TRANSACTION_HASH' });
            },
            publicTrade: (p) => {
              assert.fail();
            }
          }
        },
        trading: {
          normalizePrice: (minValue, maxValue, price) => price,
          getTradeAmountRemaining: (p, callback) => {
            callback(null, '0x0');
          }
        }
      }
    }
  });
  it('should handle a null/undefined outcomeID', () => {
    const { state, mockStore } = mocks.default;
    const testState = { ...state, ...tradeTestState };
    testState.loginAccount = { privateKey: Buffer.from('PRIVATE_KEY', 'utf8') };
    const store = mockStore(testState);
    const SelectMarket = { selectMarket: () => {} };
    sinon.stub(SelectMarket, 'selectMarket', marketID => store.getState().marketsData[marketID]);
    const action = proxyquire('../../../src/modules/trade/actions/place-trade.js', {
      '../../market/selectors/market': SelectMarket
    });
    store.dispatch(action.placeTrade('testBinaryMarketID', null));
    assert.deepEqual(store.getActions(), [{
      type: 'CLEAR_TRADE_IN_PROGRESS',
      marketID: 'testBinaryMarketID'
    }], `Didn't produce the expected actions for passing a null outcomeID to place-trade`);
    store.clearActions();
    store.dispatch(action.placeTrade('testBinaryMarketID', undefined));
    assert.deepEqual(store.getActions(), [{
      type: 'CLEAR_TRADE_IN_PROGRESS',
      marketID: 'testBinaryMarketID'
    }], `Didn't produce the expected actions for passing a undefined outcomeID to place-trade`);
  });
  it('should handle a null/undefined marketID', () => {
    const { state, mockStore } = mocks.default;
    const testState = { ...state, ...tradeTestState };
    testState.loginAccount = { privateKey: Buffer.from('PRIVATE_KEY', 'utf8') };
    const store = mockStore(testState);
    const SelectMarket = { selectMarket: () => {} };
    sinon.stub(SelectMarket, 'selectMarket', marketID => store.getState().marketsData[marketID]);
    const action = proxyquire('../../../src/modules/trade/actions/place-trade.js', {
      '../../market/selectors/market': SelectMarket
    });
    store.dispatch(action.placeTrade(null, '1'));
    assert.deepEqual(store.getActions(), [], `Didn't fail out as expected for passing a null marketID to place-trade`);
    store.clearActions();
    store.dispatch(action.placeTrade(undefined, '1'));
    assert.deepEqual(store.getActions(), [], `Didn't fail out as expected for passing a undefined marketID to place-trade`);
  });
});
