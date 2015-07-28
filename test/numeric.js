/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var chalk = require("chalk");
var Augur = require("../src");
var constants = require("../src/constants");
var numeric = require("../src/numeric");
var log = console.log;

Augur.contracts = require("../src/contracts").testnet;
Augur.tx = new require("../src/tx")(Augur.contracts);

// from web3.js toHex tests
var tests = [
    { value: 1, expected: "0x1" },
    { value: "1", expected: "0x1" },
    { value: "0x1", expected: "0x1"},
    { value: "15", expected: "0xf"},
    { value: "0xf", expected: "0xf"},
    { value: -1, expected: "-0x1"},
    { value: "-1", expected: "-0x1"},
    { value: "-0x1", expected: "-0x1"},
    { value: "-15", expected: "-0xf"},
    { value: "-0xf", expected: "-0xf"},
    { value: "0x657468657265756d", expected: "0x657468657265756d"},
    { value: "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd",
      expected: "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd" },
    { value: "-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      expected: "-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" },
    { value: "-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd",
      expected: "-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd" },
    { value: 0, expected: "0x0"},
    { value: "0", expected: "0x0"},
    { value: "0x0", expected: "0x0"},
    { value: -0, expected: "0x0"},
    { value: "-0", expected: "0x0"},
    { value: "-0x0", expected: "0x0"},
    { value: [1,2,3,{test: "data"}], expected: "0x5b312c322c332c7b2274657374223a2264617461227d5d"},
    { value: {test: "test"}, expected: "0x7b2274657374223a2274657374227d"},
    { value: '{"test": "test"}', expected: "0x7b2274657374223a202274657374227d"},
    { value: "myString", expected: "0x6d79537472696e67"},
    { value: new BigNumber(15), expected: "0xf"},
    { value: true, expected: "0x1"},
    { value: false, expected: "0x0"}
];

describe("numeric.hex (hex conversion)", function () {
    tests.forEach(function (test) {
        it("should turn " + test.value + " to " + test.expected, function () {
            assert.strictEqual(numeric.hex(test.value, true), test.expected);
        });
    });
});

var ex_integer = 12345678901;
var ex_decimal = 0.123456789;
var ex_integer_hex = "0x2dfdc1c35";
var ex_integer_string = "12345678901";
var ex_decimal_string = "0.123456789";

describe("Fixed point tests", function () {

    describe("bignum", function () {
        it("should be the same if called with a float or a string", function () {
            assert(numeric.bignum(ex_decimal).eq(numeric.bignum(ex_decimal_string)));
        });
        it("should create 0 successfully", function () {
            assert(numeric.bignum(0).eq(new BigNumber(0)));
        });
    });

    describe("fix", function () {
        it("should be equal to round(n*2^64)", function () {
            assert(numeric.fix(ex_decimal, "BigNumber").eq((new BigNumber(ex_decimal)).mul(constants.ONE).round()));
        });
        it("should return a base 10 string '2277375790844960561'", function () {
            assert(numeric.fix(ex_decimal, "string") === "2277375790844960561");
        });
        it("should return a base 16 string '0x1f9add3739635f31'", function () {
            assert(numeric.fix(ex_decimal_string, "hex") === "0x1f9add3739635f31");
        });
    });

    describe("unfix", function () {
        it("fixed-point -> hex", function () {
            assert.equal(numeric.unfix(numeric.fix(ex_integer_hex, "BigNumber"), "hex"), ex_integer_hex);
        });
        it("fixed-point -> string", function () {
            assert.equal(numeric.unfix(numeric.fix(ex_integer_string, "BigNumber"), "string"), ex_integer_string);
        });
        it("fixed-point -> number", function () {
            assert.equal(numeric.unfix(numeric.fix(ex_integer_string, "BigNumber"), "number"), ex_integer);
        });
    });
});
