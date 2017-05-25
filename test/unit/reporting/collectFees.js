"use strict";

var assert = require("chai").assert;
var proxyquire = require('proxyquire');
var augur = new (require('../../../src/'))();
var noop = require("../../../src/utils/noop");
var apiCollectFees,
  getVotePeriod,
  getFeesCollected,
  getAfterRep;
// 7 tests total

describe("collectFees", function () {
	// 7 tests total
  var getFeesCollectedCC = 1;
  var test = function (t) {
    it(t.description, function () {
      getFeesCollectedCC = 1;
      var collectFees = proxyquire('../../../src/reporting/collect-fees', {
        '../rpc-interface': {
          getGasPrice: function () {
            return '14327';
          }
        },
        '../reporting/get-current-period-progress': t.getCurrentPeriodProgress
      });
			// set mocks to a per test level version
      augur.api.Branches.getVotePeriod = function (params, cb) {
  			// return the voting period as 98
        cb(98);
      };
      augur.api.ConsensusData.getFeesCollected = t.getFeesCollected || noop;
      augur.api.ExpiringEvents.getAfterRep = t.getAfterRep || noop;
      augur.api.CollectFees.collectFees = t.collectFees || noop;
			// call collectFees
      collectFees(t.params);
    });
  };

  beforeEach(function () {
		// save normal versions of each function that will be mocked
    getVotePeriod = augur.api.Branches.getVotePeriod;
    getFeesCollected = augur.api.ConsensusData.getFeesCollected;
    getAfterRep = augur.api.ExpiringEvents.getAfterRep;
    apiCollectFees = augur.api.CollectFees.collectFees;
  });

  afterEach(function () {
		// revert augur functions to the original functions
    augur.api.Branches.getVotePeriod = getVotePeriod;
    augur.api.ConsensusData.getFeesCollected = getFeesCollected;
    augur.api.ExpiringEvents.getAfterRep = getAfterRep;
    augur.api.CollectFees.collectFees = apiCollectFees;
  });

  test({
    description: 'should fail if not in the 2nd half of reporting period',
    params: {
      branch: '0xb1',
      sender: '0xa1',
      periodLength: '100',
      onSent: noop,
      onSuccess: noop,
      onFailed: function (t) {
        assert.deepEqual(t, { '-2': 'needs to be second half of reporting period to claim rep' });
      }
    },
    getCurrentPeriodProgress: function (periodLength) {
      // return that we are only 25% of the way through the reporting period. this should trigger an onFailed call.
      return 25;
    },
  });
  test({
    description: 'should return a callreturn of 2 if the fees have already been collected.',
    params: {
      branch: '0xb1',
      sender: '0xa1',
      periodLength: '100',
      onSent: noop,
      onSuccess: function (t) {
        assert.deepEqual(t, { callReturn: '2' });
      },
   		onFailed: noop
    },
    getCurrentPeriodProgress: function (periodLength) {
			// return that we are in deed past the 50% mark of the reporting period.
      return 75;
    },
    getFeesCollected: function (p, cb) {
			// return feesCollected as 1 indicating that the fees have been collected.
      assert.deepEqual(p.period, 97, 'period passed to getFeesCollected is expected to be 1 less than the period returned from getVotePeriod');
      cb("1");
    }
  });

  test({
    description: 'should return a callreturn of 1 if collection of fees have been completed.',
    params: {
      branch: '0xb1',
      sender: '0xa1',
      periodLength: '100',
      onSent: noop,
      onSuccess: function (t) {
        assert.deepEqual(t, { callReturn: '1' });
      },
      onFailed: noop
    },
    getCurrentPeriodProgress: function (periodLength) {
			// return that we are in deed past the 50% mark of the reporting period.
      return 75;
    },
    getFeesCollected: function (p, cb) {
			// return feesCollected as 1 indicating that the fees have been collected.
      assert.deepEqual(p.period, 97, 'period passed to getFeesCollected is expected to be 1 less than the period returned from getVotePeriod');
      switch(getFeesCollectedCC) {
        default:
          getFeesCollectedCC++;
          cb("2");
          break;
      }
    },
    collectFees: function (tx) {
      assert.deepEqual(tx.branch, '0xb1');
      assert.deepEqual(tx.sender, '0xa1');
      assert.deepEqual(tx.periodLength, '100');
      assert.isFunction(tx.onSent);
      assert.isFunction(tx.onSuccess);
      assert.isFunction(tx.onFailed);
      assert.deepEqual(tx.tx, { value: '0x1aafa55e0' });
      tx.onSuccess({ callReturn: "1" });
    }
  });

  test({
    description: 'should return a callreturn of 2 if the fees have already been claimed.',
    params: {
      branch: '0xb1',
      sender: '0xa1',
      periodLength: '100',
      onSent: noop,
      onSuccess: function (t) {
        assert.deepEqual(t, { callReturn: '2' });
      },
      onFailed: noop
    },
    getCurrentPeriodProgress: function (periodLength) {
			// return that we are in deed past the 50% mark of the reporting period.
      return 75;
    },
    getFeesCollected: function (p, cb) {
			// return feesCollected as 1 indicating that the fees have been collected.
      assert.deepEqual(p.period, 97, 'period passed to getFeesCollected is expected to be 1 less than the period returned from getVotePeriod');
      switch(getFeesCollectedCC) {
        default:
          getFeesCollectedCC++;
          cb("2");
          break;
      }
    },
    collectFees: function (tx) {
      assert.deepEqual(tx.branch, '0xb1');
      assert.deepEqual(tx.sender, '0xa1');
      assert.deepEqual(tx.periodLength, '100');
      assert.isFunction(tx.onSent);
      assert.isFunction(tx.onSuccess);
      assert.isFunction(tx.onFailed);
      assert.deepEqual(tx.tx, { value: '0x1aafa55e0' });
      tx.onSuccess({ callReturn: "2" });
    }
  });

  test({
    description: 'should return a callreturn of 2 if after a response from getFeesCollected of not 1.',
    params: {
      branch: '0xb1',
      sender: '0xa1',
      periodLength: '100',
      onSent: noop,
      onSuccess: function (t) {
        assert.deepEqual(t, { callReturn: '2' });
      },
      onFailed: noop
    },
    getCurrentPeriodProgress: function (periodLength) {
			// return that we are in deed past the 50% mark of the reporting period.
      return 75;
    },
    getFeesCollected: function (p, cb) {
			// return feesCollected as 1 indicating that the fees have been collected.
      assert.deepEqual(p.period, 97, 'period passed to getFeesCollected is expected to be 1 less than the period returned from getVotePeriod');
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
    collectFees: function (tx) {
      assert.deepEqual(tx.branch, '0xb1');
      assert.deepEqual(tx.sender, '0xa1');
      assert.deepEqual(tx.periodLength, '100');
      assert.isFunction(tx.onSent);
      assert.isFunction(tx.onSuccess);
      assert.isFunction(tx.onFailed);
      assert.deepEqual(tx.tx, { value: '0x1aafa55e0' });
      tx.onSuccess({ callReturn: "-1" });
    }
  });

  test({
    description: 'should return a callreturn of 2 if after a response from getFeesCollected is 1, and getAfterRep returns a number <= 1.',
    params: {
      branch: '0xb1',
      sender: '0xa1',
      periodLength: '100',
      onSent: noop,
      onSuccess: function (t) {
        assert.deepEqual(t, { callReturn: '2' });
      },
      onFailed: noop
    },
    getCurrentPeriodProgress: function (periodLength) {
			// return that we are in deed past the 50% mark of the reporting period.
      return 75;
    },
    getFeesCollected: function (p, cb) {
			// return feesCollected as 1 indicating that the fees have been collected.
      assert.deepEqual(p.period, 97, 'period passed to getFeesCollected is expected to be 1 less than the period returned from getVotePeriod');
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
    collectFees: function (tx) {
      assert.deepEqual(tx.branch, '0xb1');
      assert.deepEqual(tx.sender, '0xa1');
      assert.deepEqual(tx.periodLength, '100');
      assert.isFunction(tx.onSent);
      assert.isFunction(tx.onSuccess);
      assert.isFunction(tx.onFailed);
      assert.deepEqual(tx.tx, { value: '0x1aafa55e0' });
      tx.onSuccess({ callReturn: "-1" });
    },
    getAfterRep: function (p, cb) {
      assert.deepEqual(p, { branch: '0xb1', period: 97, sender: '0xa1' });
      cb("0.5")
    }
  });

  test({
    description: 'should return a callreturn of 1 if after a response from getFeesCollected is 1, and getAfterRep returns a number larger than 1',
    params: {
      branch: '0xb1',
      sender: '0xa1',
      periodLength: '100',
      onSent: noop,
      onSuccess: function (t) {
        assert.deepEqual(t, { callReturn: '1' });
      },
      onFailed: noop
    },
    getCurrentPeriodProgress: function (periodLength) {
			// return that we are in deed past the 50% mark of the reporting period.
      return 75;
    },
    getFeesCollected: function (p, cb) {
			// return feesCollected as 1 indicating that the fees have been collected.
      assert.deepEqual(p.period, 97, 'period passed to getFeesCollected is expected to be 1 less than the period returned from getVotePeriod');
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
    collectFees: function (tx) {
      assert.deepEqual(tx.branch, '0xb1');
      assert.deepEqual(tx.sender, '0xa1');
      assert.deepEqual(tx.periodLength, '100');
      assert.isFunction(tx.onSent);
      assert.isFunction(tx.onSuccess);
      assert.isFunction(tx.onFailed);
      assert.deepEqual(tx.tx, { value: '0x1aafa55e0' });
      tx.onSuccess({ callReturn: "-1" });
    },
    getAfterRep: function (p, cb) {
      assert.deepEqual(p, { branch: '0xb1', period: 97, sender: '0xa1' });
      cb("200")
    }
  });
});
