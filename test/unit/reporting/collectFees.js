"use strict";

var assert = require("chai").assert;
var utils = require("../../../src/utilities.js");
var augur = require('../../../src/');
var transact,
		getVotePeriod,
		getFeesCollected,
		getGasPrice,
		getAfterRep,
		getCurrentPeriodProgress;

describe("collectFees", function() {
	var test = function(t) {
		it(t.description, function() {
			// set mocks to a per test level version
			augur.getCurrentPeriodProgress = t.getCurrentPeriodProgress;
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
		getVotePeriod = augur.getVotePeriod;
		getFeesCollected = augur.getFeesCollected;
		getAfterRep = augur.getAfterRep;
		transact = augur.transact;
		getGasPrice = augur.rpc.getGasPrice;
	});

	after(function() {
		// revert augur functions to the original functions
		augur.getCurrentPeriodProgress = getCurrentPeriodProgress;
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
});
