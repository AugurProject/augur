"use strict";

var assert = require("chai").assert;
var utils = require("../../../src/utilities.js");
var augur = require('../../../src/');
var transact,
  getVotePeriod,
  getFeesCollected,
  getGasPrice,
  getAfterRep,
  getCurrentPeriod,
  getCurrentPeriodProgress;
// 7 tests total

describe("collectFees", function() {
	// 7 tests total
  var getFeesCollectedCC = 1;
  var test = function(t) {
    it(t.description, function() {
      getFeesCollectedCC = 1;
			// set mocks to a per test level version
      augur.getCurrentPeriodProgress = t.getCurrentPeriodProgress;
      augur.getCurrentPeriod = t.getCurrentPeriod;
      augur.getVotePeriod = t.getVotePeriod;
      augur.getFeesCollected = t.getFeesCollected;
      augur.getAfterRep = t.getAfterRep;
      augur.transact = t.transact;
      augur.rpc.getGasPrice = t.getGasPrice;
			// call collectFees
      augur.collectFees(t.branch, t.sender, t.periodLength, t.onSent, t.onSuccess, t.onFailed);
    });
  };

  before(function() {
		// save normal versions of each function that will be mocked
    getCurrentPeriodProgress = augur.getCurrentPeriodProgress;
    getCurrentPeriod = augur.getCurrentPeriod;
    getVotePeriod = augur.getVotePeriod;
    getFeesCollected = augur.getFeesCollected;
    getAfterRep = augur.getAfterRep;
    transact = augur.transact;
    getGasPrice = augur.rpc.getGasPrice;
  });

  after(function() {
		// revert augur functions to the original functions
    augur.getCurrentPeriodProgress = getCurrentPeriodProgress;
    augur.getCurrentPeriod = getCurrentPeriod;
    augur.getVotePeriod = getVotePeriod;
    augur.getFeesCollected = getFeesCollected;
    augur.getAfterRep = getAfterRep;
    augur.transact = transact;
    augur.rpc.getGasPrice = getGasPrice;
  });

  test({
    description: 'should fail if not in the 2nd half of reporting period',
    getCurrentPeriodProgress: function(periodLength) {
			// return that we are only 25% of the way through the reporting period. this should trigger an onFailed call.
      return 25;
    },
    branch: '0xb1',
    sender: '0xa1',
    periodLength: '100',
    onSent: function(t) {
		 console.log('sent', t);
    },
    onSuccess: function(t) {
		 console.log('success', t);
    },
 		onFailed: function(t) {
   assert.deepEqual(t, { '-2': 'needs to be second half of reporting period to claim rep' });
 }
  });

  test({
    description: 'should return a callreturn of 2 if the fees have already been collected.',
    getCurrentPeriodProgress: function(periodLength) {
			// return that we are in deed past the 50% mark of the reporting period.
      return 75;
    },
    getCurrentPeriod: function(periodLength) {
			// we will return that we are currently in period 100 just to use a number.
      return 100;
    },
    getVotePeriod: function(branch, cb) {
			// return the voting period as 98
      cb(98);
    },
    getFeesCollected: function(branch, sender, period, cb) {
			// return feesCollected as 1 indicating that the fees have been collected.
      assert.deepEqual(period, 97, 'period passed to getFeesCollected is expected to be 1 less than the period returned from getVotePeriod');
      cb("1");
    },
    branch: '0xb1',
    sender: '0xa1',
    periodLength: '100',
    onSent: function(t) {
      console.log('sent', t);
    },
    onSuccess: function(t) {
      assert.deepEqual(t, { callReturn: '2' });
    },
 		onFailed: function(t) {
   assert.deepEqual(t, { '-2': 'needs to be second half of reporting period to claim rep' });
 }
  });

  test({
    description: 'should return a callreturn of 1 if collection of fees have been completed.',
    getCurrentPeriodProgress: function(periodLength) {
			// return that we are in deed past the 50% mark of the reporting period.
      return 75;
    },
    getCurrentPeriod: function(periodLength) {
			// we will return that we are currently in period 100 just to use a number.
      return 100;
    },
    getVotePeriod: function(branch, cb) {
			// return the voting period as 98
      cb(98);
    },
    getFeesCollected: function(branch, sender, period, cb) {
			// return feesCollected as 1 indicating that the fees have been collected.
      assert.deepEqual(period, 97, 'period passed to getFeesCollected is expected to be 1 less than the period returned from getVotePeriod');
      switch(getFeesCollectedCC) {
        default:
          getFeesCollectedCC++;
          cb("2");
          break;
      }
    },
    getGasPrice: function(cb) {
      cb('14327');
    },
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.CollectFees.collectFees.to);
      assert.deepEqual(tx.params, [ '0xb1', '0xa1' ]);
      assert.deepEqual(tx.gasPrice, '14327');
      assert.deepEqual(tx.value, '0x9a174ebe0');
      onSuccess({ callReturn: "1" });
    },
    branch: '0xb1',
    sender: '0xa1',
    periodLength: '100',
    onSent: function(t) {
      console.log('sent', t);
    },
    onSuccess: function(t) {
      assert.deepEqual(t, { callReturn: '1' });
    },
    onFailed: function(t) {
      assert.deepEqual(t, { '-2': 'needs to be second half of reporting period to claim rep' });
    }
  });

  test({
    description: 'should return a callreturn of 2 if the fees have already been claimed.',
    getCurrentPeriodProgress: function(periodLength) {
			// return that we are in deed past the 50% mark of the reporting period.
      return 75;
    },
    getCurrentPeriod: function(periodLength) {
			// we will return that we are currently in period 100 just to use a number.
      return 100;
    },
    getVotePeriod: function(branch, cb) {
			// return the voting period as 98
      cb(98);
    },
    getFeesCollected: function(branch, sender, period, cb) {
			// return feesCollected as 1 indicating that the fees have been collected.
      assert.deepEqual(period, 97, 'period passed to getFeesCollected is expected to be 1 less than the period returned from getVotePeriod');
      switch(getFeesCollectedCC) {
        default:
          getFeesCollectedCC++;
          cb("2");
          break;
      }
    },
    getGasPrice: function(cb) {
      cb('14327');
    },
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.CollectFees.collectFees.to);
      assert.deepEqual(tx.params, [ '0xb1', '0xa1' ]);
      assert.deepEqual(tx.gasPrice, '14327');
      assert.deepEqual(tx.value, '0x9a174ebe0');
      onSuccess({ callReturn: "2" });
    },
    branch: '0xb1',
    sender: '0xa1',
    periodLength: '100',
    onSent: function(t) {
      console.log('sent', t);
    },
    onSuccess: function(t) {
      assert.deepEqual(t, { callReturn: '2' });
    },
    onFailed: function(t) {
      assert.deepEqual(t, { '-2': 'needs to be second half of reporting period to claim rep' });
    }
  });

  test({
    description: 'should return a callreturn of 2 if after a response from getFeesCollected of not 1.',
    getCurrentPeriodProgress: function(periodLength) {
			// return that we are in deed past the 50% mark of the reporting period.
      return 75;
    },
    getCurrentPeriod: function(periodLength) {
			// we will return that we are currently in period 100 just to use a number.
      return 100;
    },
    getVotePeriod: function(branch, cb) {
			// return the voting period as 98
      cb(98);
    },
    getFeesCollected: function(branch, sender, period, cb) {
			// return feesCollected as 1 indicating that the fees have been collected.
      assert.deepEqual(period, 97, 'period passed to getFeesCollected is expected to be 1 less than the period returned from getVotePeriod');
      switch(getFeesCollectedCC) {
        case 2:
          getFeesCollectedCC++;
          cb("-1");
          break;
        default:
          getFeesCollectedCC++;
          cb("2");
          break;
      }
    },
    getGasPrice: function(cb) {
      cb('14327');
    },
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.CollectFees.collectFees.to);
      assert.deepEqual(tx.params, [ '0xb1', '0xa1' ]);
      assert.deepEqual(tx.gasPrice, '14327');
      assert.deepEqual(tx.value, '0x9a174ebe0');
      onSuccess({ callReturn: "-1" });
    },
    getAfterRep: function(branch, period, sender, cb) {
      cb("0")
    },
    branch: '0xb1',
    sender: '0xa1',
    periodLength: '100',
    onSent: function(t) {
      console.log('sent', t);
    },
    onSuccess: function(t) {
      assert.deepEqual(t, { callReturn: '2' });
    },
    onFailed: function(t) {
      assert.deepEqual(t, { '-2': 'needs to be second half of reporting period to claim rep' });
    }
  });

  test({
    description: 'should return a callreturn of 2 if after a response from getFeesCollected is 1, and getAfterRep returns a number <= 1.',
    getCurrentPeriodProgress: function(periodLength) {
			// return that we are in deed past the 50% mark of the reporting period.
      return 75;
    },
    getCurrentPeriod: function(periodLength) {
			// we will return that we are currently in period 100 just to use a number.
      return 100;
    },
    getVotePeriod: function(branch, cb) {
			// return the voting period as 98
      cb(98);
    },
    getFeesCollected: function(branch, sender, period, cb) {
			// return feesCollected as 1 indicating that the fees have been collected.
      assert.deepEqual(period, 97, 'period passed to getFeesCollected is expected to be 1 less than the period returned from getVotePeriod');
      switch(getFeesCollectedCC) {
        case 2:
          getFeesCollectedCC++;
          cb("1");
          break;
        default:
          getFeesCollectedCC++;
          cb("2");
          break;
      }
    },
    getGasPrice: function(cb) {
      cb('14327');
    },
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.CollectFees.collectFees.to);
      assert.deepEqual(tx.params, [ '0xb1', '0xa1' ]);
      assert.deepEqual(tx.gasPrice, '14327');
      assert.deepEqual(tx.value, '0x9a174ebe0');
      onSuccess({ callReturn: "-1" });
    },
    getAfterRep: function(branch, period, sender, cb) {
      cb("0.5")
    },
    branch: '0xb1',
    sender: '0xa1',
    periodLength: '100',
    onSent: function(t) {
      console.log('sent', t);
    },
    onSuccess: function(t) {
      assert.deepEqual(t, { callReturn: '2' });
    },
    onFailed: function(t) {
      assert.deepEqual(t, { '-2': 'needs to be second half of reporting period to claim rep' });
    }
  });

  test({
    description: 'should return a callreturn of 1 if after a response from getFeesCollected is 1, and getAfterRep returns a number larger than 1',
    getCurrentPeriodProgress: function(periodLength) {
			// return that we are in deed past the 50% mark of the reporting period.
      return 75;
    },
    getCurrentPeriod: function(periodLength) {
			// we will return that we are currently in period 100 just to use a number.
      return 100;
    },
    getVotePeriod: function(branch, cb) {
			// return the voting period as 98
      cb(98);
    },
    getFeesCollected: function(branch, sender, period, cb) {
			// return feesCollected as 1 indicating that the fees have been collected.
      assert.deepEqual(period, 97, 'period passed to getFeesCollected is expected to be 1 less than the period returned from getVotePeriod');
      switch(getFeesCollectedCC) {
        case 2:
          getFeesCollectedCC++;
          cb("1");
          break;
        default:
          getFeesCollectedCC++;
          cb("2");
          break;
      }
    },
    getGasPrice: function(cb) {
      cb('14327');
    },
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.CollectFees.collectFees.to);
      assert.deepEqual(tx.params, [ '0xb1', '0xa1' ]);
      assert.deepEqual(tx.gasPrice, '14327');
      assert.deepEqual(tx.value, '0x9a174ebe0');
      onSuccess({ callReturn: "-1" });
    },
    getAfterRep: function(branch, period, sender, cb) {
      cb("200")
    },
    branch: '0xb1',
    sender: '0xa1',
    periodLength: '100',
    onSent: function(t) {
      console.log('sent', t);
    },
    onSuccess: function(t) {
      assert.deepEqual(t, { callReturn: '1' });
    },
    onFailed: function(t) {
      assert.deepEqual(t, { '-2': 'needs to be second half of reporting period to claim rep' });
    }
  });
});
