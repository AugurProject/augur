/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var chalk = require("chalk");
var constants = require("../../src/constants");
var utils = require("../../src/utilities");
var log = console.log;

require('it-each')({ testPerIteration: true });

describe("utilities.labels", function () {

    it("should extract parameter names", function () {
        var fn = function (a, b, c, onSent, onSuccess, onFailed) {
            var params = utils.labels(fn);
            var expected = ['a', 'b', 'c', "onSent", "onSuccess", "onFailed"];
            assert.deepEqual(params, expected);
        };
        fn('x', 'y', 'z', log, log, log);
    });

});

describe("utilities.unpack", function () {

    var test = function (unpacked) {
        assert(unpacked.params);
        assert(unpacked.cb);
        assert.strictEqual(unpacked.params.constructor, Array);
        assert.strictEqual(unpacked.cb.constructor, Array);
        assert.strictEqual(unpacked.params.length, 4);
        assert.strictEqual(unpacked.cb.length, 3);
        assert.deepEqual(unpacked.params, ['w', 'x', 'y', 'z']);
        assert.deepEqual(unpacked.cb, [log, log, log]);
    };

    it("should unpack object argument", function () {
        var fn = function (a, b, c, d, onSent, onSuccess, onFailed) {
            test(utils.unpack(a, utils.labels(fn)));
        };
        fn({
            a: 'w',
            b: 'x',
            c: 'y',
            d: 'z',
            onSent: log,
            onSuccess: log,
            onFailed: log
        });
    });

    it("should unpack positional arguments", function () {
        var fn = function (a, b, c, d, onSent, onSuccess, onFailed) {
            test(utils.unpack(a, utils.labels(fn), arguments));
        };
        fn('w', 'x', 'y', 'z', log, log, log);
    });

});
