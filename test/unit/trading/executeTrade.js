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

describe("executeTrade.executeShortSell", function() {
    // 7 tests total
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
    test({
        description: 'Should handle empty matchingIDs array',
        marketID: '0xa1',
        outcomeID: '1',
        numShares: '100',
        tradingFees: '0.01',
        tradeGroupID: '0x000abc123',
        address: '0x1',
        orderBooks: { '0xa1': { buy: {}, sell: {} } },
        getTradeIDs: function() {
            callCounts.getTradeIDs++;
            return [];
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
    test({
        description: 'Should handle matchingIDs but 0 numShares passed',
        marketID: '0xa1',
        outcomeID: '1',
        numShares: '0',
        tradingFees: '0.01',
        tradeGroupID: '0x000abc123',
        address: '0x1',
        orderBooks: { '0xa1': { buy: { '0xb1': { amount: '100', price: '0.45' }, '0xb2': { amount: '50', price: '0.35' }}, sell: {} } },
        getTradeIDs: function() {
            callCounts.getTradeIDs++;
            return ['0xb1', '0xb2'];
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
                remainingShares: constants.ZERO,
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
    test({
        description: 'Should handle a matchingID and execute a shortSell',
        marketID: '0xa1',
        outcomeID: '1',
        numShares: '100',
        tradingFees: '0.01',
        tradeGroupID: '0x000abc123',
        address: '0x1',
        orderBooks: { '0xa1': { buy: { '0xb1': { amount: '100', price: '0.4' } }, sell: {} } },
        getTradeIDs: function() {
            callCounts.getTradeIDs++;
            return ['0xb1'];
        },
        tradeCommitmentCallback: function(commit) {
            callCounts.tradeCommitmentCallback++;
            switch(callCounts.tradeCommitmentCallback) {
            case 1:
                assert.deepEqual(commit, { gasFees: '0.045' });
                break;
            case 2:
                assert.deepEqual(commit, {
                  tradeHash: '0x0000000000000000000000000000000000000000000000000000000abc543012',
                  orders: [{ amount: '100', price: '0.4' }],
                  maxValue: "0",
                  maxAmount: '100',
                  remainingEth: "0",
                  remainingShares: '100',
                  filledEth: '0',
                  filledShares: '0',
                  tradingFees: '0.01',
                  gasFees: '0.045'
                });
                break;
            default:
                assert.deepEqual(commit, {
                  filledShares: '100',
                  filledEth: '50',
                  remainingShares: '0',
                  tradingFees: '0.01',
                  gasFees: '0.09'
                });
                break;
            }
        },
        short_sell: function(trade) {
            callCounts.short_sell++;
            assert.equal(trade.max_amount, '100');
            assert.equal(trade.buyer_trade_id, '0xb1');
            assert.equal(trade.sender, '0x1');
            assert.equal(trade.tradeGroupID, '0x000abc123');
            assert.isFunction(trade.onTradeHash);
            assert.isFunction(trade.onCommitSent);
            assert.isFunction(trade.onCommitSuccess);
            assert.isFunction(trade.onCommitFailed);
            assert.isFunction(trade.onNextBlock);
            assert.isFunction(trade.onTradeSent);
            assert.isFunction(trade.onTradeSuccess);
            assert.isFunction(trade.onTradeFailed);
            trade.onCommitSent('1');
            trade.onCommitSuccess({ gasFees: '0.045'});
            trade.onNextBlock();
            trade.onTradeSent();
            trade.onTradeHash('0xabc543012');
            trade.onTradeSuccess({
                unmatchedShares: '0',
                matchedShares: '100',
                cashFromTrade: '50',
                tradingFees: '0.01',
                gasFees: '0.045',
            });
        },
        assertions: function(err, res) {
            assert.isNull(err);
            assert.deepEqual(res, {
                filledEth: new BigNumber('50'),
                filledShares: new BigNumber('100'),
                gasFees: new BigNumber('0.09'),
                remainingShares: new BigNumber('0'),
                tradingFees: new BigNumber('0.01'),
            });
            assert.deepEqual(callCounts, {
                getTradeIDs: 1,
                tradeCommitmentCallback: 3,
                short_sell: 1
            });
        }
    });
    test({
        description: 'Should handle a shortSell that requires 2 orders to fufill the full shortSell',
        marketID: '0xa1',
        outcomeID: '1',
        numShares: '100',
        tradingFees: '0.01',
        tradeGroupID: '0x000abc123',
        address: '0x1',
        orderBooks: {
		'0xa1': {
			buy: {
    				'0xb1': {
    					amount: '50',
    					price: '0.5'
    				},
                    '0xb2': {
    					amount: '50',
    					price: '0.5'
    				},
				},
		      sell: {}
				}
			},
        getTradeIDs: function() {
            callCounts.getTradeIDs++;
            return ['0xb1', '0xb2'];
        },
        tradeCommitmentCallback: function(commit) {
            callCounts.tradeCommitmentCallback++;
            switch(callCounts.tradeCommitmentCallback) {
            case 1:
                assert.deepEqual(commit, { gasFees: '0.045' });
                break;
            case 2:
                assert.deepEqual(commit, {
                  tradeHash: '0x0000000000000000000000000000000000000000000000000000000abc543012',
                  orders: [{ amount: '50', price: '0.5' }],
                  maxValue: "0",
                  maxAmount: '100',
                  remainingEth: "0",
                  remainingShares: '100',
                  filledEth: '0',
                  filledShares: '0',
                  tradingFees: '0.01',
                  gasFees: '0.045'
                });
                break;
            case 3:
                assert.deepEqual(commit, {
                  filledShares: '50',
                  filledEth: '25',
                  remainingShares: '50',
                  tradingFees: '0.01',
                  gasFees: '0.09'
                });
                break;
            case 4:
                assert.deepEqual(commit, { gasFees: '0.135' });
                break;
            case 5:
                assert.deepEqual(commit, {
                  tradeHash: '0x0000000000000000000000000000000000000000000000000000000abc543012',
                  orders: [{ amount: '50', price: '0.5' }],
                  maxValue: "0",
                  maxAmount: '50',
                  remainingEth: "0",
                  remainingShares: '50',
                  filledEth: '25',
                  filledShares: '50',
                  tradingFees: '0.01',
                  gasFees: '0.135'
                });
                break;
            default:
                assert.deepEqual(commit, {
                  filledShares: '100',
                  filledEth: '50',
                  remainingShares: '0',
                  tradingFees: '0.02',
                  gasFees: '0.18'
                });
                break;
            }
        },
        short_sell: function(trade) {
            callCounts.short_sell++;
            assert.oneOf(trade.max_amount, ['100', '50']);
            assert.oneOf(trade.buyer_trade_id, ['0xb1', '0xb2']);
            assert.equal(trade.sender, '0x1');
            assert.equal(trade.tradeGroupID, '0x000abc123');
            assert.isFunction(trade.onTradeHash);
            assert.isFunction(trade.onCommitSent);
            assert.isFunction(trade.onCommitSuccess);
            assert.isFunction(trade.onCommitFailed);
            assert.isFunction(trade.onNextBlock);
            assert.isFunction(trade.onTradeSent);
            assert.isFunction(trade.onTradeSuccess);
            assert.isFunction(trade.onTradeFailed);
            switch (trade.buyer_trade_id) {
            case '0xb1':
                trade.onCommitSent('1');
                trade.onCommitSuccess({ gasFees: '0.045'});
                trade.onNextBlock();
                trade.onTradeSent();
                trade.onTradeHash('0xabc543012');
                trade.onTradeSuccess({
                    unmatchedShares: '50',
                    matchedShares: '50',
                    cashFromTrade: '25',
                    tradingFees: '0.01',
                    gasFees: '0.045',
                });
                break;
            default:
                trade.onCommitSent('1');
                trade.onCommitSuccess({ gasFees: '0.045'});
                trade.onNextBlock();
                trade.onTradeSent();
                trade.onTradeHash('0xabc543012');
                trade.onTradeSuccess({
                    unmatchedShares: undefined,
                    matchedShares: '50',
                    cashFromTrade: '25',
                    tradingFees: '0.01',
                    gasFees: '0.045',
                });
                break;
            }

        },
        assertions: function(err, res) {
            assert.isNull(err);
            assert.deepEqual(res, {
                filledEth: new BigNumber('50'),
                filledShares: new BigNumber('100'),
                gasFees: new BigNumber('0.18'),
                remainingShares: new BigNumber('0'),
                tradingFees: new BigNumber('0.02'),
            });
            assert.deepEqual(callCounts, {
                getTradeIDs: 1,
                tradeCommitmentCallback: 6,
                short_sell: 2
            });
        }
    });
    test({
        description: 'Should handle a shortSell where onCommitFailed is called',
        marketID: '0xa1',
        outcomeID: '1',
        numShares: '100',
        tradingFees: '0.01',
        tradeGroupID: '0x000abc123',
        address: '0x1',
        orderBooks: {
		'0xa1': {
			buy: {
    				'0xb1': {
    					amount: '100',
    					price: '0.4'
    				}
				},
		      sell: {}
				}
			},
        getTradeIDs: function() {
            callCounts.getTradeIDs++;
            return ['0xb1'];
        },
        tradeCommitmentCallback: function(commit) {
            callCounts.tradeCommitmentCallback++;
        },
        short_sell: function(trade) {
            callCounts.short_sell++;
            assert.oneOf(trade.max_amount, ['100', '50']);
            assert.oneOf(trade.buyer_trade_id, ['0xb1', '0xb2']);
            assert.equal(trade.sender, '0x1');
            assert.equal(trade.tradeGroupID, '0x000abc123');
            assert.isFunction(trade.onTradeHash);
            assert.isFunction(trade.onCommitSent);
            assert.isFunction(trade.onCommitSuccess);
            assert.isFunction(trade.onCommitFailed);
            assert.isFunction(trade.onNextBlock);
            assert.isFunction(trade.onTradeSent);
            assert.isFunction(trade.onTradeSuccess);
            assert.isFunction(trade.onTradeFailed);
            trade.onCommitFailed({ error: 999, message: 'Uh-Oh!' });

        },
        assertions: function(err, res) {
            assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
            assert.isUndefined(res);
            assert.deepEqual(callCounts, {
                getTradeIDs: 1,
                tradeCommitmentCallback: 0,
                short_sell: 1
            });
        }
    });
    test({
        description: 'Should handle a shortSell where onFailed is called',
        marketID: '0xa1',
        outcomeID: '1',
        numShares: '100',
        tradingFees: '0.01',
        tradeGroupID: '0x000abc123',
        address: '0x1',
        orderBooks: {
        '0xa1': {
            buy: {
                    '0xb1': {
                        amount: '100',
                        price: '0.4'
                    }
                },
              sell: {}
                }
            },
        getTradeIDs: function() {
            callCounts.getTradeIDs++;
            return ['0xb1'];
        },
        tradeCommitmentCallback: function(commit) {
            callCounts.tradeCommitmentCallback++;
            switch(callCounts.tradeCommitmentCallback) {
            case 1:
                assert.deepEqual(commit, { gasFees: '0.045' });
                break;
            default:
                assert.deepEqual(commit, {
                  tradeHash: '0x0000000000000000000000000000000000000000000000000000000abc543012',
                  orders: [{ amount: '100', price: '0.4' }],
                  maxValue: "0",
                  maxAmount: '100',
                  remainingEth: "0",
                  remainingShares: '100',
                  filledEth: '0',
                  filledShares: '0',
                  tradingFees: '0.01',
                  gasFees: '0.045'
                });
                break;
            }
        },
        short_sell: function(trade) {
            callCounts.short_sell++;
            assert.equal(trade.max_amount, '100');
            assert.equal(trade.buyer_trade_id, '0xb1');
            assert.equal(trade.sender, '0x1');
            assert.equal(trade.tradeGroupID, '0x000abc123');
            assert.isFunction(trade.onTradeHash);
            assert.isFunction(trade.onCommitSent);
            assert.isFunction(trade.onCommitSuccess);
            assert.isFunction(trade.onCommitFailed);
            assert.isFunction(trade.onNextBlock);
            assert.isFunction(trade.onTradeSent);
            assert.isFunction(trade.onTradeSuccess);
            assert.isFunction(trade.onTradeFailed);
            trade.onCommitSent('1');
            trade.onCommitSuccess({ gasFees: '0.045'});
            trade.onNextBlock();
            trade.onTradeSent();
            trade.onTradeHash('0xabc543012');
            trade.onTradeFailed({
                error: 999, message: 'Uh-Oh!'
            });

        },
        assertions: function(err, res) {
            assert.deepEqual(err, {
                error: 999, message: 'Uh-Oh!'
            });
            assert.isUndefined(res);
            assert.deepEqual(callCounts, {
                getTradeIDs: 1,
                tradeCommitmentCallback: 2,
                short_sell: 1
            });
        }
    });
});
