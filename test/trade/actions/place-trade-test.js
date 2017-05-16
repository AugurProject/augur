import Augur from 'augur.js';
import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mocks from 'test/mockStore';
import { BUY, tradeTestState, tradeConstOrderBooks } from 'test/trade/constants';

describe(`modules/trade/actions/place-trade.js`, () => {
  proxyquire.noPreserveCache();
  const augur = new Augur();
  const { state, mockStore } = mocks.default;
  const testState = Object.assign({}, state, tradeTestState);
  testState.orderBooks = tradeConstOrderBooks;
  testState.tradesInProgress = {
    testBinaryMarketID: {
      2: {
        side: BUY,
        numShares: '10',
        limitPrice: '0.5',
        totalFee: '0.01',
        totalCost: '5.01',
        tradeActions: [{
          action: 'BID',
          shares: '10',
          gasEth: '0.01450404',
          feeEth: '0.01',
          feePercent: '0.2',
          costEth: '5.01',
          avgPrice: '0.501',
          noFeePrice: '0.5'
        }],
        tradingFeesEth: '0.01',
        gasFeesRealEth: '0.01450404',
        feePercent: '0.199203187250996016'
      }
    }
  };
  testState.loginAccount = {
    address: '0xb0b',
    privateKey: 'this is a private key'
  };
  const store = mockStore(testState);
  const SelectMarket = { selectMarket: () => {} };
  const AugurJS = {
    abi: {
      bignum: () => {},
      format_int256: () => {}
    },
    augur: {
      trading: {
        group: { executeTradingActions: () => {} }
      }
    }
  };
  sinon.stub(SelectMarket, 'selectMarket', marketID => store.getState().marketsData[marketID]);
  sinon.stub(AugurJS.abi, 'bignum', n => augur.abi.bignum(n));
  sinon.stub(AugurJS.abi, 'format_int256', n => augur.abi.format_int256(n));
  sinon.stub(AugurJS.augur.trading.group, 'executeTradingActions', (market, outcomeID, address, getOrderBooks, doNotMakeOrders, tradesInProgress, tradeCommitmentCallback, tradeCommitLockCallback, callback) => {
    store.dispatch({
      type: 'AUGURJS_EXECUTE_TRADING_ACTIONS',
      params: [market, outcomeID, address, doNotMakeOrders, tradesInProgress]
    });
    callback(null);
  });

  const action = proxyquire('../../../src/modules/trade/actions/place-trade.js', {
    '../../../services/augurjs': AugurJS,
    '../../market/selectors/market': SelectMarket
  });

  beforeEach(() => {
    store.clearActions();
  });

  afterEach(() => {
    store.clearActions();
  });

  it('should place a BUY trade for a binary market', () => {
    const tradeToExecute = {
      2: {
        side: BUY,
        numShares: '10',
        limitPrice: '0.5',
        totalFee: '0.01',
        totalCost: '5.01',
        tradeActions: [{
          action: 'BID',
          shares: '10',
          gasEth: '0.01450404',
          feeEth: '0.01',
          feePercent: '0.2',
          costEth: '5.01',
          avgPrice: '0.501',
          noFeePrice: '0.5'
        }],
        tradingFeesEth: '0.01',
        gasFeesRealEth: '0.01450404',
        feePercent: '0.199203187250996016'
      }
    };

    store.dispatch(action.placeTrade('testBinaryMarketID', '2', tradeToExecute));
    // console.log(JSON.stringify(store.getActions(), null, 2));
    assert.deepEqual(store.getActions(), [{
      type: 'AUGURJS_EXECUTE_TRADING_ACTIONS',
      params: [
        { _signer: 'this is a private key' },
        {
          author: 'testAuthor1',
          branchID: '0x010101',
          creationFee: '22.5',
          creationTime: 1475951522,
          cumulativeScale: '1',
          description: 'test binary market?',
          endDate: 1495317600,
          eventID: 'testEventID1',
          isLoadedMarketInfo: true,
          consensus: null,
          makerFee: '0.002',
          maxValue: '2',
          minValue: '1',
          network: '2',
          numOutcomes: 2,
          topic: 'binary',
          tags: ['binary', 'markets', null],
          takerFee: '0.01',
          tradingFee: '0.008',
          tradingPeriod: 8653,
          type: 'binary',
          volume: '3030'
        },
        '2',
        store.getActions()[0].params[3],
        undefined,
      ]
    }, { type: 'UPDATE_TRADE_COMMIT_LOCK', isLocked: null }, {
      type: 'CLEAR_TRADE_IN_PROGRESS',
      marketID: 'testBinaryMarketID'
    }]);
    assert.isFunction(store.getActions()[0].params[3], 'expected the 4th param in the AUGURJS_EXECUTE_TRADING_ACTIONS action to be a function');
  });

  it('should handle a null/undefined outcomeID', () => {
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
    store.dispatch(action.placeTrade(null, '1'));
    assert.deepEqual(store.getActions(), [], `Didn't fail out as expected for passing a null marketID to place-trade`);
    store.clearActions();
    store.dispatch(action.placeTrade(undefined, '1'));
    assert.deepEqual(store.getActions(), [], `Didn't fail out as expected for passing a undefined marketID to place-trade`);
  });
});
