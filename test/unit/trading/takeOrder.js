"use strict";

var assert = require('chai').assert;
var augur = require('../../../src');

describe("takeOrder.placeBuy", function() {
    // ? tests total
    var executeTrade = augur.executeTrade;
    var placeBid = augur.placeBid;
    var callCounts = {
        executeTrade: 0,
        placeBid: 0,
        tradeCommitmentCallback: 0,
        tradeCommitLockCallback: 0
    };
    // a function to quickly reset the callCounts object.
    function ClearCallCounts() {
        var keys = Object.keys(callCounts);
        for (keys in callCounts) {
            callCounts[keys] = 0;
        }
    };
    afterEach(function() {
        ClearCallCounts();
        augur.executeTrade = executeTrade;
        augur.placeBid = placeBid;
    });
    var test = function(t) {
        it(t.description, function() {
            augur.executeTrade = t.executeTrade;
            augur.placeBid = t.placeBid;

            augur.placeBuy(t.market, t.outcomeID, t.numShares, t.limitPrice, t.address, t.totalCost, t.tradingFees, t.orderBooks, t.doNotMakeOrders, t.tradeGroupID, t.tradeCommitmentCallback, t.tradeCommitLockCallback);

            t.assertions();
        });
    };
    test({
        description: 'Should return if an error is returned from executeTrade',
        market: { id: '0xa1' },
        outcomeID: '1',
        numShares: '100',
        limitPrice: '0.5',
        address: '0x1',
        totalCost: '51',
        tradingFees: '0.01',
        orderBooks: { '0xa1': { buy: {}, sell: {} }},
        doNotMakeOrders: true,
        tradeGroupID: '0x000abc123',
        tradeCommitmentCallback: function() {
            callCounts.tradeCommitmentCallback++;
        },
        tradeCommitLockCallback: function(lock) {
            callCounts.tradeCommitLockCallback++;
            switch(callCounts.tradeCommitLockCallback) {
            case 2:
                assert.isFalse(lock);
                break;
            default:
                assert.isTrue(lock);
                break;
            }
        },
        executeTrade: function(marketID, outcomeID, numShares, totalEthWithFee, tradingFees, tradeGroupID, address, orderBooks, getTradeIDs, tradeCommitmentCallback, cb) {
            callCounts.executeTrade++;
            assert.equal(marketID, '0xa1');
            assert.equal(outcomeID, '1');
            assert.equal(numShares, 0);
            assert.equal(totalEthWithFee, '51');
            assert.equal(tradingFees, '0.01');
            assert.equal(tradeGroupID, '0x000abc123');
            assert.equal(address, '0x1');
            assert.deepEqual(orderBooks, { '0xa1': { buy: {}, sell: {} }});
            assert.isFunction(getTradeIDs);
            assert.isFunction(tradeCommitmentCallback);
            // return an error in this case
            cb({ error: 999, message: 'Uh-Oh!' }, undefined);
        },
        placeBid: function() {
            callCounts.placeBid++;
        },
        assertions: function() {
            assert.deepEqual(callCounts, {
                executeTrade: 1,
                placeBid: 0,
                tradeCommitmentCallback: 0,
                tradeCommitLockCallback: 2
            });
        }
    });
});
// import { describe, it } from 'mocha';
// import { assert } from 'chai';
// import proxyquire from 'proxyquire';
// import sinon from 'sinon';
// import configureMockStore from 'redux-mock-store';
// import thunk from 'redux-thunk';

// describe(`modules/trade/actions/take-order.js`, () => {
//   proxyquire.noPreserveCache();
//   const middlewares = [thunk];
//   const mockStore = configureMockStore(middlewares);
//   const test = (t) => {
//     it(t.description, () => {
//       const store = mockStore(t.state);
//       const AugurJS = {
//         augur: {
//           getParticipantSharesPurchased: () => {}
//         }
//       };
//       const UpdateTradeCommitment = {};
//       const Trade = {};
//       const ShortSell = {};
//       const LoadBidsAsks = {};
//       const MakeOrder = {};
//       const action = proxyquire('../../../src/modules/trade/actions/take-order.js', {
//         '../../../services/augurjs': AugurJS,
//         '../../trade/actions/update-trade-commitment': UpdateTradeCommitment,
//         '../../trade/actions/helpers/trade': Trade,
//         '../../trade/actions/helpers/short-sell': ShortSell,
//         '../../bids-asks/actions/load-bids-asks': LoadBidsAsks,
//         '../../trade/actions/make-order': MakeOrder
//       });
//       sinon.stub(AugurJS.augur, 'getParticipantSharesPurchased', () => {});
//       store.dispatch(action.placeBuy(t.params.market, t.params.outcomeID, t.params.numShares, t.params.limitPrice, t.params.totalCost, t.params.tradingFees, t.params.tradeGroupID));
//       t.assertions(store.getActions());
//       store.clearActions();
//     });
//   };
//   test({
//     description: 'place buy',
//     params: {
//       market: '0xa1',
//       outcomeID: '2',
//       numShares: '5',
//       limitPrice: '0.75',
//       totalCost: '10',
//       tradingFees: '0.01',
//       tradeGroupID: null
//     },
//     state: {
//       loginAccount: {
//         address: '0x0000000000000000000000000000000000000b0b'
//       }
//     },
//     assertions: (actions) => {
//       assert.deepEqual(actions, []);
//     }
//   });
// });
