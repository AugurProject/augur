"use strict";

var assert = require('chai').assert;
var augur = require('../../../src');
var noop = require("../../../src/utilities").noop;
var constants = require("../../../src/constants");
var BigNumber = require("bignumber.js");
var ClearCallCounts = require('../../tools').ClearCallCounts;
// 15 tests total

describe("executeTrade.executeTrade", function() {
    // 8 tests total
    var getParticipantSharesPurchased = augur.getParticipantSharesPurchased;
    var getCashBalance = augur.getCashBalance;
    var trade = augur.trade;
    var callCounts = {
        getParticipantSharesPurchased: 0,
        getCashBalance: 0,
        trade: 0,
        getTradeIDs: 0,
        tradeCommitmentCallback: 0
    }
    afterEach(function() {
        ClearCallCounts(callCounts);
        augur.getParticipantSharesPurchased = getParticipantSharesPurchased;
        augur.getCashBalance = getCashBalance;
        augur.trade = trade;
    });
    var test = function(t) {
        it(t.description, function(done) {
            augur.getParticipantSharesPurchased = t.getParticipantSharesPurchased;
            augur.getCashBalance = t.getCashBalance;
            augur.trade = t.trade;

            augur.executeTrade(t.marketID, t.outcomeID, t.numShares, t.totalEthWithFee, t.tradingFees, t.tradeGroupID, t.address, t.orderBooks, t.getTradeIDs, t.tradeCommitmentCallback, function(err, res) {
                t.assertions(err, res);
                done();
            });
        });
    };
    test({
        description: 'Should handle a buy trade that throws a commit failure error',
        marketID: '0xa1',
        outcomeID: '2',
        numShares: '0',
        totalEthWithFee: '51',
        tradingFees: '0.01',
        tradeGroupID: '0x000abc123',
        address: '0x1',
        orderBooks: {
        	'0xa1': {
        		buy: {},
        		sell: {
        			'0xb1': { amount: '50', limitPrice: '0.5' },
        			'0xb2': { amount: '30', limitPrice: '0.5' },
        			'0xb3': { amount: '20', limitPrice: '0.5' },
        		}
        	}
        },
        getTradeIDs: function() {
            callCounts.getTradeIDs++;
            return ['0xb1', '0xb2', '0xb3'];
        },
        tradeCommitmentCallback: function(commit) {
            callCounts.tradeCommitmentCallback++;
            assert.deepEqual(commit, {
            	tradeHash: '0x0000000000000000000000000000000000000000000000000000000abc543012',
            	orders: [
                    { amount: '50', limitPrice: '0.5' },
            		{ amount: '30', limitPrice: '0.5' },
            		{ amount: '20', limitPrice: '0.5' }
            	],
            	maxValue: '51',
            	maxAmount: '0',
            	remainingEth: '51',
            	remainingShares: '0',
            	filledEth: '0',
            	filledShares: '0',
            	tradingFees: '0.01',
            	gasFees: '0'
            });
        },
        getParticipantSharesPurchased: function(marketID, address, outcomeID, cb) {
            callCounts.getParticipantSharesPurchased++;
            assert.equal(marketID, '0xa1');
            assert.equal(address, '0x1');
            assert.equal(outcomeID, '2');
            cb('0');
        },
        getCashBalance: function(address, cb) {
            callCounts.getCashBalance++;
            assert.equal(address, '0x1');
            cb('1000');
        },
        trade: function(trade) {
            callCounts.trade++;
            assert.equal(trade.max_value, '51');
            assert.equal(trade.max_amount, '0');
            assert.deepEqual(trade.trade_ids, ['0xb1', '0xb2', '0xb3']);
            assert.equal(trade.tradeGroupID, '0x000abc123');
            assert.equal(trade.sender, '0x1');
            assert.isFunction(trade.onTradeHash);
            assert.isFunction(trade.onCommitSent);
            assert.isFunction(trade.onCommitSuccess);
            assert.isFunction(trade.onCommitFailed);
            assert.isFunction(trade.onNextBlock);
            assert.isFunction(trade.onTradeSent);
            assert.isFunction(trade.onTradeSuccess);
            assert.isFunction(trade.onTradeFailed);
            trade.onTradeHash('0xabc543012');
            trade.onCommitSent('1');
            trade.onCommitFailed({ error: 999, message: 'Uh-Oh!' });
        },
        assertions: function(err, res) {
            assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
            assert.isUndefined(res);
            assert.deepEqual(callCounts, {
                getParticipantSharesPurchased: 1,
                getCashBalance: 1,
                trade: 1,
                getTradeIDs: 1,
                tradeCommitmentCallback: 1
            });
        }
    });
    test({
        description: 'Should handle a buy trade that throws a trade failure error',
        marketID: '0xa1',
        outcomeID: '2',
        numShares: '0',
        totalEthWithFee: '51',
        tradingFees: '0.01',
        tradeGroupID: '0x000abc123',
        address: '0x1',
        orderBooks: {
        	'0xa1': {
        		buy: {},
        		sell: {
        			'0xb1': { amount: '50', limitPrice: '0.5' },
        			'0xb2': { amount: '30', limitPrice: '0.5' },
        			'0xb3': { amount: '20', limitPrice: '0.5' },
        		}
        	}
        },
        getTradeIDs: function() {
            callCounts.getTradeIDs++;
            return ['0xb1', '0xb2', '0xb3'];
        },
        tradeCommitmentCallback: function(commit) {
            callCounts.tradeCommitmentCallback++;
            switch(callCounts.tradeCommitmentCallback) {
            case 1:
                assert.deepEqual(commit, {
                    tradeHash: '0x0000000000000000000000000000000000000000000000000000000abc543012',
                    orders: [
                        { amount: '50', limitPrice: '0.5' },
                        { amount: '30', limitPrice: '0.5' },
                        { amount: '20', limitPrice: '0.5' }
                    ],
                    maxValue: '51',
                    maxAmount: '0',
                    remainingEth: '51',
                    remainingShares: '0',
                    filledEth: '0',
                    filledShares: '0',
                    tradingFees: '0.01',
                    gasFees: '0'
                });
                break;
            default:
                assert.deepEqual(commit, { gasFees: '0.045' });
                break;
            }

        },
        getParticipantSharesPurchased: function(marketID, address, outcomeID, cb) {
            callCounts.getParticipantSharesPurchased++;
            assert.equal(marketID, '0xa1');
            assert.equal(address, '0x1');
            assert.equal(outcomeID, '2');
            cb('0');
        },
        getCashBalance: function(address, cb) {
            callCounts.getCashBalance++;
            assert.equal(address, '0x1');
            cb('1000');
        },
        trade: function(trade) {
            callCounts.trade++;
            assert.equal(trade.max_value, '51');
            assert.equal(trade.max_amount, '0');
            assert.deepEqual(trade.trade_ids, ['0xb1', '0xb2', '0xb3']);
            assert.equal(trade.tradeGroupID, '0x000abc123');
            assert.equal(trade.sender, '0x1');
            assert.isFunction(trade.onTradeHash);
            assert.isFunction(trade.onCommitSent);
            assert.isFunction(trade.onCommitSuccess);
            assert.isFunction(trade.onCommitFailed);
            assert.isFunction(trade.onNextBlock);
            assert.isFunction(trade.onTradeSent);
            assert.isFunction(trade.onTradeSuccess);
            assert.isFunction(trade.onTradeFailed);
            trade.onTradeHash('0xabc543012');
            trade.onCommitSent('1');
            trade.onCommitSuccess({ gasFees: new BigNumber('0.045') });
            trade.onNextBlock('1');
            trade.onTradeSent('1');
            trade.onTradeFailed({ error: 999, message: 'Uh-Oh!' });
        },
        assertions: function(err, res) {
            assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
            assert.isUndefined(res);
            assert.deepEqual(callCounts, {
                getParticipantSharesPurchased: 1,
                getCashBalance: 1,
                trade: 1,
                getTradeIDs: 1,
                tradeCommitmentCallback: 2
            });
        }
    });
    test({
        description: 'Should handle a buy trade that needs 3 sell trade orders to fill',
        marketID: '0xa1',
        outcomeID: '2',
        numShares: '0',
        totalEthWithFee: '51',
        tradingFees: '0.01',
        tradeGroupID: '0x000abc123',
        address: '0x1',
        orderBooks: {
        	'0xa1': {
        		buy: {},
        		sell: {
        			'0xb1': { amount: '50', limitPrice: '0.5' },
        			'0xb2': { amount: '30', limitPrice: '0.5' },
        			'0xb3': { amount: '20', limitPrice: '0.5' },
        		}
        	}
        },
        getTradeIDs: function() {
            callCounts.getTradeIDs++;
            return ['0xb1', '0xb2', '0xb3'];
        },
        tradeCommitmentCallback: function(commit) {
            callCounts.tradeCommitmentCallback++;
            switch(callCounts.tradeCommitmentCallback) {
            case 1:
                assert.deepEqual(commit, {
                    tradeHash: '0x0000000000000000000000000000000000000000000000000000000abc543012',
                    orders: [
                        { amount: '50', limitPrice: '0.5' },
                        { amount: '30', limitPrice: '0.5' },
                        { amount: '20', limitPrice: '0.5' }
                    ],
                    maxValue: '51',
                    maxAmount: '0',
                    remainingEth: '51',
                    remainingShares: '0',
                    filledEth: '0',
                    filledShares: '0',
                    tradingFees: '0.01',
                    gasFees: '0'
                });
                break;
            case 2:
                assert.deepEqual(commit, { gasFees: '0.045' });
                break;
            case 3:
                assert.deepEqual(commit, {
                    filledShares: '50',
                    filledEth: '25',
                    remainingShares: '0',
                    remainingEth: '25.5',
                    tradingFees: '0.5',
                    gasFees: '0.09',
                });
                break;
            case 4:
                assert.deepEqual(commit, {
                    tradeHash: '0x0000000000000000000000000000000000000000000000000000000abc543012',
                    orders: [
                        { amount: '50', limitPrice: '0.5' },
                        { amount: '30', limitPrice: '0.5' },
                        { amount: '20', limitPrice: '0.5' }
                    ],
                    maxValue: '25.5',
                    maxAmount: '0',
                    remainingEth: '25.5',
                    remainingShares: '0',
                    filledEth: '25',
                    filledShares: '50',
                    tradingFees: '0.5',
                    gasFees: '0.09'
                });
                break;
            case 5:
                assert.deepEqual(commit, { gasFees: '0.135' });
                break;
            case 6:
                assert.deepEqual(commit, {
                    filledShares: '80',
                    filledEth: '40',
                    remainingShares: '0',
                    remainingEth: '10.2',
                    tradingFees: '0.8',
                    gasFees: '0.18',
                });
                break;
            case 7:
                assert.deepEqual(commit, {
                    tradeHash: '0x0000000000000000000000000000000000000000000000000000000abc543012',
                    orders: [
                        { amount: '50', limitPrice: '0.5' },
                        { amount: '30', limitPrice: '0.5' },
                        { amount: '20', limitPrice: '0.5' }
                    ],
                    maxValue: '10.2',
                    maxAmount: '0',
                    remainingEth: '10.2',
                    remainingShares: '0',
                    filledEth: '40',
                    filledShares: '80',
                    tradingFees: '0.8',
                    gasFees: '0.18'
                });
                break;
            case 8:
                assert.deepEqual(commit, { gasFees: '0.225' });
                break;
            case 9:
                assert.deepEqual(commit, {
                    filledShares: '100',
                    filledEth: '50',
                    remainingShares: '0',
                    remainingEth: '0',
                    tradingFees: '1',
                    gasFees: '0.27',
                });
                break;
            default:
                assert.isTrue(false, 'should not call tradeCommitmentCallback more than 9 times');
                break;
            }
        },
        getParticipantSharesPurchased: function(marketID, address, outcomeID, cb) {
            callCounts.getParticipantSharesPurchased++;
            assert.equal(marketID, '0xa1');
            assert.equal(address, '0x1');
            assert.equal(outcomeID, '2');
            switch(callCounts.getParticipantSharesPurchased) {
            case 6:
                cb('100');
                break;
            case 4:
            case 5:
                cb('80')
                break;
            case 3:
            case 2:
                cb('50');
                break;
            default:
                cb('0');
                break;
            }
        },
        getCashBalance: function(address, cb) {
            callCounts.getCashBalance++;
            assert.equal(address, '0x1');
            switch(callCounts.getCashBalance) {
            case 6:
                cb('949');
                break;
            case 4:
            case 5:
                cb('959.2');
                break;
            case 3:
            case 2:
                cb('974.5');
                break;
            default:
                cb('1000');
                break;
            }
        },
        trade: function(trade) {
            callCounts.trade++;
            assert.deepEqual(trade.trade_ids, ['0xb1', '0xb2', '0xb3']);
            assert.equal(trade.tradeGroupID, '0x000abc123');
            assert.equal(trade.sender, '0x1');
            assert.isFunction(trade.onTradeHash);
            assert.isFunction(trade.onCommitSent);
            assert.isFunction(trade.onCommitSuccess);
            assert.isFunction(trade.onCommitFailed);
            assert.isFunction(trade.onNextBlock);
            assert.isFunction(trade.onTradeSent);
            assert.isFunction(trade.onTradeSuccess);
            assert.isFunction(trade.onTradeFailed);
            trade.onTradeHash('0xabc543012');
            trade.onCommitSent('1');
            trade.onCommitSuccess({ gasFees: new BigNumber('0.045') });
            trade.onNextBlock('1');
            trade.onTradeSent('1');
            switch(callCounts.trade) {
            case 3:
                assert.equal(trade.max_value, '10.2');
                assert.equal(trade.max_amount, '0');
                trade.onTradeSuccess({
                    sharesBought: '20',
                    cashFromTrade: '10',
                    unmatchedShares: '0',
                    unmatchedCash: '0',
                    tradingFees: '0.2',
                    gasFees: '0.045'
                });
                break;
            case 2:
                assert.equal(trade.max_value, '25.5');
                assert.equal(trade.max_amount, '0');
                trade.onTradeSuccess({
                    sharesBought: '30',
                    cashFromTrade: '15',
                    unmatchedShares: '0',
                    unmatchedCash: '10.2',
                    tradingFees: '0.3',
                    gasFees: '0.045'
                });
                break;
            default:
                assert.equal(trade.max_value, '51');
                assert.equal(trade.max_amount, '0');
                trade.onTradeSuccess({
                    sharesBought: '50',
                    cashFromTrade: '25',
                    unmatchedShares: '0',
                    unmatchedCash: '25.5',
                    tradingFees: '0.5',
                    gasFees: '0.045'
                });
                break;
            }

        },
        assertions: function(err, res) {
            assert.isNull(err);
            assert.deepEqual(res, {
                remainingEth: new BigNumber('0'),
                remainingShares: new BigNumber('0'),
                filledShares: new BigNumber('100'),
                filledEth: new BigNumber('50'),
                tradingFees: new BigNumber('1'),
                gasFees: new BigNumber('.27'),
            });
            assert.deepEqual(callCounts, {
                getParticipantSharesPurchased: 6,
                getCashBalance: 6,
                trade: 3,
                getTradeIDs: 4,
                tradeCommitmentCallback: 9
            });
        }
    });
    test({
        description: 'Should handle a sell trade that needs 2 buy trade orders to fill',
        marketID: '0xa1',
        outcomeID: '2',
        numShares: '100',
        totalEthWithFee: '0',
        tradingFees: '0.01',
        tradeGroupID: '0x000abc123',
        address: '0x1',
        orderBooks: {
            '0xa1': {
                buy: {
                    '0xb1': { amount: '50', limitPrice: '0.5' },
                    '0xb2': { amount: '50', limitPrice: '0.5' },
                },
                sell: {}
            }
        },
        getTradeIDs: function() {
            callCounts.getTradeIDs++;
            switch(callCounts.getTradeIDs) {
            case 1:
            case 2:
                return ['0xb1', '0xb2'];
                break;
            default:
                return [];
                break;
            }
        },
        tradeCommitmentCallback: function(commit) {
            callCounts.tradeCommitmentCallback++;
            switch(callCounts.tradeCommitmentCallback) {
            case 1:
                assert.deepEqual(commit, {
                    tradeHash: '0x0000000000000000000000000000000000000000000000000000000abc543012',
                    orders: [
                        { amount: '50', limitPrice: '0.5' },
                        { amount: '50', limitPrice: '0.5' },
                    ],
                    maxValue: '0',
                    maxAmount: '100',
                    remainingEth: '0',
                    remainingShares: '100',
                    filledEth: '0',
                    filledShares: '0',
                    tradingFees: '0.01',
                    gasFees: '0'
                });
                break;
            case 2:
                assert.deepEqual(commit, { gasFees: '0.045' });
                break;
            case 3:
                assert.deepEqual(commit, {
                    filledShares: '0',
                    filledEth: '25',
                    remainingShares: '50',
                    remainingEth: '0',
                    tradingFees: '0.5',
                    gasFees: '0.09',
                });
                break;
            case 4:
                assert.deepEqual(commit, {
                    tradeHash: '0x0000000000000000000000000000000000000000000000000000000abc543012',
                    orders: [
                        { amount: '50', limitPrice: '0.5' },
                        { amount: '50', limitPrice: '0.5' },
                    ],
                    maxValue: '0',
                    maxAmount: '50',
                    remainingEth: '0',
                    remainingShares: '50',
                    filledEth: '25',
                    filledShares: '0',
                    tradingFees: '0.5',
                    gasFees: '0.09'
                });
                break;
            case 5:
                assert.deepEqual(commit, { gasFees: '0.135' });
                break;
            case 6:
                assert.deepEqual(commit, {
                    filledShares: '0',
                    filledEth: '50',
                    remainingShares: '0',
                    remainingEth: '0',
                    tradingFees: '1',
                    gasFees: '0.18',
                });
                break;
            default:
                assert.isTrue(false, 'should not call tradeCommitmentCallback more than 9 times');
                break;
            }
        },
        getParticipantSharesPurchased: function(marketID, address, outcomeID, cb) {
            callCounts.getParticipantSharesPurchased++;
            assert.equal(marketID, '0xa1');
            assert.equal(address, '0x1');
            assert.equal(outcomeID, '2');
            switch(callCounts.getParticipantSharesPurchased) {
            case 1:
                cb('100');
                break;
            case 2:
            case 3:
                cb('50');
                break;
            default:
                cb('0');
                break;
            }
        },
        getCashBalance: function(address, cb) {
            callCounts.getCashBalance++;
            assert.equal(address, '0x1');
            switch(callCounts.getCashBalance) {
            case 1:
                cb('1000');
                break;
            case 3:
            case 2:
                cb('1025');
                break;
            default:
                cb('1050');
                break;
            }
        },
        trade: function(trade) {
            callCounts.trade++;
            console.log('trade', callCounts.trade, trade);
            assert.deepEqual(trade.trade_ids, ['0xb1', '0xb2']);
            assert.equal(trade.tradeGroupID, '0x000abc123');
            assert.equal(trade.sender, '0x1');
            assert.isFunction(trade.onTradeHash);
            assert.isFunction(trade.onCommitSent);
            assert.isFunction(trade.onCommitSuccess);
            assert.isFunction(trade.onCommitFailed);
            assert.isFunction(trade.onNextBlock);
            assert.isFunction(trade.onTradeSent);
            assert.isFunction(trade.onTradeSuccess);
            assert.isFunction(trade.onTradeFailed);
            trade.onTradeHash('0xabc543012');
            trade.onCommitSent('1');
            trade.onCommitSuccess({ gasFees: new BigNumber('0.045') });
            trade.onNextBlock('1');
            trade.onTradeSent('1');
            switch(callCounts.trade) {
            case 2:
                assert.equal(trade.max_value, '0');
                assert.equal(trade.max_amount, '50');
                trade.onTradeSuccess({
                    sharesBought: '0',
                    cashFromTrade: '25',
                    unmatchedShares: '0',
                    unmatchedCash: '0',
                    tradingFees: '0.5',
                    gasFees: '0.045'
                });
                break;
            default:
                assert.equal(trade.max_value, '0');
                assert.equal(trade.max_amount, '100');
                trade.onTradeSuccess({
                    sharesBought: '0',
                    cashFromTrade: '25',
                    unmatchedShares: '50',
                    unmatchedCash: '0',
                    tradingFees: '0.5',
                    gasFees: '0.045'
                });
                break;
            }

        },
        assertions: function(err, res) {
            assert.isNull(err);
            assert.deepEqual(res, {
                remainingEth: new BigNumber('0'),
                remainingShares: new BigNumber('0'),
                filledShares: new BigNumber('0'),
                filledEth: new BigNumber('50'),
                tradingFees: new BigNumber('1'),
                gasFees: new BigNumber('.18'),
            });
            assert.deepEqual(callCounts, {
                getParticipantSharesPurchased: 4,
                getCashBalance: 4,
                trade: 2,
                getTradeIDs: 3,
                tradeCommitmentCallback: 6
            });
        }
    });
    test({
        description: 'Should handle undefined tradeIDs',
        marketID: '0xa1',
        outcomeID: '2',
        numShares: '100',
        totalEthWithFee: '0',
        tradingFees: '0.01',
        tradeGroupID: '0x000abc123',
        address: '0x1',
        orderBooks: {
            '0xa1': {
                buy: {},
                sell: {}
            }
        },
        getTradeIDs: function() {
            callCounts.getTradeIDs++;
            return undefined;
        },
        tradeCommitmentCallback: function(commit) {
            callCounts.tradeCommitmentCallback++;
        },
        getParticipantSharesPurchased: function(marketID, address, outcomeID, cb) {
            callCounts.getParticipantSharesPurchased++;
        },
        getCashBalance: function(address, cb) {
            callCounts.getCashBalance++;
        },
        trade: function(trade) {
            callCounts.trade++;
        },
        assertions: function(err, res) {
            assert.isNull(err);
            assert.deepEqual(res, {
                remainingEth: constants.ZERO,
                remainingShares: new BigNumber('100'),
                filledShares: constants.ZERO,
                filledEth: constants.ZERO,
                tradingFees: constants.ZERO,
                gasFees: constants.ZERO,
            });
            assert.deepEqual(callCounts, {
                getParticipantSharesPurchased: 0,
                getCashBalance: 0,
                trade: 0,
                getTradeIDs: 1,
                tradeCommitmentCallback: 0
            });
        }
    });
    test({
        description: 'Should handle empty tradeIDs',
        marketID: '0xa1',
        outcomeID: '2',
        numShares: '100',
        totalEthWithFee: '0',
        tradingFees: '0.01',
        tradeGroupID: '0x000abc123',
        address: '0x1',
        orderBooks: {
            '0xa1': {
                buy: {},
                sell: {}
            }
        },
        getTradeIDs: function() {
            callCounts.getTradeIDs++;
            return [];
        },
        tradeCommitmentCallback: function(commit) {
            callCounts.tradeCommitmentCallback++;
        },
        getParticipantSharesPurchased: function(marketID, address, outcomeID, cb) {
            callCounts.getParticipantSharesPurchased++;
        },
        getCashBalance: function(address, cb) {
            callCounts.getCashBalance++;
        },
        trade: function(trade) {
            callCounts.trade++;
        },
        assertions: function(err, res) {
            assert.isNull(err);
            assert.deepEqual(res, {
                remainingEth: constants.ZERO,
                remainingShares: new BigNumber('100'),
                filledShares: constants.ZERO,
                filledEth: constants.ZERO,
                tradingFees: constants.ZERO,
                gasFees: constants.ZERO,
            });
            assert.deepEqual(callCounts, {
                getParticipantSharesPurchased: 0,
                getCashBalance: 0,
                trade: 0,
                getTradeIDs: 1,
                tradeCommitmentCallback: 0
            });
        }
    });
    test({
        description: 'Should handle if both numShares and totalEthWithFee are passed as 0',
        marketID: '0xa1',
        outcomeID: '2',
        numShares: '0',
        totalEthWithFee: '0',
        tradingFees: '0.01',
        tradeGroupID: '0x000abc123',
        address: '0x1',
        orderBooks: {
            '0xa1': {
                buy: {},
                sell: {'0xb1': { amount: '100', limitPrice: '0.5' },}
            }
        },
        getTradeIDs: function() {
            callCounts.getTradeIDs++;
            return ['0xb1'];
        },
        tradeCommitmentCallback: function(commit) {
            callCounts.tradeCommitmentCallback++;
        },
        getParticipantSharesPurchased: function(marketID, address, outcomeID, cb) {
            callCounts.getParticipantSharesPurchased++;
        },
        getCashBalance: function(address, cb) {
            callCounts.getCashBalance++;
        },
        trade: function(trade) {
            callCounts.trade++;
        },
        assertions: function(err, res) {
            assert.isNull(err);
            assert.deepEqual(res, {
                remainingEth: constants.ZERO,
                remainingShares: constants.ZERO,
                filledShares: constants.ZERO,
                filledEth: constants.ZERO,
                tradingFees: constants.ZERO,
                gasFees: constants.ZERO,
            });
            assert.deepEqual(callCounts, {
                getParticipantSharesPurchased: 0,
                getCashBalance: 0,
                trade: 0,
                getTradeIDs: 1,
                tradeCommitmentCallback: 0
            });
        }
    });
    test({
        description: 'Should handle if both numShares and totalEthWithFee are passed as undefined',
        marketID: '0xa1',
        outcomeID: '2',
        numShares: undefined,
        totalEthWithFee: undefined,
        tradingFees: '0.01',
        tradeGroupID: '0x000abc123',
        address: '0x1',
        orderBooks: {
            '0xa1': {
                buy: {},
                sell: {'0xb1': { amount: '100', limitPrice: '0.5' },}
            }
        },
        getTradeIDs: function() {
            callCounts.getTradeIDs++;
            return ['0xb1'];
        },
        tradeCommitmentCallback: function(commit) {
            callCounts.tradeCommitmentCallback++;
        },
        getParticipantSharesPurchased: function(marketID, address, outcomeID, cb) {
            callCounts.getParticipantSharesPurchased++;
        },
        getCashBalance: function(address, cb) {
            callCounts.getCashBalance++;
        },
        trade: function(trade) {
            callCounts.trade++;
        },
        assertions: function(err, res) {
            assert.isNull(err);
            assert.deepEqual(res, {
                remainingEth: constants.ZERO,
                remainingShares: constants.ZERO,
                filledShares: constants.ZERO,
                filledEth: constants.ZERO,
                tradingFees: constants.ZERO,
                gasFees: constants.ZERO,
            });
            assert.deepEqual(callCounts, {
                getParticipantSharesPurchased: 0,
                getCashBalance: 0,
                trade: 0,
                getTradeIDs: 1,
                tradeCommitmentCallback: 0
            });
        }
    });
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
                  gasFees: '0'
                });
                break;
            case 2:
                assert.deepEqual(commit, { gasFees: '0.045' });
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
            trade.onTradeHash('0xabc543012');
            trade.onCommitSent('1');
            trade.onCommitSuccess({ gasFees: '0.045'});
            trade.onNextBlock();
            trade.onTradeSent();
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
                  gasFees: '0'
                });
                break;
            case 2:
                assert.deepEqual(commit, { gasFees: '0.045' });
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
                  gasFees: '0.09'
                });
                break;
            case 5:
                assert.deepEqual(commit, { gasFees: '0.135' });
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
                trade.onTradeHash('0xabc543012');
                trade.onCommitSent('1');
                trade.onCommitSuccess({ gasFees: '0.045'});
                trade.onNextBlock();
                trade.onTradeSent();
                trade.onTradeSuccess({
                    unmatchedShares: '50',
                    matchedShares: '50',
                    cashFromTrade: '25',
                    tradingFees: '0.01',
                    gasFees: '0.045',
                });
                break;
            default:
                trade.onTradeHash('0xabc543012');
                trade.onCommitSent('1');
                trade.onCommitSuccess({ gasFees: '0.045'});
                trade.onNextBlock();
                trade.onTradeSent();
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
              gasFees: '0'
            });
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
            trade.onTradeHash('0xabc543012');
            trade.onCommitSent('1');
            trade.onCommitFailed({ error: 999, message: 'Uh-Oh!' });

        },
        assertions: function(err, res) {
            assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
            assert.isUndefined(res);
            assert.deepEqual(callCounts, {
                getTradeIDs: 1,
                tradeCommitmentCallback: 1,
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
            case 2:
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
                  gasFees: '0'
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
            trade.onTradeHash('0xabc543012');
            trade.onCommitSent('1');
            trade.onCommitSuccess({ gasFees: '0.045'});
            trade.onNextBlock();
            trade.onTradeSent();
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
