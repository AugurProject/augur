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

describe("utilities.isNumeric", function () {

    var test_numbers = [ 1, -2, "1", "10", 2.5, 0, "125000", 2.15315135, -10000 ];
    var test_nans = [ "hello", "testing", NaN, "1oo" ];

    it.each(test_numbers, "%s is a number", ["element"], function (element, next) {
        assert(utils.isNumeric(element));
        next();
    });
    
    it.each(test_nans, "%s is not a number", ["element"], function (element, next) {
        assert(!utils.isNumeric(element));
        next();
    });

});

describe("utilities.labels", function () {

    it("should extract parameter names", function () {
        var fn = function (a, b, c, onSent, onSuccess, onFailed) {
            var params = utils.labels(fn);
            var expected = ['a', 'b', 'c', "onSent", "onSuccess", "onFailed"];
            assert(utils.array_equal(params, expected));
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
        assert(utils.array_equal(unpacked.params, ['w', 'x', 'y', 'z']));
        assert(utils.array_equal(unpacked.cb, [log, log, log]));
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
