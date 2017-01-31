"use strict";

var assert = require('chai').assert;
var augur = require('../../../src');
var connector = require("ethereumjs-connect");
var contracts = require('augur-contracts');

describe('connect.bindContractMethod', function() {});

describe('connect.bindContractAPI', function() {});

describe('connect.sync', function() {});

describe('connect.useAccount', function() {
    // 1 test total
    var sync = augur.sync;
    var setFrom = connector.setFrom;
    afterEach(function() {
        augur.sync = sync;
        connector.setFrom = setFrom;
    });
    var test = function(t) {
        it(t.description, function() {
            augur.sync = t.assertions;
            connector.setFrom = t.setFrom;

            augur.useAccount(t.account);
        });
    };
    test({
        description: 'Should set connector.from to the account passed, should call setFrom and sync.',
        account: '0xabc123',
        setFrom: function(account) {
            assert.equal(account, '0xabc123');
        },
        assertions: function() {
            assert.equal(connector.from, '0xabc123');
        }
    });
});

describe('connect.connect', function() {});
