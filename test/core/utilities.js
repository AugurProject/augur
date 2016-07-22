/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var constants = require("../../src/constants");
var utils = require("../../src/utilities");
var tools = require("../tools");

require('it-each')({ testPerIteration: true });

describe("tools.linspace", function () {

    var test = function (t) {
        it(t.inputs.a + ", " + t.inputs.b + ", " + t.inputs.n, function () {
            var actual = tools.linspace(t.inputs.a, t.inputs.b, t.inputs.n);
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

describe("tools.remove_duplicates", function () {

    var test = function (t) {
        it(JSON.stringify(t.array) + " -> " + JSON.stringify(t.expected), function () {
            assert.deepEqual(tools.remove_duplicates(t.array), t.expected);
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
        hashable: ["0x7400000000000000000000000000000000000000000000000000000000000000"],
        digest: "-0x2e8c29d90f159b09eef703e9a8cfed11abf3e215b8b8008d4073df0e6756592e"
    });
    test({
        hashable: ["test"],
        digest: "-0x60792f7e77b3829a65d0155f3aa52fea5c40b0e4d4f47dd32ea293ea4f0ff5f8"
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
    test({
        hashable: ["radical-accelerations-56zrpywcyuv7vi"],
        digest: "-0x60a0a1a486f76acd6b9f6d28067a32dcf3c8bd2bf76cf30c59495068fed06ea1"
    });
    test({
        hashable: [0, "radical-accelerations-56zrpywcyuv7vi"],
        digest: "0x767efba5fddbb07d90e1f74764f4d0ff73c94a2da7b674e2c4fe6930a2d09ca4"
    });
    test({
        hashable: [
            0,
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
            "radical-accelerations-56zrpywcyuv7vi"
        ],
        digest: "-0x77012e8c44fe594ddf290b54d2aefb581f1585d618c4d79223835dcb777e1f11"
    });
    test({
        hashable: [1844674407370955162],
        digest: "0x73bdea1ea123ffac86b53fa7bbe69d258087aabbca3d9207932977bd3e9f654c"
    });
    test({
        hashable: [1844674407370955264],
        digest: "0x73bdea1ea123ffac86b53fa7bbe69d258087aabbca3d9207932977bd3e9f654c"
    });
    test({
        hashable: [1844674407370955300],
        digest: "0x73bdea1ea123ffac86b53fa7bbe69d258087aabbca3d9207932977bd3e9f654c"
    });
});

describe("utilities.sha3", function () {
    var test = function (t) {
        it(JSON.stringify(t.hashable) + " -> " + t.digest, function () {
            assert.strictEqual(utils.sha3(t.hashable), t.digest);
        });
    };
    test({
        hashable: [1, 2, 3],
        digest: abi.unfork("0x6e0c627900b24bd432fe7b1f713f1b0744091a646a9fe4a65a18dfed21f2949c", true)
    });
    test({
        hashable: [1, 0, 1, 0, 1, 0, 1],
        digest: abi.unfork("0x1c9ace216ac502aa2f386dcce536fe05590090d2cd93768cf21f865677c2da96", true)
    });
    test({
        hashable: [7],
        digest: abi.unfork("-0x599336d74a1247d50642b66dd6abeaa5484f6bd96b415b31bb99e26578c93978", true)
    });
    test({
        hashable: [0, 0, 0, 0],
        digest: abi.unfork("0x12893657d8eb2efad4de0a91bcd0e39ad9837745dec3ea923737ea803fc8e3d", true)
    });
    test({
        hashable: [17, 100, 2],
        digest: abi.unfork("0x72f4bbc5353724cebd20d6f15e3d2bd10e75ed59cec54724ab5a6d5ad9955d3", true)
    });
    test({
        hashable: [17, 1000, 2],
        digest: abi.unfork("-0xfa1338534aa300ca79cf8b1123ed99a9634b1f9e475b24ea0c7a659ae701378", true)
    });
    test({
        hashable: ["0x01", "0x11"],
        digest: abi.unfork("0x17bc176d2408558f6e4111feebc3cab4e16b63e967be91cde721f4c8a488b552", true)
    });
    test({
        hashable: ["0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b", "0x0f69b5", "0x041e"],
        digest: abi.unfork("0x74d1c32fb4ba921c884e82504171fcc503c4488680dcd68f61af2e4732daa191", true)
    });    
    test({
        hashable: [
            0,
            "0xf69b5", // branch
            1898028, // expiration block
            "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1", // creator address
        ],
        digest: abi.unfork("-0xec24e44d7005689c9e1ccbfecfcedb2665abe2940e585659600fcb896574dc7", true)
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
        digest: abi.unfork("0x751b23d114539a8c91a7b0671820324fc6300ab4ef1e090db5c71dd0d1dd0e14", true)
    });
    test({
        hashable: ["0x7400000000000000000000000000000000000000000000000000000000000000"],
        digest: abi.unfork("-0x1cf1192d502c2567785a27e617208c466a1fad592636b17ee99448dec3784481", true)
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
        digest: abi.unfork("-0x30ad844951eec4d0b5d543252391a6d4bb23b9f67f406f3f8a4203652b0d8cb3", true)
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
        digest: abi.unfork("0x4da29b50a48cab4bd45d4bbef3a671083467a415109896a35c8e390bc561b237", true)
    });
    test({
        hashable: ["为什么那么认真？"],
        digest: abi.unfork("-0x19f33f90843772d67526450f0e0cf15ab06020001a2ae7c6437fcbee24257d6e", true)
    });
    test({
        hashable: ["なぜそんなに真剣なんだ？ €☃..."],
        digest: abi.unfork("0x2f77daf73854def6e1ed2edc9ed222f94387e1f2438f960720e96e902a6b20d2", true)
    });
    test({
        hashable: [
            "0x1708aec800",
            "0x51eb851eb851eb8",
            "0x574aad9e",
            "0x7765617468657200000000000000000000000000000000000000000000000000",
            "0x74656d7065726174757265000000000000000000000000000000000000000000",
            "0x636c696d617465206368616e6765000000000000000000000000000000000000",
            "0x159823db800",
            "0x18",
            "为什么那么认真？"
        ],
        digest: abi.unfork("0x2e7cf821ee4c26d268ed5a11a187efa9baa417544159759c1ab310868b5a4dfb", true)
    });
    test({
        hashable: [
            "0x1708aec800",
            "0x51eb851eb851eb8",
            "0x574aad9e",
            "0x7765617468657200000000000000000000000000000000000000000000000000",
            "0x74656d7065726174757265000000000000000000000000000000000000000000",
            "0x636c696d617465206368616e6765000000000000000000000000000000000000",
            "0x159823db800",
            "0x2e",
            "なぜそんなに真剣なんだ？ €☃..."
        ],
        digest: abi.unfork("0x2901f3d513d2259272700e2487c075e50c206a24069a3c83eb19de1738439508", true)
    });
    test({
        hashable: "-0x076627fd562b1cc22a6e53ae38d5d421fb3af7fe6c1f18164d097100fba627c54",
        digest: abi.unfork("-0x1de19444afd83f9be817472f4dc48418cbe33a43a02c2288c5b4ebb12aafc147", true)
    });
});
