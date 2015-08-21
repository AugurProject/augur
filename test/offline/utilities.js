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

describe("utilities.is_hex", function () {

    var test = function (t) {
        it("convert " + t.input + " -> " + t.expected, function () {
            assert.strictEqual(utils.is_hex(t.input), t.expected);
        });
    };

    test({
        input: "0",
        expected: true
    });
    test({
        input: "01",
        expected: true
    });
    test({
        input: "1010101",
        expected: true
    });
    test({
        input: "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c",
        expected: true
    });
    test({
        input: "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde470x",
        expected: false
    });
    test({
        input: "d172bf743a674da9cdadz4534d56926ef8358534d458fffccd4e6ad2fbde479c",
        expected: false
    });
    test({
        input: "ab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19",
        expected: true
    });
    test({
        input: "0123456789abcdef",
        expected: true
    });
    test({
        input: "0123456789abcdefg",
        expected: false
    });
    test({
        input: "hello world",
        expected: false
    });
    test({
        input: "helloworld",
        expected: false
    });
    test({
        input: 1,
        expected: false
    });
    test({
        input: 0x01,
        expected: false
    });
    test({
        input: 123456,
        expected: false
    });
    test({
        input: "",
        expected: false
    });
    test({
        input: "0x01",
        expected: false
    });
    test({
        input: "-0x",
        expected: false
    });
});

describe("utilities.strip_0x", function () {

    var test = function (t) {
        it("convert " + t.input + " -> " + t.expected, function () {
            assert.strictEqual(utils.strip_0x(t.input), t.expected);
        });
    };

    test({
        input: "0x01",
        expected: "01"
    });
    test({
        input: "0x0",
        expected: "0"
    });
    test({
        input: "0x00",
        expected: "00"
    });
    test({
        input: "0x0x",
        expected: "0x0x"
    });
    test({
        input: "-0x01",
        expected: "-01"
    });
    test({
        input: "-0x0",
        expected: "0"
    });
    test({
        input: "0xf06d69cdc7da0faffb1008270bca38f5",
        expected: "f06d69cdc7da0faffb1008270bca38f5"
    });
    test({
        input: "0x83dbcc02d8ccb40e466191a123791e0e",
        expected: "83dbcc02d8ccb40e466191a123791e0e"
    });
    test({
        input: "-0x83dbcc02d8ccb40e466191a123791e0e",
        expected: "-83dbcc02d8ccb40e466191a123791e0e"
    });
    test({
        input: "0xd172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c",
        expected: "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c"
    });
    test({
        input: "0xab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19",
        expected: "ab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19"
    });
    test({
        input: "f06d69cdc7da0faffb1008270bca38f5",
        expected: "f06d69cdc7da0faffb1008270bca38f5"
    });
    test({
        input: "83dbcc02d8ccb40e466191a123791e0e",
        expected: "83dbcc02d8ccb40e466191a123791e0e"
    });
    test({
        input: "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c",
        expected: "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c"
    });
    test({
        input: "ab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19",
        expected: "ab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19"
    });
    test({
        input: "hello world",
        expected: "hello world"
    });
    test({
        input: "",
        expected: ""
    });
    test({
        input: "0x",
        expected: "0x"
    });
    test({
        input: "-0x",
        expected: "-0x"
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
