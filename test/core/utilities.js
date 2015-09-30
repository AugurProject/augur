(function () {
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

describe("utilities.is_function", function () {

    var test = function (t) {
        it(t.label + " -> " + t.expected, function () {
            assert.strictEqual(utils.is_function(t.input), t.expected);
        });
    };

    function ima_function() {
        log("I'm a function!");
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
        input: function () { log("hello world!"); },
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

describe("utilities.urlstring", function () {

    var test = function (t) {
        it(JSON.stringify(t.object) + " -> " + t.string, function () {
            assert.strictEqual(utils.urlstring(t.object), t.string);
        });
    };

    test({
        object: { host: "localhost", port: 8545, protocol: "http" },
        string: "http://localhost:8545"
    });
    test({
        object: { host: "localhost", port: 8545 },
        string: "http://localhost:8545"
    });
    test({
        object: { host: "localhost" },
        string: "http://localhost:8545"
    });
    test({
        object: { port: 8545 },
        string: "http://127.0.0.1:8545"
    });
    test({
        object: { host: "127.0.0.1" },
        string: "http://127.0.0.1:8545"
    });
    test({
        object: { host: "eth1.augur.net" },
        string: "http://eth1.augur.net:8545"
    });
    test({
        object: { host: "eth1.augur.net", protocol: "https" },
        string: "https://eth1.augur.net:8545"
    });
    test({
        object: { host: "127.0.0.1", port: 8547, protocol: "https" },
        string: "https://127.0.0.1:8547"
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

describe("utilities.has_value", function () {

    var test = function (t) {
        it(JSON.stringify(t.object) + " has value " + t.value + " -> " + t.expected, function () {
            assert.strictEqual(utils.has_value(t.object, t.value), t.expected);
        });
    };

    test({
        object: { "augur": 42 },
        value: 42,
        expected: "augur"
    });
    test({
        object: { "augur": 42 },
        value: "augur",
        expected: undefined
    });
    test({
        object: { "augur": 42 },
        value: 41,
        expected: undefined
    });
    test({
        object: { "augur": 42, "whee": "thereum" },
        value: "thereum",
        expected: "whee"
    });
    test({
        object: { "augur": 42, "whee": "thereum" },
        value: 42,
        expected: "augur"
    });
    test({
        object: { "augur": 42, "whee": "thereum" },
        value: "42",
        expected: undefined
    });
    test({
        object: { "augur": 42, "whee": "thereum" },
        value: "whee",
        expected: undefined
    });
    test({
        object: { "augur": 42, "whee": "thereum" },
        value: -42,
        expected: undefined
    });
    test({
        object: { "augur": 42, "whee": "thereum" },
        value: undefined,
        expected: undefined
    });
    test({
        object: { "augur": 42, "whee": "thereum" },
        value: null,
        expected: undefined
    });
    test({
        object: { "augur": null, "whee": "thereum" },
        value: null,
        expected: "augur"
    });
    test({
        object: { "augur": 42, "whee": "thereum" },
        value: "0x42",
        expected: undefined
    });
    test({
        object: {},
        value: null,
        expected: undefined
    });
    test({
        object: {},
        value: undefined,
        expected: undefined
    });
    test({
        object: {},
        value: 0,
        expected: undefined
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

})();
