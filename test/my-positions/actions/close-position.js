// var ClearCallCounts = require('../../tools').ClearCallCounts;
import { describe, it } from 'mocha';
import { assert } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import { ADD_CLOSE_POSITION_TRADE_GROUP } from 'modules/my-positions/actions/add-close-position-trade-group';
import { CLOSE_DIALOG_FAILED } from 'modules/market/constants/close-dialog-status';

describe('modules/my-positions/actions/close-position.js', () => {
  proxyquire.noPreserveCache().noCallThru();

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  describe('closePosition', () => {
    const test = (t) => {
      it(t.description, () => {
        // mock state
        const store = mockStore(t.state);

        // mock methods
        const mockUpdateTradesInProgress = { updateTradesInProgress: () => {} };
        const mockPlaceTrade = { placeTrade: () => {} };
        const mockAddClosePositionTradeGroup = { addClosePositionTradeGroup: () => {} };

        // stubbed methods
        sinon.stub(mockUpdateTradesInProgress, 'updateTradesInProgress', (marketID, outcomeID, side, numShares, limitPrice, maxCost, cb) => (dispatch, getState) => {
          cb();
        });
        sinon.stub(mockPlaceTrade, 'placeTrade', (marketID, outcomeID, doNotMakeOrders, cb) => (dispatch, getState) => {
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
      arguments: {
        marketID: '0xMarketID',
        outcomeID: '0xOutcomeID',
      },
      tradeGroupID: '0x00000TradeGroupID',
      assertions: (actions) => {
        assert.deepEqual(actions, [
          {
            type: ADD_CLOSE_POSITION_TRADE_GROUP,
            marketID: '0xMarketID',
            outcomeID: '0xOutcomeID',
            tradeGroupID: '0x00000TradeGroupID'
          }
        ]);
      }
    });

    test({
      description: `placeTrade returns tradeGroupID`,
      arguments: {
        marketID: '0xMarketID',
        outcomeID: '0xOutcomeID',
      },
      tradeGroupID: '0x00000TradeGroupID',
      placeTradeFails: true,
      assertions: (actions) => {
        assert.deepEqual(actions, [
          {
            type: ADD_CLOSE_POSITION_TRADE_GROUP,
            marketID: '0xMarketID',
            outcomeID: '0xOutcomeID',
            tradeGroupID: CLOSE_DIALOG_FAILED
          }
        ]);
      }
    });
  });

  describe('getBestFillParameters');
});
