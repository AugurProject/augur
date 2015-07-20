/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BN = require("bignumber.js");
var assert = require("chai").assert;
var Augur = require("../src");
var constants = require("../src/constants");
var numeric = require("../src/numeric");
var log = console.log;

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
            assert(numeric.bignum(0).eq(new BN(0)));
        });
    });

    describe("fix", function () {
        it("should be equal to round(n*2^64)", function () {
            assert(numeric.fix(ex_decimal, "BigNumber").eq((new BN(ex_decimal)).mul(constants.ONE).round()));
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
            assert.equal(numeric.unfix(numeric.fix(ex_integer_hex, "BN"), "hex"), ex_integer_hex);
        });
        it("fixed-point -> string", function () {
            assert.equal(numeric.unfix(numeric.fix(ex_integer_string, "BN"), "string"), ex_integer_string);
        });
        it("fixed-point -> number", function () {
            assert.equal(numeric.unfix(numeric.fix(ex_integer_string, "BN"), "number"), ex_integer);
        });
    });
});
