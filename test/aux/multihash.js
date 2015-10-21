(function () {
/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var join = require("path").join;
var assert = require("chai").assert;
var multihash = require("../../src/multihash");

var DATADIR = join(__dirname, "..", "..", "data");
var b58data = fs.readFileSync(join(DATADIR, "ipfs-base58.dat"));
var hexdata = fs.readFileSync(join(DATADIR, "ipfs-hex.dat"));
var ipfsHashes = b58data.toString().split('\n');
var ipfsHex = hexdata.toString().split('\n');

describe("multihash", function () {

    describe("encode", function () {

        var test = function (t) {
            it(t.input + " -> " + t.expected, function () {
                assert.strictEqual(multihash.encode(t.input), t.expected);
            });
        };

        for (var i = 0, len = ipfsHex.length; i < len; ++i) {
            test({
                input: ipfsHex[i],
                expected: ipfsHashes[i]
            });
        }

    });

    describe("decode", function () {

        var test = function (t) {
            it(t.input + " -> " + t.expected, function () {
                assert.strictEqual(multihash.decode(t.input), t.expected);
            });
        };

        for (var i = 0, len = ipfsHashes.length; i < len; ++i) {
            test({
                input: ipfsHashes[i],
                expected: ipfsHex[i]
            });
        }

    });

});

})();
