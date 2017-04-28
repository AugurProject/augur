"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var augur = new (require("../../../src"))();
var constants = require("../../../src/constants");

var gasPrice = augur.rpc.gasPrice;

before(function () {
  augur.rpc.gasPrice = 20000000000;
});

after(function () {
  augur.rpc.gasPrice = gasPrice;
});

describe("tradeActions.calculateBuyTradeIDs", function () {
  // 3 tests total
  var filterByPriceAndOutcomeAndUserSortByPrice = augur.filterByPriceAndOutcomeAndUserSortByPrice;
  afterEach(function () {
    augur.filterByPriceAndOutcomeAndUserSortByPrice = filterByPriceAndOutcomeAndUserSortByPrice;
  });
  var test = function (t) {
    it(t.description, function () {
      augur.filterByPriceAndOutcomeAndUserSortByPrice = t.filterByPriceAndOutcomeAndUserSortByPrice;
      t.assertions(augur.calculateBuyTradeIDs(t.marketID, t.outcomeID, t.limitPrice, t.orderBooks, t.address));
    });
  };
  test({
    description: 'Should handle returning the matching sell trades',
    marketID: '0xa1',
    outcomeID: '1',
    limitPrice: '0.5',
    orderBooks: {
    	'0xa1': {
    		buy: {},
    		sell: {
          '0xb1': { amount: '10', price: '0.5', outcome: '1', owner: '0x2', id: '0xb1'},
          '0xb2': { amount: '20', price: '0.4', outcome: '1', owner: '0x2', id: '0xb2'},
          '0xb3': { amount: '30', price: '0.6', outcome: '1', owner: '0x2', id: '0xb3'},
          '0xb4': { amount: '40', price: '0.45', outcome: '1', owner: '0x2', id: '0xb4'},
    		}
    	}
    },
    address: '0x1',
    filterByPriceAndOutcomeAndUserSortByPrice: function (orders, traderOrderType, limitPrice, outcomeId, userAddress) {
      assert.deepEqual(orders, {
        '0xb1': { amount: '10', price: '0.5', outcome: '1', owner: '0x2', id: '0xb1'},
        '0xb2': { amount: '20', price: '0.4', outcome: '1', owner: '0x2', id: '0xb2'},
        '0xb3': { amount: '30', price: '0.6', outcome: '1', owner: '0x2', id: '0xb3'},
        '0xb4': { amount: '40', price: '0.45', outcome: '1', owner: '0x2', id: '0xb4'},
      });
      assert.equal(limitPrice, '0.5');
      assert.equal(outcomeId, '1');
      assert.equal(userAddress, '0x1');
      // mock how filterByPriceAndOutcomeAndUserSortByPrice works
      // simply return what it would return in this situation...
      return [{
      	amount: '20',
      	price: '0.4',
      	outcome: '1',
      	owner: '0x2',
      	id: '0xb2'
      }, {
      	amount: '40',
      	price: '0.45',
      	outcome: '1',
      	owner: '0x2',
      	id: '0xb4'
      }, {
      	amount: '10',
      	price: '0.5',
      	outcome: '1',
      	owner: '0x2',
      	id: '0xb1'
      }];
    },
    assertions(output) {
      assert.deepEqual(output, ['0xb2', '0xb4', '0xb1']);
    }
  });
  test({
    description: 'Should handle an orderbook without the passed market',
    marketID: '0xa1',
    outcomeID: '1',
    limitPrice: '0.5',
    orderBooks: {
    	'0xa4': {
    		buy: {},
    		sell: {
          '0xb1': { amount: '10', price: '0.5', outcome: '1', owner: '0x2', id: '0xb1'},
          '0xb2': { amount: '20', price: '0.4', outcome: '1', owner: '0x2', id: '0xb2'},
          '0xb3': { amount: '30', price: '0.6', outcome: '1', owner: '0x2', id: '0xb3'},
          '0xb4': { amount: '40', price: '0.45', outcome: '1', owner: '0x2', id: '0xb4'},
    		}
    	}
    },
    address: '0x1',
    filterByPriceAndOutcomeAndUserSortByPrice: function (orders, traderOrderType, limitPrice, outcomeId, userAddress) {
      assert.deepEqual(orders, {});
      assert.equal(limitPrice, '0.5');
      assert.equal(outcomeId, '1');
      assert.equal(userAddress, '0x1');
      // mock how filterByPriceAndOutcomeAndUserSortByPrice works
      // simply return what it would return in this situation...
      return [];
    },
    assertions(output) {
      assert.deepEqual(output, []);
    }
  });
  test({
    description: 'Should handle an empty orderBook',
    marketID: '0xa1',
    outcomeID: '2',
    limitPrice: '0.7',
    orderBooks: {},
    address: '0x1',
    filterByPriceAndOutcomeAndUserSortByPrice: function (orders, traderOrderType, limitPrice, outcomeId, userAddress) {
      assert.deepEqual(orders, {});
      assert.equal(limitPrice, '0.7');
      assert.equal(outcomeId, '2');
      assert.equal(userAddress, '0x1');
      // mock how filterByPriceAndOutcomeAndUserSortByPrice works
      // simply return what it would return in this situation...
      return [];
    },
    assertions(output) {
      assert.deepEqual(output, []);
    }
  });
});
describe("tradeActions.calculateSellTradeIDs", function () {
  // 3 tests total
  var filterByPriceAndOutcomeAndUserSortByPrice = augur.filterByPriceAndOutcomeAndUserSortByPrice;
  afterEach(function () {
    augur.filterByPriceAndOutcomeAndUserSortByPrice = filterByPriceAndOutcomeAndUserSortByPrice;
  });
  var test = function (t) {
    it(t.description, function () {
      augur.filterByPriceAndOutcomeAndUserSortByPrice = t.filterByPriceAndOutcomeAndUserSortByPrice;
      t.assertions(augur.calculateSellTradeIDs(t.marketID, t.outcomeID, t.limitPrice, t.orderBooks, t.address));
    });
  };
  test({
    description: 'Should handle returning the matching buy trades',
    marketID: '0xa1',
    outcomeID: '1',
    limitPrice: '0.5',
    orderBooks: {
      '0xa1': {
        buy: {
          '0xb1': { amount: '10', price: '0.5', outcome: '1', owner: '0x2', id: '0xb1'},
          '0xb2': { amount: '20', price: '0.7', outcome: '1', owner: '0x2', id: '0xb2'},
          '0xb3': { amount: '30', price: '0.6', outcome: '1', owner: '0x2', id: '0xb3'},
          '0xb4': { amount: '40', price: '0.45', outcome: '1', owner: '0x2', id: '0xb4'},
        },
        sell: {}
        }
    },
    address: '0x1',
    filterByPriceAndOutcomeAndUserSortByPrice: function (orders, traderOrderType, limitPrice, outcomeId, userAddress) {
      assert.deepEqual(orders, {
        '0xb1': { amount: '10', price: '0.5', outcome: '1', owner: '0x2', id: '0xb1'},
        '0xb2': { amount: '20', price: '0.7', outcome: '1', owner: '0x2', id: '0xb2'},
        '0xb3': { amount: '30', price: '0.6', outcome: '1', owner: '0x2', id: '0xb3'},
        '0xb4': { amount: '40', price: '0.45', outcome: '1', owner: '0x2', id: '0xb4'},
      });
      assert.equal(limitPrice, '0.5');
      assert.equal(outcomeId, '1');
      assert.equal(userAddress, '0x1');
      // mock how filterByPriceAndOutcomeAndUserSortByPrice works
      // simply return what it would return in this situation...
      return [
      { amount: '20', price: '0.7', outcome: '1', owner: '0x2', id: '0xb2'},
      { amount: '30', price: '0.6', outcome: '1', owner: '0x2', id: '0xb3'},
      { amount: '10', price: '0.5', outcome: '1', owner: '0x2', id: '0xb1'}
      ];
    },
    assertions(output) {
      assert.deepEqual(output, ['0xb2', '0xb3', '0xb1']);
    }
  });
  test({
    description: 'Should handle an orderbook without the passed market',
    marketID: '0xa1',
    outcomeID: '1',
    limitPrice: '0.5',
    orderBooks: {
      '0xa4': {
        buy: {
          '0xb1': { amount: '10', price: '0.5', outcome: '1', owner: '0x2', id: '0xb1'},
          '0xb2': { amount: '20', price: '0.7', outcome: '1', owner: '0x2', id: '0xb2'},
          '0xb3': { amount: '30', price: '0.6', outcome: '1', owner: '0x2', id: '0xb3'},
          '0xb4': { amount: '40', price: '0.45', outcome: '1', owner: '0x2', id: '0xb4'},
        },
        sell: {}
      }
    },
    address: '0x1',
    filterByPriceAndOutcomeAndUserSortByPrice: function (orders, traderOrderType, limitPrice, outcomeId, userAddress) {
      assert.deepEqual(orders, {});
      assert.equal(limitPrice, '0.5');
      assert.equal(outcomeId, '1');
      assert.equal(userAddress, '0x1');
      // mock how filterByPriceAndOutcomeAndUserSortByPrice works
      // simply return what it would return in this situation...
      return [];
    },
    assertions(output) {
      assert.deepEqual(output, []);
    }
  });
  test({
    description: 'Should handle an empty orderBook',
    marketID: '0xa1',
    outcomeID: '2',
    limitPrice: '0.7',
    orderBooks: {},
    address: '0x1',
    filterByPriceAndOutcomeAndUserSortByPrice: function (orders, traderOrderType, limitPrice, outcomeId, userAddress) {
      assert.deepEqual(orders, {});
      assert.equal(limitPrice, '0.7');
      assert.equal(outcomeId, '2');
      assert.equal(userAddress, '0x1');
      // mock how filterByPriceAndOutcomeAndUserSortByPrice works
      // simply return what it would return in this situation...
      return [];
    },
    assertions(output) {
      assert.deepEqual(output, []);
    }
  });
});
describe("tradeActions.getTxGasEth", function () {
  // 2 tests total
  var test = function (t) {
    it(t.description, function () {
      t.assertions(augur.getTxGasEth(t.tx, t.gasPrice));
    });
  };
  test({
    description: 'Should handle getting the gas cost for a transaction with no gas value passed in the transaction.',
    tx: { value: '10' },
    gasPrice: '0x2540be400',
    assertions: function (data) {
      assert.equal(data.toFixed(), '0.03135');
    }
  });
  test({
    description: 'Should handle getting the gas cost for a transaction with a gas value passed in the transaction.',
    tx: { value: '25', gas: 4500200 },
    gasPrice: '0x4a817c800',
    assertions: function (data) {
      assert.equal(data.toFixed(), '0.090004');
    }
  });
});
describe("tradeActions.filterByPriceAndOutcomeAndUserSortByPrice", function () {
  // 5 tests total
  var test = function (t) {
    it(t.description, function () {
      t.assertions(augur.filterByPriceAndOutcomeAndUserSortByPrice(t.orders, t.traderOrderType, t.limitPrice, t.outcomeId, t.userAddress));
    });
  };
  test({
    description: 'Should handle an undefined orders object',
    orders: undefined,
    traderOrderType: 'buy',
    limitPrice: '0.5',
    outcomeId: '1',
    userAddress: '0x1',
    assertions: function (output) {
      assert.deepEqual(output, []);
    }
  });
  test({
    description: 'Should handle an undefined limitPrice and return all orders that are possible to purchase on a buy',
    orders: {
      '0xb1': { price: '0.5', amount: '100', outcome: '1', owner: '0x2', id: '0xb1' },
      '0xb2': { price: '0.6', amount: '75', outcome: '1', owner: '0x3', id: '0xb2' },
      '0xb3': { price: '0.45', amount: '25', outcome: '1', owner: '0x4', id: '0xb3' },
      '0xb4': { price: '0.5', amount: '125', outcome: '2', owner: '0x5', id: '0xb4' },
      '0xb5': { price: '0.65', amount: '225', outcome: '1', owner: '0x5', id: '0xb5' },
      '0xb6': {},
      '0xb7': { price: '0.7', amount: '150', outcome: '1', owner: '0x6', id: '0xb7'},
      '0xb8': undefined
    },
    traderOrderType: 'buy',
    limitPrice: undefined,
    outcomeId: '1',
    userAddress: '0x1',
    assertions: function (output) {
      assert.deepEqual(output, [{
        price: '0.45',
        amount: '25',
        outcome: '1',
        owner: '0x4',
        id: '0xb3'
      }, {
        price: '0.5',
        amount: '100',
        outcome: '1',
        owner: '0x2',
        id: '0xb1'
      }, {
        price: '0.6',
        amount: '75',
        outcome: '1',
        owner: '0x3',
        id: '0xb2'
      }, {
        price: '0.65',
        amount: '225',
        outcome: '1',
        owner: '0x5',
        id: '0xb5'
      }, {
        price: '0.7',
        amount: '150',
        outcome: '1',
        owner: '0x6',
        id: '0xb7'
      }]);
    }
  });
  test({
    description: 'Should handle an null limitPrice and return all orders that are possible to purchase on a buy',
    orders: {
      '0xb1': { price: '0.5', amount: '100', outcome: '1', owner: '0x2', id: '0xb1' },
      '0xb2': { price: '0.6', amount: '75', outcome: '1', owner: '0x3', id: '0xb2' },
      '0xb3': { price: '0.45', amount: '25', outcome: '1', owner: '0x4', id: '0xb3' },
      '0xb4': { price: '0.5', amount: '125', outcome: '2', owner: '0x5', id: '0xb4' },
      '0xb5': { price: '0.65', amount: '225', outcome: '1', owner: '0x5', id: '0xb5' },
      '0xb6': {},
      '0xb7': { price: '0.7', amount: '150', outcome: '1', owner: '0x6', id: '0xb7'},
      '0xb8': undefined
    },
    traderOrderType: 'buy',
    limitPrice: null,
    outcomeId: '1',
    userAddress: '0x1',
    assertions: function (output) {
      assert.deepEqual(output, [{
      	price: '0.45',
      	amount: '25',
      	outcome: '1',
      	owner: '0x4',
      	id: '0xb3'
      }, {
      	price: '0.5',
      	amount: '100',
      	outcome: '1',
      	owner: '0x2',
      	id: '0xb1'
      }, {
      	price: '0.6',
      	amount: '75',
      	outcome: '1',
      	owner: '0x3',
      	id: '0xb2'
      }, {
      	price: '0.65',
      	amount: '225',
      	outcome: '1',
      	owner: '0x5',
      	id: '0xb5'
      }, {
        price: '0.7',
        amount: '150',
        outcome: '1',
        owner: '0x6',
        id: '0xb7'
      }]);
    }
  });
  test({
    description: 'Should handle a limitPrice and return all orders that are possible to purchase at or below that price on a buy',
    orders: {
      '0xb1': { price: '0.5', amount: '100', outcome: '1', owner: '0x2', id: '0xb1' },
      '0xb2': { price: '0.6', amount: '75', outcome: '1', owner: '0x3', id: '0xb2' },
      '0xb3': { price: '0.45', amount: '25', outcome: '1', owner: '0x4', id: '0xb3' },
      '0xb4': { price: '0.5', amount: '125', outcome: '2', owner: '0x5', id: '0xb4' },
      '0xb5': { price: '0.65', amount: '225', outcome: '1', owner: '0x5', id: '0xb5' },
      '0xb6': {},
      '0xb7': { price: '0.7', amount: '150', outcome: '1', owner: '0x6', id: '0xb7'},
      '0xb8': undefined
    },
    traderOrderType: 'buy',
    limitPrice: '0.5',
    outcomeId: '1',
    userAddress: '0x1',
    assertions: function (output) {
      assert.deepEqual(output, [{
      	price: '0.45',
      	amount: '25',
      	outcome: '1',
      	owner: '0x4',
      	id: '0xb3'
      }, {
      	price: '0.5',
      	amount: '100',
      	outcome: '1',
      	owner: '0x2',
      	id: '0xb1'
      }]);
    }
  });
  test({
    description: 'Should handle a limitPrice and return all orders that are possible to purchase at or below that price on a sell',
    orders: {
    '0xb1': { price: '0.5', amount: '100', outcome: '1', owner: '0x2', id: '0xb1' },
    '0xb2': { price: '0.6', amount: '75', outcome: '1', owner: '0x3', id: '0xb2' },
    '0xb3': { price: '0.45', amount: '25', outcome: '1', owner: '0x4', id: '0xb3' },
    '0xb4': { price: '0.5', amount: '125', outcome: '2', owner: '0x5', id: '0xb4' },
    '0xb5': { price: '0.65', amount: '225', outcome: '1', owner: '0x5', id: '0xb5' },
    '0xb6': {},
    '0xb7': { price: '0.7', amount: '150', outcome: '1', owner: '0x6', id: '0xb7'},
    '0xb8': undefined
    },
    traderOrderType: 'sell',
    limitPrice: '0.5',
    outcomeId: '1',
    userAddress: '0x1',
    assertions: function (output) {
      assert.deepEqual(output, [{
    		price: '0.7',
    		amount: '150',
    		outcome: '1',
    		owner: '0x6',
    		id: '0xb7'
    	},
    	{
    		price: '0.65',
    		amount: '225',
    		outcome: '1',
    		owner: '0x5',
    		id: '0xb5'
    	},
    	{
    		price: '0.6',
    		amount: '75',
    		outcome: '1',
    		owner: '0x3',
    		id: '0xb2'
    	},
    	{
    		price: '0.5',
    		amount: '100',
    		outcome: '1',
    		owner: '0x2',
    		id: '0xb1'
    	}]);
    }
  });
});
describe("tradeActions.getBidAction", function () {
  // 1 test total
  var test = function (t) {
    it(t.description, function () {
      t.assertions(augur.getBidAction(t.shares, t.limitPrice, t.makerFee, t.gasPrice));
    });
  };
  test({
    description: 'Should correctly create and return a bid action object',
    shares: new BigNumber('10000000000000000000'),
    limitPrice: new BigNumber('500000000000000000'),
    makerFee: new BigNumber('10000000000000000'),
    gasPrice: 1000,
    assertions: function (output) {
      assert.deepEqual(output, {
        action: 'BID',
        shares: '10',
        gasEth: '0.000000000725202',
        feeEth: '0.05',
        feePercent: '1',
        costEth: '-5.05',
        avgPrice: '0.505',
        noFeePrice: '0.5'
      });
    }
  });
});
describe("tradeActions.getBuyAction", function () {
  // 1 test total
  var test = function (t) {
    it(t.description, function () {
      t.assertions(augur.getBuyAction(t.buyEth, t.sharesFilled, t.takerFeeEth, t.gasPrice));
    });
  };
  test({
    description: 'Should correctly create and return a buy action object',
    buyEth: new BigNumber('5'),
    sharesFilled: new BigNumber('10'),
    takerFeeEth: new BigNumber('0.05'),
    gasPrice: 93045,
    assertions: function (output) {
      assert.deepEqual(output, {
        action: 'BUY',
        shares: '10',
        gasEth: '0.000000073265586945',
        feeEth: '0.05',
        feePercent: '1',
        costEth: '-5',
        avgPrice: '0.5',
        noFeePrice: '0.495'
      });
    }
  });
});
describe("tradeActions.getAskAction", function () {
  // 1 test total
  var test = function (t) {
    it(t.description, function () {
      t.assertions(augur.getAskAction(t.shares, t.limitPrice, t.makerFee, t.gasPrice));
    });
  };
  test({
    description: 'Should correctly create and return a ask action object',
    shares: new BigNumber('100000000000000000000'),
    limitPrice: new BigNumber('500000000000000000'),
    makerFee: new BigNumber('2000000000000000'),
    gasPrice: 93045,
    assertions: function (output) {
      assert.deepEqual(output, {
        action: 'ASK',
        avgPrice: '0.499',
        costEth: '49.9',
        feeEth: '0.1',
        feePercent: '0.2',
        gasEth: '0.000000064829941155',
        noFeePrice: '0.5',
        shares: '100'
      });
    }
  });
});
describe("tradeActions.getSellAction", function () {
  // 1 test total
  var test = function (t) {
    it(t.description, function () {
      t.assertions(augur.getSellAction(t.sellEth, t.sharesFilled, t.takerFeeEth, t.gasPrice));
    });
  };
  test({
    description: 'Should correctly create and return a sell action object',
    sellEth: new BigNumber('50'),
    sharesFilled: new BigNumber('100'),
    takerFeeEth: new BigNumber('0.01'),
    gasPrice: 93045,
    assertions: function (output) {
      assert.deepEqual(output, {
        action: 'SELL',
        shares: '100',
        gasEth: '0.000000073265586945',
        feeEth: '0.01',
        feePercent: '0.02',
        costEth: '50',
        avgPrice: '0.5',
        noFeePrice: '0.5001'
      });
    }
  });
});
describe("tradeActions.getShortSellAction", function () {
  // 1 test total
  var test = function (t) {
    it(t.description, function () {
      t.assertions(augur.getShortSellAction(t.shortSellEth, t.shares, t.takerFeeEth, t.gasPrice));
    });
  };
  test({
    description: 'Should correctly create and return a short sell action object',
    shortSellEth: new BigNumber('50'),
    shares: new BigNumber('100'),
    takerFeeEth: new BigNumber('0.01'),
    gasPrice: 93045,
    assertions: function (output) {
      assert.deepEqual(output, {
        action: 'SHORT_SELL',
        shares: '100',
        gasEth: '0.00000009860871882',
        feeEth: '0.01',
        feePercent: '0.02',
        costEth: '-50',
        avgPrice: '0.5',
        noFeePrice: '0.5001'
      });
    }
  });
});
describe("tradeActions.getShortAskAction", function () {
  // 1 test total
  var test = function (t) {
    it(t.description, function () {
      t.assertions(augur.getShortAskAction(t.shares, t.limitPrice, t.makerFee, t.gasPrice));
    });
  };
  test({
    description: 'Should correctly create and return a short ask action object',
    shares: new BigNumber('100000000000000000000'),
    limitPrice: new BigNumber('500000000000000000'),
    makerFee: new BigNumber('10000000000000000'),
    gasPrice: 93045,
    assertions: function (output) {
      assert.deepEqual(output, {
        action: 'SHORT_ASK',
        shares: '100',
        gasEth: '0.00000012985676553',
        feeEth: '0.5',
        feePercent: '1',
        costEth: '-100.5',
        avgPrice: '1.005',
        noFeePrice: '0.5'
      });
    }
  });
});
describe("tradeActions.calculateTradeTotals", function () {
  // 5 tests total
  var test = function (t) {
    it(t.description, function () {
      t.assertions(augur.calculateTradeTotals(t.type, t.numShares, t.limitPrice, t.tradeActions));
    });
  };
  test({
    description: 'Should calculateTradeTotals given no trade actions',
    type: 'buy',
    numShares: '10',
    limitPrice: '0.5',
    tradeActions: [],
    assertions: function (output) {
      assert.deepEqual(output, {
        numShares: '10',
        limitPrice: '0.5',
        side: 'buy',
        totalFee: 0,
        totalCost: 0,
      });
    }
  });
  test({
    description: 'Should calculateTradeTotals given one bid trade action',
    type: 'buy',
    numShares: '10',
    limitPrice: '0.5',
    tradeActions: [{
    	action: 'BID',
    	shares: '10',
    	gasEth: '0.000000000725202',
    	feeEth: '0.05',
    	feePercent: '1',
    	costEth: '-5.05',
    	avgPrice: '0.505',
    	noFeePrice: '0.5'
    }],
    assertions: function (output) {
      assert.deepEqual(output, {
        numShares: '10',
        limitPrice: '0.5',
        side: 'buy',
        totalFee: '0.05',
        totalCost: '-5.05',
        tradeActions:
        [ { action: 'BID',
           shares: '10',
           gasEth: '0.000000000725202',
           feeEth: '0.05',
           feePercent: '1',
           costEth: '-5.05',
           avgPrice: '0.505',
           noFeePrice: '0.5' } ],
        tradingFeesEth: '0.05',
        gasFeesRealEth: '0.000000000725202',
        feePercent: '1'
      });
    }
  });
  test({
    description: 'Should calculateTradeTotals given one ask trade action',
    type: 'sell',
    numShares: '100',
    limitPrice: '0.5',
    tradeActions: [{
      action: 'ASK',
      avgPrice: '0.499',
      costEth: '49.9',
      feeEth: '0.1',
      feePercent: '0.2',
      gasEth: '0.000000064829941155',
      noFeePrice: '0.5',
      shares: '100'
    }],
    assertions: function (output) {
      assert.deepEqual(output, {
        numShares: '100',
        limitPrice: '0.5',
        side: 'sell',
        totalFee: '0.1',
        totalCost: '49.9',
        tradeActions:
        [ { action: 'ASK',
           avgPrice: '0.499',
           costEth: '49.9',
           feeEth: '0.1',
           feePercent: '0.2',
           gasEth: '0.000000064829941155',
           noFeePrice: '0.5',
           shares: '100' } ],
        tradingFeesEth: '0.1',
        gasFeesRealEth: '0.000000064829941155',
        feePercent: '0.200803212851405622'
      });
    }
  });
  test({
    description: 'Should calculateTradeTotals given multiple bid/buy actions',
    type: 'buy',
    numShares: '20',
    limitPrice: '0.5',
    tradeActions: [{
    	action: 'BID',
    	shares: '10',
    	gasEth: '0.000000000725202',
    	feeEth: '0.05',
    	feePercent: '1',
    	costEth: '-5.05',
    	avgPrice: '0.505',
    	noFeePrice: '0.5'
    }, {
      action: 'BUY',
      shares: '10',
      gasEth: '0.000000073265586945',
      feeEth: '0.05',
      feePercent: '1',
      costEth: '-5',
      avgPrice: '0.5',
      noFeePrice: '0.495'
    }],
    assertions: function (output) {
      assert.deepEqual(output, {
        numShares: '20',
        limitPrice: '0.5',
        side: 'buy',
        totalFee: '0.1',
        totalCost: '-10.05',
        tradeActions:
        [ { action: 'BID',
           shares: '10',
           gasEth: '0.000000000725202',
           feeEth: '0.05',
           feePercent: '1',
           costEth: '-5.05',
           avgPrice: '0.505',
           noFeePrice: '0.5' },
         { action: 'BUY',
           shares: '10',
           gasEth: '0.000000073265586945',
           feeEth: '0.05',
           feePercent: '1',
           costEth: '-5',
           avgPrice: '0.5',
           noFeePrice: '0.495' } ],
        tradingFeesEth: '0.1',
        gasFeesRealEth: '0.000000073990788945',
        feePercent: '1.005025125628140704'
      });
    }
  });
  test({
    description: 'Should calculateTradeTotals given multiple sell/shortSell/ask/shortAsk testTradeActions',
    type: 'sell',
    numShares: '400',
    limitPrice: '0.5',
    tradeActions: [{
      action: 'ASK',
      avgPrice: '0.499',
      costEth: '49.9',
      feeEth: '0.1',
      feePercent: '0.2',
      gasEth: '0.000000064829941155',
      noFeePrice: '0.5',
      shares: '100'
    }, {
      action: 'SELL',
      shares: '100',
      gasEth: '0.000000073265586945',
      feeEth: '0.01',
      feePercent: '0.02',
      costEth: '50',
      avgPrice: '0.5',
      noFeePrice: '0.5001'
    }, {
      action: 'SHORT_SELL',
      shares: '100',
      gasEth: '0.00000009860871882',
      feeEth: '0.01',
      feePercent: '0.02',
      costEth: '-50',
      avgPrice: '0.5',
      noFeePrice: '0.5001'
    }, {
      action: 'SHORT_ASK',
      shares: '100',
      gasEth: '0.00000012985676553',
      feeEth: '0.5',
      feePercent: '1',
      costEth: '-100.5',
      avgPrice: '1.005',
      noFeePrice: '0.5'
    }],
    assertions: function (output) {
      assert.deepEqual(output, {
        numShares: '400',
        limitPrice: '0.5',
        side: 'sell',
        totalFee: '0.62',
        totalCost: '-50.6',
        tradeActions:
        [ { action: 'ASK',
           avgPrice: '0.499',
           costEth: '49.9',
           feeEth: '0.1',
           feePercent: '0.2',
           gasEth: '0.000000064829941155',
           noFeePrice: '0.5',
           shares: '100' },
         { action: 'SELL',
           shares: '100',
           gasEth: '0.000000073265586945',
           feeEth: '0.01',
           feePercent: '0.02',
           costEth: '50',
           avgPrice: '0.5',
           noFeePrice: '0.5001' },
         { action: 'SHORT_SELL',
           shares: '100',
           gasEth: '0.00000009860871882',
           feeEth: '0.01',
           feePercent: '0.02',
           costEth: '-50',
           avgPrice: '0.5',
           noFeePrice: '0.5001' },
         { action: 'SHORT_ASK',
           shares: '100',
           gasEth: '0.00000012985676553',
           feeEth: '0.5',
           feePercent: '1',
           costEth: '-100.5',
           avgPrice: '1.005',
           noFeePrice: '0.5' } ],
        tradingFeesEth: '0.62',
        gasFeesRealEth: '0.00000036656101245',
        feePercent: '1.210464662241311988'
      });
    }
  });
});
describe("getTradingActions", function () {
  var testFields = [
    "action",
    "shares",
    "feeEth",
    "costEth",
    "avgPrice",
    "feePercent",
    "noFeePrice"
  ];
  function testTradeActions(actions, expected) {
    for (var i = 0; i < expected.length; ++i) {
      for (var j = 0; j < testFields.length; ++j) {
        assert.strictEqual(actions[i][testFields[j]], expected[i][testFields[j]]);
      }
    }
  }
  function runTestCase(testCase) {
    it(testCase.description, function () {
      var actions = augur.getTradingActions({
        type: testCase.type,
        orderShares: testCase.orderShares,
        orderLimitPrice: testCase.orderLimitPrice,
        takerFee: testCase.takerFee,
        makerFee: testCase.makerFee,
        userAddress: testCase.userAddress,
        userPositionShares: testCase.userPositionShares,
        outcomeId: testCase.outcomeId,
        range: testCase.range,
        marketOrderBook: testCase.marketOrderBook,
        scalarMinMax: testCase.scalarMinMax
      });
      testCase.assertions(actions);
    });
  }
  var txOriginal;
  var calculateTradeTotals;
  before("getTradingActions", function () {
    txOriginal = augur.store.getState().contractsAPI.functions;
    calculateTradeTotals = augur.calculateTradeTotals;
    augur.store.getState().contractsAPI.functions = new require("augur-contracts").Tx(constants.DEFAULT_NETWORK_ID).functions;
    augur.calculateTradeTotals = function (type, numShares, limitPrice, tradeActions) {
      return tradeActions;
    };
  });
  after("getTradingActions", function () {
    augur.store.getState().contractsAPI.functions = txOriginal;
  });
  describe("buy actions", function () {
    runTestCase({
      description: "no asks",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "BID",
          shares: "5",
          gasEth: "0.01450404",
          feeEth: "0.0288",
          costEth: "-3.0288",
          avgPrice: "0.60576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });
    runTestCase({
      description: "no limit price and no asks",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: null,
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 0);
      }
    });
    runTestCase({
      description: "no asks, scalar event, limit price < 0",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: "-0.5",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "20",
      marketOrderBook: {
        buy: {},
        sell: {}
      },
      scalarMinMax: {minValue: -10, maxValue: 10},
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          "action": "BID",
          "shares": "5",
          "gasEth": "0.01450404",
          "feeEth": "0.4738125",
          "feePercent": "0.9975",
          "costEth": "-47.9738125",
          "avgPrice": "9.5947625",
          "noFeePrice": "9.5"
        }];
        testTradeActions(actions, expected);
      }
    });
    runTestCase({
      description: "no asks, scalar event, limit price 0",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: "0",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "20",
      marketOrderBook: {
        buy: {},
        sell: {}
      },
      scalarMinMax: {minValue: -10, maxValue: 10},
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "BID",
          shares: "5",
          gasEth: "0.01450404",
          feeEth: "0.5",
          feePercent: "1",
          costEth: "-50.5",
          avgPrice: "10.1",
          noFeePrice: "10"
        }];
        testTradeActions(actions, expected);
      }
    });
    runTestCase({
      description: "no asks, scalar event, limit price > 0",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: "0.5",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "20",
      marketOrderBook: {
        buy: {},
        sell: {}
      },
      scalarMinMax: {minValue: -10, maxValue: 10},
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "BID",
          shares: "5",
          gasEth: "0.01450404",
          feeEth: "0.5236875",
          feePercent: "0.9975",
          costEth: "-53.0236875",
          avgPrice: "10.6047375",
          noFeePrice: "10.5"
        }];
        testTradeActions(actions, expected);
      }
    });
    runTestCase({
      description: "no limit price and no asks",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: null,
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 0);
      }
    });
    runTestCase({
      description: "no suitable asks",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {
          "order1": {
            id: "order1",
            type: "sell",
            amount: "5",
            price: "0.7", // price too high
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            owner: abi.format_address("abcd1234"), // user's ask
            type: "sell",
            amount: "5",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          },
          "order3": {
            id: "order3",
            type: "sell",
            amount: "5",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "differentOutcome" // different outcome
          }
        }
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "BID",
          shares: "5",
          gasEth: "0.01450404",
          feeEth: "0.0288",
          costEth: "-3.0288",
          avgPrice: "0.60576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });
    runTestCase({
      description: "ask with same shares and price",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {
          "order1": {
            id: "order1",
            type: "sell",
            amount: "5",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          }
        }
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "BUY",
          shares: "5",
          gasEth: "0.01574842",
          feeEth: "0.0576",
          costEth: "-3.0576",
          avgPrice: "0.61152",
          feePercent: "1.8838304552590266",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });
    runTestCase({
      description: "ask with same shares and price, shares below precision limit",
      type: "buy",
      orderShares: "0.0001",
      orderLimitPrice: "0.8",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {
          "order1": {
            id: "order1",
            type: "sell",
            amount: "0.0001",
            price: "0.8",
            fullPrecisionPrice: "0.8",
            outcome: "outcomeasdf123"
          }
        }
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        var expected = [{
          action: "BUY",
          shares: "0.0001",
          gasEth: "0.01574842",
          feeEth: "0.000001024",
          costEth: "-0.000081024",
          avgPrice: "0.81024",
          feePercent: "1.263823064770932",
          noFeePrice: "0.8"
        }];
        assert.lengthOf(actions, expected.length);
        testTradeActions(actions, expected);
      }
    });
    runTestCase({
      description: "ask with less shares and same price",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {
          "order1": {
            id: "order1",
            type: "sell",
            amount: "2",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          }
        }
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "BUY",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.02304",
          costEth: "-1.22304",
          avgPrice: "0.61152",
          feePercent: "1.8838304552590266",
          noFeePrice: "0.6"
        }, {
          action: "BID",
          shares: "3",
          gasEth: "0.01450404",
          feeEth: "0.01728",
          costEth: "-1.81728",
          avgPrice: "0.60576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });
    runTestCase({
      description: "ask with same shares and lower price",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {
          "order1": {
            id: "order1",
            type: "sell",
            amount: "5",
            price: "0.4",
            fullPrecisionPrice: "0.4",
            outcome: "outcomeasdf123"
          }
        }
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "BUY",
          shares: "5",
          gasEth: "0.01574842",
          feeEth: "0.0384",
          costEth: "-2.0384",
          avgPrice: "0.40768",
          feePercent: "1.8838304552590266",
          noFeePrice: "0.4"
        }];
        testTradeActions(actions, expected);
      }
    });
    runTestCase({
      description: "ask with less shares and lower price",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {
          "order1": {
            id: "order1",
            type: "sell",
            amount: "2",
            price: "0.4",
            fullPrecisionPrice: "0.4",
            outcome: "outcomeasdf123"
          }
        }
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "BUY",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.01536",
          costEth: "-0.81536",
          avgPrice: "0.40768",
          feePercent: "1.8838304552590266",
          noFeePrice: "0.4"
        }, {
          action: "BID",
          shares: "3",
          gasEth: "0.01450404",
          feeEth: "0.01728",
          costEth: "-1.81728",
          avgPrice: "0.60576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });
    runTestCase({
      description: "asks with same shares and lower prices",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {
          "order1": {
            id: "order1",
            type: "sell",
            amount: "1",
            price: "0.4",
            fullPrecisionPrice: "0.4",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "sell",
            amount: "2",
            price: "0.3",
            fullPrecisionPrice: "0.3",
            outcome: "outcomeasdf123"
          },
          "order3": {
            id: "order3",
            type: "sell",
            amount: "2",
            price: "0.2",
            fullPrecisionPrice: "0.2",
            outcome: "outcomeasdf123"
          }
        }
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "BUY",
          shares: "5",
          gasEth: "0.01574842",
          feeEth: "0.02288",
          costEth: "-1.42288",
          avgPrice: "0.284576",
          feePercent: "1.6080062970875969",
          noFeePrice: "0.28"
        }];
        testTradeActions(actions, expected);
      }
    });
    runTestCase({
      description: "asks with less shares and lower price",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {
          "order1": {
            id: "order1",
            type: "sell",
            amount: "1",
            price: "0.4",
            fullPrecisionPrice: "0.4",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "sell",
            amount: "2",
            price: "0.3",
            fullPrecisionPrice: "0.3",
            outcome: "outcomeasdf123"
          }
        }
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "BUY",
          shares: "3",
          gasEth: "0.01574842",
          feeEth: "0.01776",
          costEth: "-1.01776",
          avgPrice: "0.339253333333333333",
          feePercent: "1.7450086464392391",
          noFeePrice: "0.333333333333333333"
        }, {
          action: "BID",
          shares: "2",
          gasEth: "0.01450404",
          feeEth: "0.01152",
          costEth: "-1.21152",
          avgPrice: "0.60576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });
    runTestCase({
      description: "no limit price specified and asks on order book",
      type: "buy",
      orderShares: "5",
      orderLimitPrice: null,
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {
          "order1": {
            id: "order1",
            type: "sell",
            amount: "1",
            price: "0.4",
            fullPrecisionPrice: "0.4",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "sell",
            amount: "2",
            price: "0.3",
            fullPrecisionPrice: "0.3",
            outcome: "outcomeasdf123"
          }
        }
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "BUY",
          shares: "3",
          gasEth: "0.01574842",
          feeEth: "0.01776",
          costEth: "-1.01776",
          noFeePrice: "0.333333333333333333",
          feePercent: "1.7450086464392391",
          avgPrice: "0.339253333333333333"
        }];
        testTradeActions(actions, expected);
      }
    });
  });
  describe("sell actions", function () {
    runTestCase({
      description: "no bids, no position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "SHORT_ASK",
          shares: "5",
          gasEth: "0.02791268",
          feeEth: "0.0288",
          costEth: "-5.0288",
          avgPrice: "1.00576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "no bids, scalar event, limit price < 0, position exceeds order size",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "-0.5",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "6",
      outcomeId: "outcomeasdf123",
      range: "20",
      marketOrderBook: {
        buy: {},
        sell: {}
      },
      scalarMinMax: {minValue: -10, maxValue: 10},
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "ASK",
          shares: "5",
          gasEth: "0.01393518",
          feeEth: "0.4738125",
          feePercent: "0.9975",
          costEth: "47.0261875",
          avgPrice: "9.4052375",
          noFeePrice: "9.5"
        }];
        testTradeActions(actions, expected);
      }
    });
    runTestCase({
      description: "no bids, scalar event, limit price 0, position exceeds order size",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "6",
      outcomeId: "outcomeasdf123",
      range: "20",
      marketOrderBook: {
        buy: {},
        sell: {}
      },
      scalarMinMax: {minValue: -10, maxValue: 10},
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "ASK",
          shares: "5",
          gasEth: "0.01393518",
          feeEth: "0.5",
          feePercent: "1",
          costEth: "49.5",
          avgPrice: "9.9",
          noFeePrice: "10"
        }];
        testTradeActions(actions, expected);
      }
    });
    runTestCase({
      description: "no bids, scalar event, limit price > 0, position exceeds order size",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.5",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "6",
      outcomeId: "outcomeasdf123",
      range: "20",
      marketOrderBook: {
        buy: {},
        sell: {}
      },
      scalarMinMax: {minValue: -10, maxValue: 10},
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "ASK",
          shares: "5",
          gasEth: "0.01393518",
          feeEth: "0.5236875",
          feePercent: "0.9975",
          costEth: "51.9763125",
          avgPrice: "10.3952625",
          noFeePrice: "10.5"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and prices, no position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "5",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "SHORT_SELL",
          shares: "5",
          gasEth: "0.02119592",
          feeEth: "0.0576",
          costEth: "-2.0576",
          avgPrice: "0.41152",
          feePercent: "2.7993779160186625",
          noFeePrice: "0.42304"
        }];
        assert.deepEqual(actions, expected);
      }
    });

    runTestCase({
      description: "bid with less amount and same price, position greater than remaining order shares",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "6",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "2",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.02304",
          costEth: "1.17696",
          avgPrice: "0.58848",
          feePercent: "1.9575856443719412",
          noFeePrice: "0.6"
        }, {
          action: "ASK",
          shares: "3",
          gasEth: "0.01393518",
          feeEth: "0.01728",
          costEth: "1.78272",
          avgPrice: "0.59424",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with less amount and same price, position smaller than remaining order shares",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "4",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "2",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 3);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.02304",
          costEth: "1.17696",
          avgPrice: "0.58848",
          feePercent: "1.9575856443719412",
          noFeePrice: "0.6"
        }, {
          action: "ASK",
          shares: "2",
          gasEth: "0.01393518",
          feeEth: "0.01152",
          costEth: "1.18848",
          avgPrice: "0.59424",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }, {
          action: "SHORT_ASK",
          shares: "1",
          gasEth: "0.02791268",
          feeEth: "0.00576",
          costEth: "-1.00576",
          avgPrice: "1.00576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with less amount and same price, no position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "2",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SHORT_SELL",
          shares: "2",
          gasEth: "0.02119592",
          feeEth: "0.02304",
          costEth: "-0.82304",
          avgPrice: "0.41152",
          feePercent: "2.7993779160186625",
          noFeePrice: "0.42304"
        }, {
          action: "SHORT_ASK",
          shares: "3",
          gasEth: "0.02791268",
          feeEth: "0.01728",
          costEth: "-3.01728",
          avgPrice: "1.00576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        assert.deepEqual(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and higher price, no position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "5",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "SHORT_SELL",
          shares: "5",
          gasEth: "0.02119592",
          feeEth: "0.0588",
          costEth: "-1.5588",
          avgPrice: "0.31176",
          feePercent: "3.7721324095458044",
          noFeePrice: "0.32352"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with less shares and higher price, no position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "2",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SHORT_SELL",
          shares: "2",
          gasEth: "0.02119592",
          feeEth: "0.02352",
          costEth: "-0.62352",
          avgPrice: "0.31176",
          feePercent: "3.7721324095458044",
          noFeePrice: "0.32352"
        }, {
          action: "SHORT_ASK",
          shares: "3",
          gasEth: "0.02791268",
          feeEth: "0.01728",
          costEth: "-3.01728",
          avgPrice: "1.00576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bids with less shares and higher prices, no position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "1",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "buy",
            amount: "2",
            price: "0.8",
            fullPrecisionPrice: "0.8",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SHORT_SELL",
          shares: "3",
          gasEth: "0.02119592",
          feeEth: "0.03224",
          costEth: "-0.73224",
          avgPrice: "0.24408",
          feePercent: "4.4029280017480607",
          noFeePrice: "0.254826666666666666"
        }, {
          action: "SHORT_ASK",
          shares: "2",
          gasEth: "0.02791268",
          feeEth: "0.01152",
          costEth: "-2.01152",
          avgPrice: "1.00576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bids with same shares and higher prices, no position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "1",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "buy",
            amount: "2",
            price: "0.8",
            fullPrecisionPrice: "0.8",
            outcome: "outcomeasdf123"
          },
          "order3": {
            id: "order3",
            type: "buy",
            amount: "2",
            price: "0.9",
            fullPrecisionPrice: "0.9",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "SHORT_SELL",
          shares: "5",
          gasEth: "0.02119592",
          feeEth: "0.0452",
          costEth: "-0.9452",
          avgPrice: "0.18904",
          feePercent: "4.7820567075751163",
          noFeePrice: "0.19808"
        }];
        assert.deepEqual(actions, expected);
      }
    });

    runTestCase({
      description: "no limit price, bids with same shares, no position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: null,
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "1",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "buy",
            amount: "2",
            price: "0.8",
            fullPrecisionPrice: "0.8",
            outcome: "outcomeasdf123"
          },
          "order3": {
            id: "order3",
            type: "buy",
            amount: "2",
            price: "0.9",
            fullPrecisionPrice: "0.9",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 0);
      }
    });

    runTestCase({
      description: "no bids, smaller position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "2",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "ASK",
          shares: "2",
          gasEth: "0.01393518",
          feeEth: "0.01152",
          costEth: "1.18848",
          avgPrice: "0.59424",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }, {
          action: "SHORT_ASK",
          shares: "3",
          gasEth: "0.02791268",
          feeEth: "0.01728",
          costEth: "-3.01728",
          avgPrice: "1.00576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and price, smaller position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "2",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "5",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.02304",
          costEth: "1.17696",
          avgPrice: "0.58848",
          feePercent: "1.9575856443719412",
          noFeePrice: "0.6"
        }, {
          action: "SHORT_SELL",
          shares: "3",
          gasEth: "0.02119592",
          feeEth: "0.03456",
          costEth: "-1.23456",
          avgPrice: "0.41152",
          feePercent: "2.7993779160186625",
          noFeePrice: "0.42304"
        }];
        assert.deepEqual(actions, expected);
      }
    });

    runTestCase({
      description: "bid with less shares and same price, smaller position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "2",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "2",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.02304",
          costEth: "1.17696",
          avgPrice: "0.58848",
          feePercent: "1.9575856443719412",
          noFeePrice: "0.6"
        }, {
          action: "SHORT_ASK",
          shares: "3",
          gasEth: "0.02791268",
          feeEth: "0.01728",
          costEth: "-3.01728",
          avgPrice: "1.00576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and higher price, smaller position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "2",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "5",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.02352",
          costEth: "1.37648",
          avgPrice: "0.68824",
          feePercent: "1.7087062652563059",
          noFeePrice: "0.7"
        }, {
          action: "SHORT_SELL",
          shares: "3",
          gasEth: "0.02119592",
          feeEth: "0.03528",
          costEth: "-0.93528",
          avgPrice: "0.31176",
          feePercent: "3.7721324095458044",
          noFeePrice: "0.32352"
        }];
        assert.deepEqual(actions, expected);
      }
    });

    runTestCase({
      description: "bid with less shares and higher price, smaller position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "2",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "2",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.02352",
          costEth: "1.37648",
          avgPrice: "0.68824",
          feePercent: "1.7087062652563059",
          noFeePrice: "0.7"
        }, {
          action: "SHORT_ASK",
          shares: "3",
          gasEth: "0.02791268",
          feeEth: "0.01728",
          costEth: "-3.01728",
          avgPrice: "1.00576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bids with less shares and higher prices, smaller position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "2",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "1",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "buy",
            amount: "2",
            price: "0.8",
            fullPrecisionPrice: "0.8",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 3);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.02048",
          costEth: "1.57952",
          avgPrice: "0.78976",
          feePercent: "1.2965964343598055",
          noFeePrice: "0.8"
        }, {
          action: "SHORT_SELL",
          shares: "1",
          gasEth: "0.02119592",
          feeEth: "0.01176",
          costEth: "-0.31176",
          avgPrice: "0.31176",
          feePercent: "3.7721324095458044",
          noFeePrice: "0.32352"
        }, {
          action: "SHORT_ASK",
          shares: "2",
          gasEth: "0.02791268",
          feeEth: "0.01152",
          costEth: "-2.01152",
          avgPrice: "1.00576",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bids with same shares and higher prices, smaller position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "2",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "1",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "buy",
            amount: "2",
            price: "0.8",
            fullPrecisionPrice: "0.8",
            outcome: "outcomeasdf123"
          },
          "order3": {
            id: "order3",
            type: "buy",
            amount: "2",
            price: "0.9",
            fullPrecisionPrice: "0.9",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.01296",
          costEth: "1.78704",
          avgPrice: "0.89352",
          feePercent: "0.72522159548751",
          noFeePrice: "0.9"
        }, {
          action: "SHORT_SELL",
          shares: "3",
          gasEth: "0.02119592",
          feeEth: "0.03224",
          costEth: "-0.73224",
          avgPrice: "0.24408",
          feePercent: "4.4029280017480607",
          noFeePrice: "0.254826666666666666"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "no limit price, bids with same shares, smaller position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: null,
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "2",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "1",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "buy",
            amount: "2",
            price: "0.8",
            fullPrecisionPrice: "0.8",
            outcome: "outcomeasdf123"
          },
          "order3": {
            id: "order3",
            type: "buy",
            amount: "2",
            price: "0.9",
            fullPrecisionPrice: "0.9",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.01296",
          costEth: "1.78704",
          avgPrice: "0.89352",
          feePercent: "0.72522159548751",
          noFeePrice: "0.9"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "no bids, same position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "5",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {},
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "ASK",
          shares: "5",
          gasEth: "0.01393518",
          feeEth: "0.0288",
          costEth: "2.9712",
          avgPrice: "0.59424",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and price, same position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "5",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "5",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "SELL",
          shares: "5",
          gasEth: "0.01574842",
          feeEth: "0.0576",
          costEth: "2.9424",
          avgPrice: "0.58848",
          feePercent: "1.9575856443719412",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with less shares and same price, same position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "5",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "2",
            price: "0.6",
            fullPrecisionPrice: "0.6",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.02304",
          costEth: "1.17696",
          avgPrice: "0.58848",
          feePercent: "1.9575856443719412",
          noFeePrice: "0.6"
        }, {
          action: "ASK",
          shares: "3",
          gasEth: "0.01393518",
          feeEth: "0.01728",
          costEth: "1.78272",
          avgPrice: "0.59424",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and higher price, same position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "5",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "5",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "SELL",
          shares: "5",
          gasEth: "0.01574842",
          feeEth: "0.0588",
          costEth: "3.4412",
          avgPrice: "0.68824",
          feePercent: "1.7087062652563059",
          noFeePrice: "0.7"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with less shares and higher price, same position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "5",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "2",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SELL",
          shares: "2",
          gasEth: "0.01574842",
          feeEth: "0.02352",
          costEth: "1.37648",
          avgPrice: "0.68824",
          feePercent: "1.7087062652563059",
          noFeePrice: "0.7"
        }, {
          action: "ASK",
          shares: "3",
          gasEth: "0.01393518",
          feeEth: "0.01728",
          costEth: "1.78272",
          avgPrice: "0.59424",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bids with less shares and higher prices, same position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "5",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "1",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "buy",
            amount: "2",
            price: "0.8",
            fullPrecisionPrice: "0.8",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 2);
        var expected = [{
          action: "SELL",
          shares: "3",
          gasEth: "0.01574842",
          feeEth: "0.03224",
          costEth: "2.26776",
          avgPrice: "0.75592",
          feePercent: "1.4216671958231911",
          noFeePrice: "0.766666666666666666"
        }, {
          action: "ASK",
          shares: "2",
          gasEth: "0.01393518",
          feeEth: "0.01152",
          costEth: "1.18848",
          avgPrice: "0.59424",
          feePercent: "0.96",
          noFeePrice: "0.6"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bids with same shares and higher prices, same position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "0.6",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "5",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "1",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "buy",
            amount: "2",
            price: "0.8",
            fullPrecisionPrice: "0.8",
            outcome: "outcomeasdf123"
          },
          "order3": {
            id: "order3",
            type: "buy",
            amount: "2",
            price: "0.9",
            fullPrecisionPrice: "0.9",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "SELL",
          shares: "5",
          gasEth: "0.01574842",
          feeEth: "0.0452",
          costEth: "4.0548",
          avgPrice: "0.81096",
          feePercent: "1.1147282233402387",
          noFeePrice: "0.82"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "no limit price, bids with same shares, same position",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: null,
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "5",
      outcomeId: "outcomeasdf123",
      range: "1",
      marketOrderBook: {
        buy: {
          "order1": {
            id: "order1",
            type: "buy",
            amount: "1",
            price: "0.7",
            fullPrecisionPrice: "0.7",
            outcome: "outcomeasdf123"
          },
          "order2": {
            id: "order2",
            type: "buy",
            amount: "2",
            price: "0.8",
            fullPrecisionPrice: "0.8",
            outcome: "outcomeasdf123"
          },
          "order3": {
            id: "order3",
            type: "buy",
            amount: "2",
            price: "0.9",
            fullPrecisionPrice: "0.9",
            outcome: "outcomeasdf123"
          }
        },
        sell: {}
      },
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        assert.lengthOf(actions, 1);
        var expected = [{
          action: "SELL",
          shares: "5",
          gasEth: "0.01574842",
          feeEth: "0.0452",
          costEth: "4.0548",
          avgPrice: "0.81096",
          feePercent: "1.1147282233402387",
          noFeePrice: "0.82"
        }];
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and prices, no position, scalar event",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "17",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "0",
      outcomeId: "2",
      range: "5",
      marketOrderBook: {
        buy: {
          "0x1": {
            id: "0x1",
            type: "buy",
            amount: "5",
            price: "17",
            fullPrecisionPrice: "17",
            outcome: "2"
          }
        },
        sell: {}
      },
      scalarMinMax: {minValue: "15", maxValue: "20"}, // range [15, 20]
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        var expected = [{
          action: "SHORT_SELL",
          shares: "5",
          gasEth: "0.02119592",
          feeEth: "0.288",
          feePercent: "0.337679392177094",
          costEth: "-85.288",
          avgPrice: "17.0576",
          noFeePrice: "17.1152"
        }];
        assert.lengthOf(actions, expected.length);
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and prices, equal size position, scalar event",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "17",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "5",
      outcomeId: "2",
      range: "5",
      marketOrderBook: {
        buy: {
          "0x1": {
            id: "0x1",
            type: "buy",
            amount: "5",
            price: "17",
            fullPrecisionPrice: "17",
            outcome: "2"
          }
        },
        sell: {}
      },
      scalarMinMax: {minValue: "15", maxValue: "20"}, // range [15, 20]
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        var expected = [{
          action: "SELL",
          shares: "5",
          gasEth: "0.01574842",
          feeEth: "0.192",
          feePercent: "1.9575856443719412",
          costEth: "9.808",
          avgPrice: "1.9616",
          noFeePrice: "2"
        }];
        assert.lengthOf(actions, expected.length);
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and prices, smaller position, scalar event",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "17",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "3",
      outcomeId: "2",
      range: "5",
      marketOrderBook: {
        buy: {
          "0x1": {
            id: "0x1",
            type: "buy",
            amount: "5",
            price: "17",
            fullPrecisionPrice: "17",
            outcome: "2"
          }
        },
        sell: {}
      },
      scalarMinMax: {minValue: "15", maxValue: "20"}, // range [15, 20]
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        var expected = [{
          action: "SELL",
          shares: "3",
          gasEth: "0.01574842",
          feeEth: "0.1152",
          feePercent: "1.9575856443719412",
          costEth: "5.8848",
          avgPrice: "1.9616",
          noFeePrice: "2"
        }, {
          action: "SHORT_SELL",
          shares: "2",
          gasEth: "0.02119592",
          feeEth: "0.1152",
          feePercent: "0.337679392177094",
          costEth: "-34.1152",
          avgPrice: "17.0576",
          noFeePrice: "17.1152"
        }];
        assert.lengthOf(actions, expected.length);
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and prices, smaller position, scalar event",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "17",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "3",
      outcomeId: "2",
      range: "5",
      marketOrderBook: {
        buy: {
          "0x1": {
            id: "0x1",
            type: "buy",
            amount: "5",
            price: "17",
            fullPrecisionPrice: "17",
            outcome: "2"
          }
        },
        sell: {}
      },
      scalarMinMax: {minValue: "15", maxValue: "20"}, // range [15, 20]
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        var expected = [{
          action: "SELL",
          shares: "3",
          gasEth: "0.01574842",
          feeEth: "0.1152",
          feePercent: "1.9575856443719412",
          costEth: "5.8848",
          avgPrice: "1.9616",
          noFeePrice: "2"
        }, {
          action: "SHORT_SELL",
          shares: "2",
          gasEth: "0.02119592",
          feeEth: "0.1152",
          feePercent: "0.337679392177094",
          costEth: "-34.1152",
          avgPrice: "17.0576",
          noFeePrice: "17.1152"
        }];
        assert.lengthOf(actions, expected.length);
        testTradeActions(actions, expected);
      }
    });

    runTestCase({
      description: "bid with same shares and prices, larger position, scalar event",
      type: "sell",
      orderShares: "5",
      orderLimitPrice: "17",
      takerFee: "0.02",
      makerFee: "0.01",
      userPositionShares: "10",
      outcomeId: "2",
      range: "5",
      marketOrderBook: {
        buy: {
          "0x1": {
            id: "0x1",
            type: "buy",
            amount: "5",
            price: "17",
            fullPrecisionPrice: "17",
            outcome: "2"
          }
        },
        sell: {}
      },
      scalarMinMax: {minValue: "15", maxValue: "20"}, // range [15, 20]
      userAddress: "abcd1234",
      assertions: function (actions) {
        assert.isArray(actions);
        var expected = [{
          action: "SELL",
          shares: "5",
          gasEth: "0.01574842",
          feeEth: "0.192",
          feePercent: "1.9575856443719412",
          costEth: "9.808",
          avgPrice: "1.9616",
          noFeePrice: "2"
        }];
        assert.lengthOf(actions, expected.length);
        testTradeActions(actions, expected);
      }
    });
  });
});
