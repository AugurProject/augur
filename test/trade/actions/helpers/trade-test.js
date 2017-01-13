import { describe, it, beforeEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mocks from 'test/mockStore';
import { augur, abi, constants } from 'services/augurjs';
import { tradeTestState, tradeConstOrderBooks } from 'test/trade/constants';
import { ZERO } from 'modules/trade/constants/numbers';

describe('modules/trade/actions/helpers/trade.js', () => {
  proxyquire.noPreserveCache();
  const { state, mockStore } = mocks.default;
  const testState = Object.assign({}, state, tradeTestState);
  testState.orderBooks = tradeConstOrderBooks;
  const store = mockStore(testState);
  const mockAugur = { augur: { ...augur }, abi: { ...abi }, constants: { ...constants } };
  const mockLoadBidAsks = { loadBidsAsks: () => {} };
  sinon.stub(mockLoadBidAsks, 'loadBidsAsks', (marketID, cb) => {
    assert.isString(marketID, `didn't pass a marketID as a string to loadBidsAsks`);
    cb(undefined, store.getState().orderBooks[marketID]);
    return { type: 'LOAD_BIDS_ASKS' };
  });

  const mockCB = sinon.stub();

  describe('Buy Trade Tests', () => {
    sinon.stub(mockAugur.augur, 'getParticipantSharesPurchased', (marketID, userID, outcomeID, cb) => {
      switch (mockAugur.augur.getParticipantSharesPurchased.callCount) {
        case 0:
          cb('5');
          break;
        case 1:
          cb('5');
          break;
        case 9:
          cb('0');
          break;
        case 10:
          cb('20');
          break;
        case 11:
          cb('80');
          break;
        default:
          cb('10');
          break;
      }
    });
    sinon.stub(mockAugur.augur, 'getCashBalance', (takerAddress, cb) => {
      switch (mockAugur.augur.getCashBalance.callCount) {
        case 10:
          cb('9960.0');
          break;
        case 11:
        case 12:
          cb('9800.0');
          break;
        default:
          cb('10000.0');
          break;
      }
    });
    sinon.stub(mockAugur.augur, 'trade', (args) => {
			// if buying numShares must be 0, if selling totalEthWithFee must be 0
      const { onTradeHash, onCommitSent, onCommitSuccess, onCommitFailed, onTradeSent, onTradeSuccess, onTradeFailed } = args;
      onTradeHash('tradeHash1');
      onCommitSent({ hash: 'tradeHash1', callReturn: '1' });
      switch (mockAugur.augur.trade.callCount) {
        case 4:
          onCommitFailed({ error: 'commit failed error', message: 'commit failed error message' });
          break;
        case 5:
          onCommitSuccess({ gasFees: '0.01450404', hash: 'testhash', timestamp: 1500000000 });
          onTradeSent({ hash: 'tradeHash1', callReturn: '1' });
          onTradeFailed({ error: 'trade failed error', message: 'trade failed error message' });
          break;
        case 6:
          onCommitSuccess({ gasFees: '0.01450404', hash: 'testhash', timestamp: 1500000000 });
          onTradeSent({ hash: 'tradeHash1', callReturn: '1' });
          onTradeSuccess({ sharesBought: '20', cashFromTrade: '0', unmatchedShares: '80', unmatchedCash: '160', tradingFees: '0.01', gasFees: '0.01450404', hash: 'testhash', timestamp: 1500000000 });
          break;
        case 7:
          onCommitSuccess({ gasFees: '0.01450404', hash: 'testhash', timestamp: 1500000000 });
          onTradeSent({ hash: 'tradeHash1', callReturn: '1' });
          onTradeSuccess({ sharesBought: '80', cashFromTrade: '0', unmatchedShares: '0', unmatchedCash: '0', tradingFees: '0.01', gasFees: '0.01450404', hash: 'testhash', timestamp: 1500000000 });
          break;
        default:
          onCommitSuccess({ gasFees: '0.01450404', hash: 'testhash', timestamp: 1500000000 });
          onTradeSent({ hash: 'tradeHash1', callReturn: '1' });
          onTradeSuccess({ sharesBought: '10', cashFromTrade: '0', unmatchedShares: '0', unmatchedCash: '0', tradingFees: '0.01', gasFees: '0.01450404', hash: 'testhash', timestamp: 1500000000 });
          break;
      }
    });

    const helper = proxyquire('../../../../src/modules/trade/actions/helpers/trade.js', {
      '../../../bids-asks/actions/load-bids-asks': mockLoadBidAsks,
      '../../../../services/augurjs': mockAugur
    });

    beforeEach(() => {
      store.clearActions();
      mockCB.reset();
    });

    it('should help with a buy trade', () => {
			// marketID, outcomeID, numShares, totalEthWithFee, takerAddress, getTradeIDs, cb
      store.dispatch(helper.trade('testBinaryMarketID', '2', '0', '20.01', '0.02', 0, 'taker1', () => ['orderID1', 'orderID2', 'orderID3'], mockCB));
      assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 3 times as expected`);
    });

    it('should handle a buy trade with js numbers sent in to trade helper', () => {
      store.dispatch(helper.trade('testBinaryMarketID', 2, 0, 10.01, '0.02', 0, 'taker1', () => ['orderID1', 'orderID2', 'orderID3'], mockCB));
      assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 3 times as expected`);
    });

    it('should handle a buy trade with bignums sent in to trade helper', () => {
      store.dispatch(helper.trade('testBinaryMarketID', '2', abi.bignum('0'), abi.bignum('10.01'), '0.02', 0, 'taker1', () => ['orderID1', 'orderID2', 'orderID3'], mockCB));
      assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 3 times as expected`);
    });

    it('should not call augur.trade on a buy trade when no tradeIDs are returned', () => {
      store.dispatch(helper.trade('testBinaryMarketID', '2', '0', '10.01', '0.02', 0, 'taker1', () => [], mockCB));
      assert(mockCB.calledWithExactly(null, {
        remainingEth: abi.bignum('10.01'),
        remainingShares: abi.bignum('0'),
        filledShares: abi.bignum('0'),
        filledEth: abi.bignum('0'),
        tradingFees: abi.bignum('0'),
        gasFees: abi.bignum('0')
      }), `Didn't cancel the trade and return the trade object.`);
      assert(mockCB.calledOnce, `the callback wasn't called 1 time only as expected`);
    });

    it('should not call trade when given a negative remainingEth input', () => {
      store.dispatch(helper.trade('testBinaryMarketID', '2', '0', '-10.01', '0.02', 0, 'taker1', () => ['orderID1', 'orderID2', 'orderID3', 'orderID4', 'orderID5', 'orderID6'], mockCB));
      assert(mockCB.calledWithExactly(null, {
        remainingEth: abi.bignum('-10.01'),
        remainingShares: abi.bignum('0'),
        filledShares: abi.bignum('0'),
        filledEth: abi.bignum('0'),
        tradingFees: abi.bignum('0'),
        gasFees: abi.bignum('0')
      }), `Didn't cancel the trade and return the expected trade object.`);
      assert(mockCB.calledOnce, `the callback wasn't called 1 time only as expected`);
    });

    it('should not call trade when given 0 as an input for both shares and remainingEth', () => {
      store.dispatch(helper.trade('testBinaryMarketID', '2', '0', '0', '0.02', 0, 'taker1', () => ['orderID1', 'orderID2', 'orderID3', 'orderID4', 'orderID5', 'orderID6'], mockCB));
      assert(mockCB.calledOnce, `the callback wasn't called 1 time only as expected`);
    });

    it('Should handle a failed commit', () => {
      store.dispatch(helper.trade('testBinaryMarketID', '2', '0', '20.01', '0.02', 0, 'taker1', () => ['orderID1', 'orderID2', 'orderID3'], mockCB));
      assert(mockCB.calledWithExactly({ error: 'commit failed error', message: 'commit failed error message' }), `Didn't return the expected error object for a failed commit`);
      assert(mockCB.calledOnce, `the callback wasn't called 1 time only as expected`);
    });

    it('Should handle a failed trade', () => {
      store.dispatch(helper.trade('testBinaryMarketID', '2', '0', '20.01', '0.02', 0, 'taker1', () => ['orderID1', 'orderID2', 'orderID3'], mockCB));
      assert(mockCB.calledWithExactly({ error: 'trade failed error', message: 'trade failed error message' }), `Didn't return the expected error object for a failed trade`);
      assert(mockCB.calledOnce, `the callback wasn't called 1 time only as expected`);
    });

    it('should handle null inputs gracefully.', () => {
      store.dispatch(helper.trade('testBinaryMarketID', '2', null, null, '0.02', 0, 'taker1', () => ['orderID1', 'orderID2', 'orderID3'], mockCB));

      assert(mockCB.calledWithExactly(null, {
        remainingEth: abi.bignum('0'),
        remainingShares: abi.bignum('0'),
        filledShares: abi.bignum('0'),
        filledEth: abi.bignum('0'),
        tradingFees: abi.bignum('0'),
        gasFees: abi.bignum('0')
      }), `Didn't return the expected error object for a failed trade`);
      assert(mockCB.calledOnce, `the callback wasn't called 1 time only as expected`);
    });

    it('should be able to handle a large amount of trade ids (100)', () => {
      const tradeIDs = [];
      for (let i = 1; i <= 100; i++) {
        tradeIDs.push('orderID' + i);
      }
      store.dispatch(helper.trade('testBinaryMarketID', '2', '0', '200.02', '0.02', 0, 'taker1', () => tradeIDs, mockCB));
      assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 3 times as expected`);
    });
  });

  describe('Sell Trade Tests', () => {
    const mockAugurSell = { augur: { ...augur }, abi: { ...abi }, constants: { ...constants } };

    sinon.stub(mockAugurSell.augur, 'getParticipantSharesPurchased', (marketID, userID, outcomeID, cb) => cb('10'));

    sinon.stub(mockAugurSell.augur, 'getCashBalance', (takerAddress, cb) => cb('10000.0'));

    sinon.stub(mockAugurSell.augur, 'trade', (args) => {
			// if buying numShares must be 0, if selling totalEthWithFee must be 0
      const { onTradeHash, onCommitSent, onCommitSuccess, onTradeSent, onTradeSuccess } = args;
      onTradeHash('tradeHash1');
      onCommitSent({ hash: 'tradeHash1', callReturn: '1' });
      console.log('trade cc:', mockAugurSell.augur.trade.callCount);
      onCommitSuccess({ gasFees: '0.01450404', hash: 'testhash', timestamp: 1500000000 });
      onTradeSent({ hash: 'tradeHash1', callReturn: '1' });
      onTradeSuccess({ sharesBought: '10', cashFromTrade: '0', unmatchedShares: '0', unmatchedCash: '0', tradingFees: '0.01', gasFees: '0.01450404', hash: 'testhash', timestamp: 1500000000 });
    });

    const helper = proxyquire('../../../../src/modules/trade/actions/helpers/trade.js', {
      '../../../bids-asks/actions/load-bids-asks': mockLoadBidAsks,
      '../../../../services/augurjs': mockAugurSell
    });

    beforeEach(() => {
      store.clearActions();
      mockCB.reset();
    });

    it('should help with a sell trade', () => {
			// marketID, outcomeID, numShares, totalEthWithFee, takerAddress, getTradeIDs, cb
      store.dispatch(helper.trade('testBinaryMarketID', '2', '10', '0', '0.02', 0, 'taker1', () => ['orderID1', 'orderID2', 'orderID3'], mockCB));
      assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 3 times as expected`);
    });

    it('should not call trade when given a negative numShares input', () => {
      store.dispatch(helper.trade('testBinaryMarketID', '2', '-10', '0', '0.02', 0, 'taker1', () => ['orderID1', 'orderID2', 'orderID3', 'orderID4', 'orderID5', 'orderID6'], mockCB));
      assert(mockCB.calledWithExactly(null, {
        remainingEth: abi.bignum('0'),
        remainingShares: abi.bignum('-10'),
        filledShares: abi.bignum('0'),
        filledEth: abi.bignum('0'),
        tradingFees: abi.bignum('0'),
        gasFees: abi.bignum('0')
      }), `Didn't cancel the trade and return the expected trade object.`);
      assert(mockCB.calledOnce, `the callback wasn't called 1 time only as expected`);
    });

    it('should handle a sell trade with JS Numbers', () => {
			// marketID, outcomeID, numShares, totalEthWithFee, takerAddress, getTradeIDs, cb
      store.dispatch(helper.trade('testBinaryMarketID', '2', 10, 0, '0.02', 0, 'taker1', () => ['orderID1', 'orderID2', 'orderID3'], mockCB));
      assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 3 times as expected`);
    });

    it('should handle a sell trade with Big Number', () => {
			// marketID, outcomeID, numShares, totalEthWithFee, takerAddress, getTradeIDs, cb
      store.dispatch(helper.trade('testBinaryMarketID', '2', abi.bignum('10'), abi.bignum('0'), '0.02', 0, 'taker1', () => ['orderID1', 'orderID2', 'orderID3'], mockCB));
      assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 3 times as expected`);
    });

    it('should handle a sell trade with no tradeIDs available', () => {
			// marketID, outcomeID, numShares, totalEthWithFee, takerAddress, getTradeIDs, cb
      store.dispatch(helper.trade('testBinaryMarketID', '2', '10', '0', '0.02', 0, 'taker1', () => [], mockCB));
      assert(mockCB.calledWithExactly(null, {
        remainingEth: ZERO,
        remainingShares: abi.bignum(10),
        filledShares: ZERO,
        filledEth: ZERO,
        tradingFees: ZERO,
        gasFees: ZERO
      }), `Didn't call the callback with the expected values`);
      assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 3 times as expected`);
      assert.deepEqual(store.getActions(), [], `Did dispatch actions when it shouldn't have`);
    });

    it('should handle a sell trade with 99 trade ids available', () => {
      const tradeIDs = [];
      for (let i = 1; i <= 99; i++) {
        tradeIDs.push('orderID' + i);
      }
			// marketID, outcomeID, numShares, totalEthWithFee, takerAddress, getTradeIDs, cb
      store.dispatch(helper.trade('testBinaryMarketID', '2', '30', '0', '0.02', 0, 'taker1', () => tradeIDs, mockCB));
      assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 3 times as expected`);
    });

    it('should handle a sell trade with 4 trade ids available', () => {
      const tradeIDs = [];
      for (let i = 1; i <= 4; i++) {
        tradeIDs.push('orderID' + i);
      }

			// marketID, outcomeID, numShares, totalEthWithFee, takerAddress, getTradeIDs, cb
      store.dispatch(helper.trade('testBinaryMarketID', '2', '40', '0', '0.02', 0, 'taker1', () => tradeIDs, mockCB));
      assert.deepEqual(mockCB.callCount, 1, `Didn't call the callback 3 times as expected`);
    });
  });
});
