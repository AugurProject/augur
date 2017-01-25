"use strict";

var assert = require('chai').assert;
var selectOrder = require('../../../src/modules/selectOrder');
// 5 tests total

describe("selectOrder.selectOrder", function() {
    // 3 tests total
    var test = function(t) {
        it(t.description, function() {
            t.assertions(selectOrder.selectOrder(t.orderID, t.orderBooks));
        });
    };
    test({
        description: 'Should handle finding an order given an id and order books of multiple markets, found in a sell side book.',
        orderID: '0xc4',
        orderBooks: {
        	'0xa1': {
        		buy: { '0xc1': { id: '0xc1', type: 'buy', amount: '30', price: '0.3', marketID: '0xa1' }},
        		sell: { '0xc2': { id: '0xc2', type: 'sell', amount: '100', price: '0.4', marketID: '0xa1' }}
        	},
        	'0xa2': {
                buy: { '0xc3': { id: '0xc3', type: 'buy', amount: '25', price: '0.45', marketID: '0xa2' }},
        		sell: { '0xc4': { id: '0xc4', type: 'sell', amount: '10', price: '0.5', marketID: '0xa2' }}
        	}
        },
        assertions: function(order) {
            assert.deepEqual(order, { id: '0xc4', type: 'sell', amount: '10', price: '0.5', marketID: '0xa2' });
        }
    });
    test({
        description: 'Should handle finding an order given an id and order books of multiple markets, found in a buy side book.',
        orderID: '0xc1',
        orderBooks: {
        	'0xa1': {
        		buy: { '0xc1': { id: '0xc1', type: 'buy', amount: '30', price: '0.3', marketID: '0xa1' }},
        		sell: { '0xc2': { id: '0xc2', type: 'sell', amount: '100', price: '0.4', marketID: '0xa1' }}
        	},
        	'0xa2': {
                buy: { '0xc3': { id: '0xc3', type: 'buy', amount: '25', price: '0.45', marketID: '0xa2' }},
        		sell: { '0xc4': { id: '0xc4', type: 'sell', amount: '10', price: '0.5', marketID: '0xa2' }}
        	}
        },
        assertions: function(order) {
            assert.deepEqual(order, { id: '0xc1', type: 'buy', amount: '30', price: '0.3', marketID: '0xa1' });
        }
    });
    test({
        description: 'Should return undefined if no order is found given the orderID',
        orderID: '0xc123',
        orderBooks: {
        	'0xa1': {
        		buy: { '0xc1': { id: '0xc1', type: 'buy', amount: '30', price: '0.3', marketID: '0xa1' }},
        		sell: { '0xc2': { id: '0xc2', type: 'sell', amount: '100', price: '0.4', marketID: '0xa1' }}
        	},
        	'0xa2': {
                buy: { '0xc3': { id: '0xc3', type: 'buy', amount: '25', price: '0.45', marketID: '0xa2' }},
        		sell: { '0xc4': { id: '0xc4', type: 'sell', amount: '10', price: '0.5', marketID: '0xa2' }}
        	}
        },
        assertions: function(order) {
            assert.isUndefined(order);
        }
    });
});

describe("selectOrder.selectOrderInOrderBookSide", function() {
    // 2 tests total
    var test = function(t) {
        it(t.description, function() {
            t.assertions(selectOrder.selectOrderInOrderBookSide(t.orderID, t.orderBookSide));
        });
    };
    test({
        description: 'Should find an order in the orderbook passed',
        orderID: '0xc3',
        orderBookSide: { '0xa1': {id: '0xa1'}, '0xa2': {id: '0xa2'}, '0xb1': {id: '0xb1'}, '0xc1': { id: '0xc1'}, '0xc2': { id: '0xc2'}, '0xc3': { id: '0xc3'}, '0xc4': { id: '0xc4'}},
        assertions: function(order) {
            assert.deepEqual(order, { id: '0xc3' });
        }
    });
    test({
        description: 'Should return undefined if the orderID is not inside of the orderBookSide passed',
        orderID: '0xc5',
        orderBookSide: { '0xa1': {id: '0xa1'}, '0xa2': {id: '0xa2'}, '0xb1': {id: '0xb1'}, '0xc1': { id: '0xc1'}, '0xc2': { id: '0xc2'}, '0xc3': { id: '0xc3'}, '0xc4': { id: '0xc4'}},
        assertions: function(order) {
            assert.isUndefined(order);
        }
    });
});
