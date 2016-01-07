/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var chalk = require("chalk");
var constants = require("../../src/constants");
var utils = require("../../src/utilities");

require('it-each')({ testPerIteration: true });

describe("utilities.linspace", function () {

    var test = function (t) {
        it(t.inputs.a + ", " + t.inputs.b + ", " + t.inputs.n, function () {
            var actual = utils.linspace(t.inputs.a, t.inputs.b, t.inputs.n);
            assert.deepEqual(actual, t.expected);
        });
    };

    test({
        inputs: {a: 0, b: 1, n: 2},
        expected: [0, 1]
    });
    test({
        inputs: {a: 0, b: 1, n: 3},
        expected: [0, 0.5, 1]
    });
    test({
        inputs: {a: 1, b: 5},
        expected: [1, 2, 3, 4, 5]
    });
    test({
        inputs: {a: 1, b: 5, n: 9},
        expected: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
    });
});

describe("utilities.is_function", function () {

    var test = function (t) {
        it(t.label + " -> " + t.expected, function () {
            assert.strictEqual(utils.is_function(t.input), t.expected);
        });
    };

    function ima_function() {
        console.log("I'm a function!");
    }

    test({
        label: "utils.unpack",
        input: utils.unpack,
        expected: true
    });
    test({
        label: "utils.labels",
        input: utils.labels,
        expected: true
    });
    test({
        label: "declared function",
        input: ima_function,
        expected: true
    });
    test({
        label: "function literal",
        input: test,
        expected: true
    });
    test({
        label: "anonymous function",
        input: function () { console.log("hello world!"); },
        expected: true
    });
    test({
        label: "Function",
        input: Function,
        expected: true
    });
    test({
        label: "Object",
        input: Object,
        expected: true
    });
    test({
        label: "5",
        input: 5,
        expected: false
    });
    test({
        label: "'5'",
        input: '5',
        expected: false
    });
    test({
        label: "'[object Function]'",
        input: "[object Function]",
        expected: false
    });
    test({
        label: "{}",
        input: {},
        expected: false
    });
    test({
        label: "{ hello: 'world' }",
        input: { hello: "world" },
        expected: false
    });
    test({
        label: "{ f: Function }",
        input: { f: Function },
        expected: false
    });
    test({
        label: "[]",
        input: [],
        expected: false
    });
    test({
        label: "[1, 2, 3]",
        input: [1, 2, 3],
        expected: false
    });
    test({
        label: "[Function]",
        input: [Function],
        expected: false
    });
    test({
        label: "utils.ARGUMENT_NAMES",
        input: utils.ARGUMENT_NAMES,
        expected: false
    });
    test({
        label: "constants.ETHER",
        input: constants.ETHER,
        expected: false
    });

});

describe("utilities.remove_duplicates", function () {

    var test = function (t) {
        it(JSON.stringify(t.array) + " -> " + JSON.stringify(t.expected), function () {
            assert.deepEqual(utils.remove_duplicates(t.array), t.expected);
        });
    };

    test({
        array: [1, 1, 2, 3, 4],
        expected: [1, 2, 3, 4]
    });
    test({
        array: [1, "1", 2, 3, 4],
        expected: [1, "1", 2, 3, 4]
    });
    test({
        array: [1, 1, 1, 1, 1],
        expected: [1]
    });
    test({
        array: [2, 1, 1, 3, 4],
        expected: [2, 1, 3, 4]
    });
    test({
        array: ['a', 'b', 'c', 'c', 'c', 'c'],
        expected: ['a', 'b', 'c']
    });
    test({
        array: ['c', 'b', 'a', 'c', 'c', 'c'],
        expected: ['c', 'b', 'a']
    });
    test({
        array: ['abc', null, null, 'xyz', undefined],
        expected: ['abc', null, 'xyz', undefined]
    });
    test({
        array: [1, 2, 3],
        expected: [1, 2, 3]
    });
    test({
        array: [3, 2, 5],
        expected: [3, 2, 5]
    });
    test({
        array: [1, 2, 3, 'a', 'abc', 'ab'],
        expected: [1, 2, 3, 'a', 'abc', 'ab']
    });
    test({
        array: [],
        expected: []
    });
    test({
        array: [{}],
        expected: [{}]
    });
    test({
        array: [{}, {}],
        expected: [{}, {}]
    });
    test({
        array: [[]],
        expected: [[]]
    });
    test({
        array: [[], []],
        expected: [[], []]
    });

});

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
