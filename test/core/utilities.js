/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
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
        fn('x', 'y', 'z', console.log, console.log, console.log);
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
        assert.deepEqual(unpacked.cb, [console.log, console.log, console.log]);
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
            onSent: console.log,
            onSuccess: console.log,
            onFailed: console.log
        });
    });

    it("should unpack positional arguments", function () {
        var fn = function (a, b, c, d, onSent, onSuccess, onFailed) {
            test(utils.unpack(a, utils.labels(fn), arguments));
        };
        fn('w', 'x', 'y', 'z', console.log, console.log, console.log);
    });

});

var desc = abi.prefix_hex(abi.pad_right(abi.encode_hex("What will the high temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2016?")));
console.log("desc:", desc)

describe("utilities.sha256", function () {
    var test = function (t) {
        it(JSON.stringify(t.hashable) + " -> " + t.digest, function () {
            assert.strictEqual(utils.sha256(t.hashable), t.digest);
        });
    };
    test({
        hashable: [1, 2, 3],
        digest: "-0x68fe0cb37f1e10807eda1a2b2d281e64af61da2d91b9d2acf74a5446a49b87c2"
    });
    test({
        hashable: [1, 0, 1, 0, 1, 0, 1],
        digest: "-0x37c0bf242cf5dc22be6f5d7b00f1d4297d6a80ec62b2e487c63fe7b8742006f0"
    });
    test({
        hashable: [7],
        digest: "0x48428bdb7ddd829410d6bbb924fdeb3a3d7e88c2577bffae073b990c6f061d08"
    });
    test({
        hashable: [0, 0, 0, 0],
        digest: "0x38723a2e5e8a17aa7950dc008209944e898f69a7bd10a23c839d341e935fd5ca"
    });
    test({
        hashable: [17, 100, 2],
        digest: "-0x325d3841714b27c7b7654891ffb6cd9c2a0c9d52680d60821ffebcff886352ef"
    });
    test({
        hashable: [17, 1000, 2],
        digest: "0x5fcc48bfa145c726c5423cd09d85bf1416a678865064b73e3ba169779c4aa644"
    });
    test({
        hashable: ["0x01", "0x11"],
        digest: "0x5025d082595dbccb8e4c1efe7c24b2fdf3abe2ead4cbb969aa551f69a19c47f6"
    });
    test({
        hashable: ["0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b", "0x0f69b5", "0x041e"],
        digest: "0x6daf77caa20dd3bee7b15885ea8d56f59c8b291662707788a79ec52b9ef511c3"
    });    
    test({
        hashable: [
            0,
            "0xf69b5", // branch
            1898028, // expiration block
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1", // creator address
        ],
        digest: "0x538aa2dd26a5d1db8c1f6bdfb315adc33fb5379a18825e6fe3ef14b8b59b797",
    });

    test({
        hashable: [
            0,
            "0xf69b5", // branch
            1898028, // expiration block
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1", // creator address
            abi.fix(42, "hex"), // creation fee
            0, // minimum value
            120, // maximum value
            2 // number of outcomes
        ],
        digest: "-0x2bae070a9240691ee2f3f411b1991c8a352b1f8fd62c36a87e39a29b76d7005d"
    });

    test({
        hashable: ["0x7400000000000000000000000000000000000000000000000000000000000000"],
        digest: "-0x2e8c29d90f159b09eef703e9a8cfed11abf3e215b8b8008d4073df0e6756592e"
    });

    test({
        hashable: ["test"],
        digest: "-0x60792f7e77b3829a65d0155f3aa52fea5c40b0e4d4f47dd32ea293ea4f0ff5f8"
    });

    test({
        hashable: [
            0,
            "0xf69b5", // branch
            1898028, // expiration block
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1", // creator address
            abi.fix(42, "hex"), // creation fee
            0, // minimum value
            120, // maximum value
            2, // number of outcomes
            "test"
        ],
        digest: "0x4a9b8e665ea0913ce571407c493a5f45d8f0a7c45fbad55c6168e8f4408086f6"
    });

    test({
        hashable: [
            0,
            "0xf69b5", // branch
            1898028, // expiration block
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1", // creator address
            abi.fix(42, "hex"), // creation fee
            0, // minimum value
            120, // maximum value
            2, // number of outcomes
            "What will the high temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2016?"
        ],
        digest: "-0x5fea28275da61ee79ac4410c00c593b09b3a35372b6d76498cb874714a04f5ee"
    });

    test({
        hashable: [
            0,
            "0xf69b5", // branch
            1898028, // expiration block
            "0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b", // creator address
            abi.fix(42, "hex"), // creation fee
            0, // minimum value
            120, // maximum value
            2, // number of outcomes
            "What will the high temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2016?"
        ],
        digest: "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e"
    });

    test({
        hashable: [0, "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1"],
        digest: "-0x165e7f97f6cd4b9701c861e9c84a8976b37c5b547ed08c0108bd08e746e5aed8"
    });

    test({
        hashable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030", // initial liquidity
        ],
        digest: "0x4d8c092bf54a017de7e487f39c83cc0edbc7ae0bf847538b308d7bc67f9d2d1f"
    });

    test({
        hashable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030", // initial liquidity
            "0xf69b5", // branch
            "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e"
        ],
        digest: "0x38f40e59d912ba5ee78b9dad9698930c23091b9e8e5b42b92a474be13f84115f"
    });

    test({
        hashable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030", // initial liquidity
            "0xf69b5", // branch
            "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
            1, // numEvents
            120 // cumulative scale
        ],
        digest: "-0x62287c55ac6b484420007081f4cb94a015d23a3ea145a7bb77ce11a2da9e4bc5"
    });

    test({
        hashable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030", // initial liquidity
            "0xf69b5", // branch
            "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
            1, // numEvents
            120, // cumulative scale
            "0x3078323035626330316133366532656232" // alpha
        ],
        digest: "0x4b951f53971e00728d65b00a836060cc6f0346b2f7e3e49f2290510084a58b01"
    });

    test({
        hashable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030", // initial liquidity
            "0xf69b5", // branch
            "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
            1, // numEvents
            120, // cumulative scale
            "0x3078323035626330316133366532656232", // alpha
            2, // numOutcomes
            1054
        ],
        digest: "0x300eeb23933248681b9932be6c5037bc3dd0f1aa96dd816e5f71b9c5c13ad4cb"
    });

    test({
        hashable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030", // initial liquidity
            "0xf69b5", // branch
            "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
            1, // numEvents
            120, // cumulative scale
            "0x3078323035626330316133366532656232", // alpha
            2, // numOutcomes
            1054, // tradingPeriod
            "0x3078353165623835316562383531656238"
        ],
        digest: "-0x2a2aa2062e4cd814588761e57c066081e77c4b872747a55b295b0070eb222821"
    });

    test({
        hashable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "0x3078313230303030303030303030303030303030", // initial liquidity
            "0xf69b5", // branch
            "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
            1, // numEvents
            120, // cumulative scale
            "0x3078323035626330316133366532656232", // alpha
            2, // numOutcomes
            1054, // tradingPeriod
            "0x3078353165623835316562383531656238", // tradingFee
            "What will the high temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2016?"
        ],
        digest: "0xf1b6b8c46c55bf949896568ad1a71ce64e10d5bcbb824ed9bd8cafb9660dc37"
    });
});
