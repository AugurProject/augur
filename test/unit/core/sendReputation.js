"use strict";

var assert = require("chai").assert;
var augur = new (require("../../../src"))();
var abi = require("augur-abi");
var AugurContracts = require('augur-contracts');
var contractsAPI = AugurContracts.api;
var noop = require("../../../src/utils/noop");
// 5 tests total

describe("sendReputation Unit Tests", () => {
	var sendReputation = augur.api.SendReputation.sendReputation;
	var getRepBalance = augur.api.Reporting.getRepBalance;
	var getRepRedistributionDone = augur.api.ConsensusData.getRepRedistributionDone;
	var sendReputationCallCount = 0;
	afterEach(function() {
		augur.api.SendReputation.sendReputation = sendReputation;
		augur.api.Reporting.getRepBalance = getRepBalance;
		augur.api.ConsensusData.getRepRedistributionDone = getRepRedistributionDone;
		sendReputationCallCount = 0;
	});
	var test = function (t) {
		it(t.description, function () {
			augur.api.SendReputation.sendReputation = t.sendReputation;
			augur.api.Reporting.getRepBalance = t.getRepBalance;
			augur.api.ConsensusData.getRepRedistributionDone = t.getRepRedistributionDone;

			augur.assets.sendReputation(t.params);
		});
	};
	test({
		description: "Should handle a request to send rep where sendReputation is successful with a callreturn of 1",
		params: {
			branch: "1010101",
			recver: "recipientAddress",
			value: 5,
			onSent: noop,
			onSuccess: function (r) {
				assert.deepEqual(r, { callReturn: "1", from: 'fromAddress' });
			},
			onFailed: noop,
		},
		sendReputation: function (p) {
			assert.deepEqual(p.branch, '1010101');
			assert.deepEqual(p.recver, 'recipientAddress');
			assert.deepEqual(p.value, abi.fix(5, "hex"));
			p.onSuccess({ callReturn: '1', from: 'fromAddress' })
		},
		getRepBalance: function (p, cb) {},
		getRepRedistributionDone: function (p, cb) {}
	});
	test({
		description: "Should handle a request to send rep that fails due to an error calling getRepBalance",
		params: {
			branch: "1010101",
			recver: "recipientAddress",
			value: "5",
			onSent: noop,
			onSuccess: noop,
			onFailed: function(err) {
				assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
			},
		},
		sendReputation: function (p) {
			assert.deepEqual(p.branch, '1010101');
			assert.deepEqual(p.recver, 'recipientAddress');
			assert.deepEqual(p.value, abi.fix(5, "hex"));
			p.onSuccess({ callReturn: '0', from: 'fromAddress' })
		},
		getRepBalance: function (p, cb) {
			assert.deepEqual(p, {
				branch: '1010101',
				address: 'fromAddress'
			});
			cb({ error: 999, message: 'Uh-Oh!' });
		},
		getRepRedistributionDone: function (p, cb) {}
	});
	test({
		description: "Should handle a request to send rep that fails due to not enough balance",
		params: {
			branch: "1010101",
			recver: "recipientAddress",
			value: "5",
			onSent: noop,
			onSuccess: noop,
			onFailed: function(err) {
				assert.deepEqual(err, { error: "0", message: "not enough reputation" });
			},
		},
		sendReputation: function (p) {
			assert.deepEqual(p.branch, '1010101');
			assert.deepEqual(p.recver, 'recipientAddress');
			assert.deepEqual(p.value, abi.fix(5, "hex"));
			p.onSuccess({ callReturn: '0', from: 'fromAddress' })
		},
		getRepBalance: function (p, cb) {
			assert.deepEqual(p, {
				branch: '1010101',
				address: 'fromAddress'
			});
			cb('1');
		},
		getRepRedistributionDone: function (p, cb) {}
	});
	test({
		description: "Should handle a request to send rep that fails due to rep redistribution not being complete",
		params: {
			branch: "1010101",
			recver: "recipientAddress",
			value: "5",
			onSent: noop,
			onSuccess: noop,
			onFailed: function(err) {
				assert.deepEqual(err, {
					error: "-3",
					message: "cannot send reputation until redistribution is complete"
				});
			},
		},
		sendReputation: function (p) {
			assert.deepEqual(p.branch, '1010101');
			assert.deepEqual(p.recver, 'recipientAddress');
			assert.deepEqual(p.value, abi.fix(5, "hex"));
			p.onSuccess({ callReturn: '0', from: 'fromAddress' })
		},
		getRepBalance: function (p, cb) {
			assert.deepEqual(p, {
				branch: '1010101',
				address: 'fromAddress'
			});
			cb('100');
		},
		getRepRedistributionDone: function (p, cb) {
			assert.deepEqual(p, {
				branch: '1010101',
				reporter: 'fromAddress'
			});
			cb('0');
		}
	});
	test({
		description: "Should handle a request to send rep that succeeds on the 2nd call",
		params: {
			branch: "1010101",
			recver: "recipientAddress",
			value: "5",
			onSent: noop,
			onSuccess: function(result) {
				assert.deepEqual(result, { callReturn: '1', from: 'fromAddress' });
			},
			onFailed: noop,
		},
		sendReputation: function (p) {
			sendReputationCallCount++;

			assert.deepEqual(p.branch, '1010101');
			assert.deepEqual(p.recver, 'recipientAddress');
			assert.deepEqual(p.value, abi.fix(5, "hex"));

			switch (sendReputationCallCount) {
			case 1:
				p.onSuccess({ callReturn: '1', from: 'fromAddress' });
				break;
			default:
				p.onSuccess({ callReturn: '0', from: 'fromAddress' });
				break;
			}
		},
		getRepBalance: function (p, cb) {
			assert.deepEqual(p, {
				branch: '1010101',
				address: 'fromAddress'
			});
			cb('100');
		},
		getRepRedistributionDone: function (p, cb) {
			assert.deepEqual(p, {
				branch: '1010101',
				reporter: 'fromAddress'
			});
			cb('1');
		}
	});
});
