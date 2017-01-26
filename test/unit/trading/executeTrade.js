"use strict";

var assert = require('chai').assert;
var augur = require('../../../src');
var noop = require("../../../src/utilities").noop;
var constants = require("../../../src/constants");
var BigNumber = require("bignumber.js");
var ClearCallCounts = require('../../tools').ClearCallCounts;

describe.skip("executeTrade.executeTrade", function() {
    // ? tests total
});

describe("executeTrade.xecuteShortSell", function() {
    // ? tests total
    var short_sell = augur.short_sell;
    var callCounts = {
        getTradeIDs: 0,
        tradeCommitmentCallback: 0,
        short_sell: 0
    };
    afterEach(function() {
        ClearCallCounts(callCounts);
        augur.short_sell = short_sell;
    });
    var test = function(t) {
        it(t.description, function(done) {
            augur.short_sell = t.short_sell;

            augur.executeShortSell(t.marketID, t.outcomeID, t.numShares, t.tradingFees, t.tradeGroupID, t.address, t.orderBooks, t.getTradeIDs, t.tradeCommitmentCallback, function(err, res) {
                t.assertions(err, res);
                done();
            });
        });
    };
    test({
        description: 'Should handle no matchingIDs',
        marketID: '0xa1',
        outcomeID: '1',
        numShares: '100',
        tradingFees: '0.01',
        tradeGroupID: '0x000abc123',
        address: '0x1',
        orderBooks: { '0xa1': { buy: {}, sell: {} } },
        getTradeIDs: function() {
            callCounts.getTradeIDs++;
            return undefined;
        },
        tradeCommitmentCallback: function(commit) {
            callCounts.tradeCommitmentCallback++;
        },
        short_sell: function() {
            callCounts.short_sell++;
        },
        assertions: function(err, res) {
            assert.isNull(err);
            assert.deepEqual(res, {
                remainingShares: new BigNumber('100'),
                filledShares: constants.ZERO,
                filledEth: constants.ZERO,
                tradingFees: constants.ZERO,
                gasFees: constants.ZERO,
            });
            assert.deepEqual(callCounts, {
                getTradeIDs: 1,
                tradeCommitmentCallback: 0,
                short_sell: 0
            });
        }
    });
});
