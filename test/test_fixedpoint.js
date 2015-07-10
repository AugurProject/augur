/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var assert = require("chai").assert;
var Augur = require("../augur");
var constants = require("./constants");
var log = console.log;

describe("Fixed point tests", function () {

    var ex_integer = 12345678901;
    var ex_decimal = 0.123456789;
    var ex_integer_hex = "0x2dfdc1c35";
    var ex_integer_string = "12345678901";
    var ex_decimal_string = "0.123456789";

    describe("bignum", function () {
        it("should be the same if called with a float or a string", function () {
            assert(Augur.numeric.bignum(ex_decimal).eq(Augur.numeric.bignum(ex_decimal_string)));
        });
        it("should create 0 successfully", function () {
            assert(Augur.numeric.bignum(0).eq(new BigNumber(0)));
        });
    });
    describe("fix", function () {
        it("should be equal to round(n*2^64)", function () {
            assert(Augur.numeric.fix(ex_decimal, "BigNumber").eq((new BigNumber(ex_decimal)).mul(Augur.ONE).round()));
        });
        it("should return a base 10 string '2277375790844960561'", function () {
            assert(Augur.numeric.fix(ex_decimal, "string") === "2277375790844960561");
        });
        it("should return a base 16 string '0x1f9add3739635f31'", function () {
            assert(Augur.numeric.fix(ex_decimal_string, "hex") === "0x1f9add3739635f31");
        });
    });
    describe("unfix", function () {
        it("fixed-point -> hex", function () {
            assert.equal(Augur.numeric.unfix(Augur.numeric.fix(ex_integer_hex, "BigNumber"), "hex"), ex_integer_hex);
        });
        it("fixed-point -> string", function () {
            assert.equal(Augur.numeric.unfix(Augur.numeric.fix(ex_integer_string, "BigNumber"), "string"), ex_integer_string);
        });
        it("fixed-point -> number", function () {
            assert.equal(Augur.numeric.unfix(Augur.numeric.fix(ex_integer_string, "BigNumber"), "number"), ex_integer);
        });
    });
});