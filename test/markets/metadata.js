/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var crypto = require("crypto");
var clone = require("clone");
var assert = require("chai").assert;
var abi = require("augur-abi");
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));

var market1 = abi.prefix_hex(utils.sha256(crypto.randomBytes(32)));
var market2 = abi.prefix_hex(utils.sha256(crypto.randomBytes(32)));
var market3 = abi.prefix_hex(utils.sha256(crypto.randomBytes(32)));
var noop = function () {};

describe("Unit", function () {
    describe("setMetadata", function () {

        function processTag(tag) {
            return (tag && tag !== "") ? abi.prefix_hex(abi.encode_hex(tag)) : "0x0";
        }

        var test = function (t) {
            it(JSON.stringify(t), function (done) {
                this.timeout(augur.constants.TIMEOUT);
                var teardown = function (e) {
                    augur.transact = transact;
                    done(e);
                };
                var transact = augur.transact;
                augur.transact = function (tx, callback) {
                    assert.strictEqual(tx.to, augur.contracts.metadata);
                    assert.strictEqual(tx.from, augur.from);
                    assert.strictEqual(tx.returns, augur.tx.setMetadata.returns);
                    assert.strictEqual(tx.signature, augur.tx.setMetadata.signature);
                    assert.strictEqual(tx.method, "setMetadata");
                    assert.isArray(tx.params);
                    assert.strictEqual(tx.params.length, 6);
                    assert.strictEqual(tx.params[0], t.market);
                    assert.strictEqual(tx.params[1], processTag(t.tag1));
                    assert.strictEqual(tx.params[2], processTag(t.tag2));
                    assert.strictEqual(tx.params[3], processTag(t.tag3));
                    assert.strictEqual(tx.params[4], t.source);
                    assert.isNotNull(tx.params[5]);
                    assert.notStrictEqual(tx.params[5], "");
                    teardown();
                };
                augur.setMetadata({
                    market: t.market,
                    tag1: t.tag1,
                    tag2: t.tag2,
                    tag3: t.tag3,
                    source: t.source,
                    details: t.details,
                    links: t.links,
                    linksUrl: t.linksUrl,
                    onSent: noop,
                    onSuccess: noop,
                    onFailed: noop
                });
            });
        };

        test({
            market: market1,
            tag1: "Funcrushery",
            tag2: "Adding",
            tag3: "",
            source: "http://answers.com",
            details: "details!",
            links: ["http://www.google.com", "news:alt.fun.crusher"],
            linksUrl: null
        });
        test({
            market: market2,
            tag1: null,
            tag2: null,
            tag3: null,
            source: "generic",
            details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            links: [],
            linksUrl: null
        });
        test({
            market: market3,
            tag1: "",
            tag2: null,
            tag3: null,
            source: "Reality Keys",
            details: null,
            links: ["ftp://127.0.0.1"],
            linksUrl: null
        });

    });

    describe("getMetadata", function () {

        var test = function (t) {
            it(t.market, function (done) {
                this.timeout(augur.constants.TIMEOUT);
                var teardown = function (e) {
                    augur.fire = fire;
                    augur.parseMetaList = parseMetaList;
                    done(e);
                };
                var fire = augur.fire;
                var parseMetaList = augur.parseMetaList;
                augur.fire = function (tx, callback) {
                    callback(tx);
                };
                augur.parseMetaList = function (tx, callback) {
                    var expected = clone(augur.tx.getMetadata);
                    expected.params = t.market;
                    assert.deepEqual(tx, expected);
                    teardown();
                };
                augur.getMetadata(t.market, noop);
            });
        };

        test({market: market1});
        test({market: market2});
        test({market: market3});

    });
});

if (!process.env.CONTINUOUS_INTEGRATION) {

    describe("Integration", function () {
        describe("setMetadata", function () {

            var test = function (t) {
                it(JSON.stringify(t), function (done) {
                    this.timeout(augur.constants.TIMEOUT);
                    augur.setMetadata({
                        market: t.market,
                        tag1: t.tag1,
                        tag2: t.tag2,
                        tag3: t.tag3,
                        source: t.source,
                        details: t.details,
                        links: t.links,
                        linksUrl: t.linksUrl,
                        onSent: function (res) {
                            assert.strictEqual(res.callReturn, "1");
                        },
                        onSuccess: function (res) {
                            assert.strictEqual(res.callReturn, "1");
                            done();
                        },
                        onFailed: done
                    });
                });
            };

            test({
                market: market1,
                tag1: "Funcrushery",
                tag2: "Adding",
                tag3: "",
                source: "http://answers.com",
                details: "details!",
                links: ["http://www.google.com", "news:alt.fun.crusher"],
                linksUrl: null
            });
            test({
                market: market2,
                tag1: null,
                tag2: null,
                tag3: null,
                source: "generic",
                details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                links: [],
                linksUrl: null
            });
            test({
                market: market3,
                tag1: "",
                tag2: null,
                tag3: null,
                source: "Reality Keys",
                details: null,
                links: ["ftp://127.0.0.1"],
                linksUrl: null
            });

        });

        describe("getMetadata", function () {

            var test = function (t) {
                it(t.market, function (done) {
                    augur.getMetadata(t.market, function (metadata) {
                        assert.deepEqual(t.expected, metadata);
                        done();
                    });
                });
            };

            test({
                market: market1,
                expected: {
                    tag1: "Funcrushery",
                    tag2: "Adding",
                    tag3: null,
                    source: "http://answers.com",
                    details: "details!",
                    links: ["http://www.google.com", "news:alt.fun.crusher"]
                }
            });
            test({
                market: market2,
                expected: {
                    tag1: null,
                    tag2: null,
                    tag3: null,
                    source: "generic",
                    details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                    links: []
                }
            });
            test({
                market: market3,
                expected: {
                    tag1: null,
                    tag2: null,
                    tag3: null,
                    source: "Reality Keys",
                    details: null,
                    links: ["ftp://127.0.0.1"]
                }
            });

        });
    });

}
