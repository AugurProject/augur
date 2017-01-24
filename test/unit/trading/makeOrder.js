"use strict";

var assert = require('chai').assert;
var augur = require('../../../src');

describe("augur.placeBid", function() {
    // 2 tests total
    var buy = augur.buy;
    afterEach(function() {
        augur.buy = buy;
    });
    var test = function(t) {
        it(t.description, function() {
            augur.buy = t.assertions;
            augur.placeBid(t.market, t.outcomeID, t.numShares, t.limitPrice, t.tradeGroupID);
        });
    };
    test({
        description: 'Should prepare a binary market bid',
        market: { id: '0xa1', type: 'binary', minValue: 0},
        outcomeID: '1',
        numShares: '100',
        limitPrice: '0.5',
        tradeGroupID: '0xab12',
        assertions: function(order) {
            assert.deepEqual(order.amount, '100');
            assert.deepEqual(order.price, '0.5');
            assert.deepEqual(order.market, '0xa1');
            assert.deepEqual(order.outcome, '1');
            assert.deepEqual(order.tradeGroupID, '0xab12');
            assert.deepEqual(order.scalarMinMax, {});
            assert.isFunction(order.onSent);
            assert.isFunction(order.onSuccess);
            assert.isFunction(order.onFailed);
        }
    });
    test({
        description: 'Should prepare a scalar market bid',
        market: { id: '0xa1', type: 'scalar', minValue: '-15'},
        outcomeID: '1',
        numShares: '100',
        limitPrice: '0.5',
        tradeGroupID: '0xab12',
        assertions: function(order) {
            assert.deepEqual(order.amount, '100');
            assert.deepEqual(order.price, '0.5');
            assert.deepEqual(order.market, '0xa1');
            assert.deepEqual(order.outcome, '1');
            assert.deepEqual(order.tradeGroupID, '0xab12');
            assert.deepEqual(order.scalarMinMax, { minValue: '-15'});
            assert.isFunction(order.onSent);
            assert.isFunction(order.onSuccess);
            assert.isFunction(order.onFailed);
        }
    });
});
describe("augur.placeAsk", function() {
    // 2 tests total
    var sell = augur.sell;
    afterEach(function() {
        augur.sell = sell;
    });
    var test = function(t) {
        it(t.description, function() {
            augur.sell = t.assertions;
            augur.placeAsk(t.market, t.outcomeID, t.numShares, t.limitPrice, t.tradeGroupID);
        });
    };
    test({
        description: 'Should prepare a binary market ask',
        market: { id: '0xa1', type: 'binary', minValue: 0},
        outcomeID: '1',
        numShares: '100',
        limitPrice: '0.5',
        tradeGroupID: '0xab12',
        assertions: function(order) {
            assert.deepEqual(order.amount, '100');
            assert.deepEqual(order.price, '0.5');
            assert.deepEqual(order.market, '0xa1');
            assert.deepEqual(order.outcome, '1');
            assert.deepEqual(order.tradeGroupID, '0xab12');
            assert.deepEqual(order.scalarMinMax, {});
            assert.isFunction(order.onSent);
            assert.isFunction(order.onSuccess);
            assert.isFunction(order.onFailed);
        }
    });
    test({
        description: 'Should prepare a scalar market ask',
        market: { id: '0xa1', type: 'scalar', minValue: '-15'},
        outcomeID: '1',
        numShares: '100',
        limitPrice: '0.5',
        tradeGroupID: '0xab12',
        assertions: function(order) {
            assert.deepEqual(order.amount, '100');
            assert.deepEqual(order.price, '0.5');
            assert.deepEqual(order.market, '0xa1');
            assert.deepEqual(order.outcome, '1');
            assert.deepEqual(order.tradeGroupID, '0xab12');
            assert.deepEqual(order.scalarMinMax, { minValue: '-15'});
            assert.isFunction(order.onSent);
            assert.isFunction(order.onSuccess);
            assert.isFunction(order.onFailed);
        }
    });
});
describe("augur.placeShortAsk", function() {
    // 2 tests total
    var shortAsk = augur.shortAsk;
    afterEach(function() {
        augur.shortAsk = shortAsk;
    });
    var test = function(t) {
        it(t.description, function() {
            augur.shortAsk = t.assertions;
            augur.placeShortAsk(t.market, t.outcomeID, t.numShares, t.limitPrice, t.tradeGroupID);
        });
    };
    test({
        description: 'Should prepare a binary market shortAsk',
        market: { id: '0xa1', type: 'binary', minValue: 0},
        outcomeID: '1',
        numShares: '100',
        limitPrice: '0.5',
        tradeGroupID: '0xab12',
        assertions: function(order) {
            assert.deepEqual(order.amount, '100');
            assert.deepEqual(order.price, '0.5');
            assert.deepEqual(order.market, '0xa1');
            assert.deepEqual(order.outcome, '1');
            assert.deepEqual(order.tradeGroupID, '0xab12');
            assert.deepEqual(order.scalarMinMax, {});
            assert.isFunction(order.onSent);
            assert.isFunction(order.onSuccess);
            assert.isFunction(order.onFailed);
        }
    });
    test({
        description: 'Should prepare a scalar market shortAsk',
        market: { id: '0xa1', type: 'scalar', minValue: '-15'},
        outcomeID: '1',
        numShares: '100',
        limitPrice: '0.5',
        tradeGroupID: '0xab12',
        assertions: function(order) {
            assert.deepEqual(order.amount, '100');
            assert.deepEqual(order.price, '0.5');
            assert.deepEqual(order.market, '0xa1');
            assert.deepEqual(order.outcome, '1');
            assert.deepEqual(order.tradeGroupID, '0xab12');
            assert.deepEqual(order.scalarMinMax, { minValue: '-15'});
            assert.isFunction(order.onSent);
            assert.isFunction(order.onSuccess);
            assert.isFunction(order.onFailed);
        }
    });
});
