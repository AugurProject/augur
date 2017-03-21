import { describe, it } from 'mocha';
import { assert } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import BigNumber from 'bignumber.js';

import { getBestFill } from 'modules/my-positions/actions/close-position';

import { ADD_CLOSE_POSITION_TRADE_GROUP } from 'modules/my-positions/actions/add-close-position-trade-group';
import { CLOSE_DIALOG_FAILED } from 'modules/market/constants/close-dialog-status';
import { BUY, SELL } from 'modules/trade/constants/types';

describe('modules/my-positions/actions/close-position.js', () => {
  describe('closePosition', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    const test = (t) => {
      it(t.description, () => {
        // mock store
        const store = mockStore(t.state);

        // mock methods
        const mockUpdateTradesInProgress = { updateTradesInProgress: () => {} };
        const mockPlaceTrade = { placeTrade: () => {} };
        const mockAddClosePositionTradeGroup = { addClosePositionTradeGroup: () => {} };

        // stubbed methods
        sinon.stub(mockUpdateTradesInProgress, 'updateTradesInProgress', (marketID, outcomeID, side, numShares, limitPrice, maxCost, cb) => (dispatch, getState) => {
          cb();
        });
        sinon.stub(mockPlaceTrade, 'placeTrade', (marketID, outcomeID, tradesInProgress, doNotMakeOrders, cb) => (dispatch, getState) => {
          if (t.placeTradeFails) {
            cb(true);
          } else {
            cb(null, t.tradeGroupID);
          }
        });
        sinon.stub(mockAddClosePositionTradeGroup, 'addClosePositionTradeGroup', (marketID, outcomeID, tradeGroupID) => (dispatch, getState) => {});

        // proxied action
        const action = proxyquire('../../../src/modules/my-positions/actions/close-position.js', {
          '../../trade/actions/update-trades-in-progress': mockUpdateTradesInProgress,
          '../../trade/actions/place-trade': mockPlaceTrade,
          '../../my-positions/actions/add-close-position-trade-group': mockAddClosePositionTradeGroup
        });

        store.dispatch(action.closePosition(t.arguments.marketID, t.arguments.outcomeID));
        t.assertions(store.getActions());
        store.clearActions();
      });
    };

    test({
      description: `placeTrade returns tradeGroupID`,
      state: {
        tradesInProgress: {
          '0xMarketID': {}
        }
      },
      arguments: {
        marketID: '0xMarketID',
        outcomeID: '1',
      },
      tradeGroupID: '0x00000TradeGroupID',
      assertions: (actions) => {
        assert.deepEqual(actions, [
          {
            type: ADD_CLOSE_POSITION_TRADE_GROUP,
            marketID: '0xMarketID',
            outcomeID: '1',
            tradeGroupID: '0x00000TradeGroupID'
          }
        ]);
      }
    });

    test({
      description: `placeTrade fails`,
      state: {
        tradesInProgress: {
          '0xMarketID': {}
        }
      },
      arguments: {
        marketID: '0xMarketID',
        outcomeID: '1',
      },
      tradeGroupID: '0x00000TradeGroupID',
      placeTradeFails: true,
      assertions: (actions) => {
        assert.deepEqual(actions, [
          {
            type: ADD_CLOSE_POSITION_TRADE_GROUP,
            marketID: '0xMarketID',
            outcomeID: '1',
            tradeGroupID: CLOSE_DIALOG_FAILED
          }
        ]);
      }
    });
  });

  describe('getBestFill', () => {
    const test = (t) => {
      it(t.description, () => {
        const bestFill = getBestFill(t.state.orderBooks, t.arguments.side, t.arguments.shares, t.arguments.marketID, t.arguments.outcomeID);

        t.assertions(bestFill);
      });
    };

    test({
      description: `-1 share position, empty order book`,
      state: {
        orderBooks: {}
      },
      arguments: {
        side: SELL,
        shares: new BigNumber(-1).absoluteValue(),
        marketID: '0xMarketID1',
        outcomeID: '1'
      },
      assertions: (bestFill) => {
        assert.deepEqual(bestFill, {
          amountOfShares: new BigNumber(0),
          price: new BigNumber(0)
        });
      }
    });

    test({
      description: `1 share position, empty order book`,
      state: {
        orderBooks: {}
      },
      arguments: {
        side: BUY,
        shares: new BigNumber(1).absoluteValue(),
        marketID: '0xMarketID1',
        outcomeID: '1'
      },
      assertions: (bestFill) => {
        assert.deepEqual(bestFill, {
          amountOfShares: new BigNumber(0),
          price: new BigNumber(0)
        });
      }
    });

    test({
      description: `10 shares position, sufficent order book depth to fully close`,
      state: {
        orderBooks: {
          '0xMarketID1': {
            [BUY]: {
              '0xOrderID1': {
                amount: '2',
                fullPrecisionPrice: '0.11',
                outcome: '1'
              },
              '0xOrderID2': {
                amount: '8',
                fullPrecisionPrice: '0.2',
                outcome: '1'
              }
            }
          }
        }
      },
      arguments: {
        side: BUY,
        shares: new BigNumber(10).absoluteValue(),
        marketID: '0xMarketID1',
        outcomeID: '1'
      },
      assertions: (bestFill) => {
        assert.deepEqual(bestFill, {
          amountOfShares: new BigNumber(10),
          price: new BigNumber(0.11)
        });
      }
    });

    test({
      description: `10 shares position, sufficent order book depth for a partial close`,
      state: {
        orderBooks: {
          '0xMarketID1': {
            [BUY]: {
              '0xOrderID1': {
                amount: '2',
                fullPrecisionPrice: '0.11',
                outcome: '1'
              },
              '0xOrderID2': {
                amount: '1',
                fullPrecisionPrice: '0.10',
                outcome: '1'
              }
            }
          }
        }
      },
      arguments: {
        side: BUY,
        shares: new BigNumber(10).absoluteValue(),
        marketID: '0xMarketID1',
        outcomeID: '1'
      },
      assertions: (bestFill) => {
        assert.deepEqual(bestFill, {
          amountOfShares: new BigNumber(3),
          price: new BigNumber(0.10)
        });
      }
    });

    test({
      description: `-10 shares position, sufficent order book depth to fully close`,
      state: {
        orderBooks: {
          '0xMarketID1': {
            [SELL]: {
              '0xOrderID1': {
                amount: '2',
                fullPrecisionPrice: '0.11',
                outcome: '1'
              },
              '0xOrderID2': {
                amount: '8',
                fullPrecisionPrice: '0.2',
                outcome: '1'
              }
            }
          }
        }
      },
      arguments: {
        side: SELL,
        shares: new BigNumber(-10).absoluteValue(),
        marketID: '0xMarketID1',
        outcomeID: '1'
      },
      assertions: (bestFill) => {
        assert.deepEqual(bestFill, {
          amountOfShares: new BigNumber(10),
          price: new BigNumber(0.2)
        });
      }
    });

    test({
      description: `-10 shares position, sufficent order book depth for a partial close`,
      state: {
        orderBooks: {
          '0xMarketID1': {
            [SELL]: {
              '0xOrderID1': {
                amount: '2',
                fullPrecisionPrice: '0.11',
                outcome: '1'
              },
              '0xOrderID2': {
                amount: '1',
                fullPrecisionPrice: '0.10',
                outcome: '1'
              }
            }
          }
        }
      },
      arguments: {
        side: SELL,
        shares: new BigNumber(-10).absoluteValue(),
        marketID: '0xMarketID1',
        outcomeID: '1'
      },
      assertions: (bestFill) => {
        assert.deepEqual(bestFill, {
          amountOfShares: new BigNumber(3),
          price: new BigNumber(0.11)
        });
      }
    });
  });
});


// console.log('bestFill -- ', bestFill.amountOfShares.toNumber(), bestFill.price.toNumber());
