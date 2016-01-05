/**
 * Comments tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var constants = require("../../src/constants");
var utils = require("../../src/utilities");
var augurpath = "../../src/index";
var augur = utils.setup(require(augurpath), process.argv.slice(2));
var comments = augur.comments;

describe("Comments", function () {
    var markets, market, comment, ipfsHash;

    markets = augur.getMarkets(augur.branches.dev);
    market = markets[markets.length - 1];
    comment = {marketId: market, author: augur.coinbase, message: "haters gonna hate"};
    ipfsHash = "QmUTAHurKVErazXoNNLDZi7v4MYduLNSckLvY7zhT1gJaD";

    it("retrieve a comment from its hash", function (done) {
        this.timeout(constants.TIMEOUT);
        var blockNumber = 2;
        comments.getComment(ipfsHash, null, function (err, c) {
            assert.isNull(err);
            assert.isObject(c);
            assert.property(c, "author");
            assert.strictEqual(c.author, augur.coinbase);
            assert.property(c, "message");
            assert.strictEqual(c.message, comment.message);
            assert.notProperty(c, "blockNumber");
            assert.notProperty(c, "time");
            comments.getComment(ipfsHash, blockNumber, function (err, c) {
                assert.isNull(err);
                assert.isObject(c);
                assert.property(c, "author");
                assert.strictEqual(c.author, augur.coinbase);
                assert.property(c, "message");
                assert.strictEqual(c.message, comment.message);
                assert.property(c, "blockNumber");
                assert.strictEqual(c.blockNumber, blockNumber);
                assert.property(c, "time");
                assert.isAbove(c.time, 0);
                done();
            });
        });
    });

    it("add a comment to market " + market, function (done) {
        this.timeout(constants.TIMEOUT);
        comments.addMarketComment(comment,
            function (res) {
                assert.property(res, "txHash");
                assert.strictEqual(res.callReturn, "1");
            },
            function (res) {
                assert.property(res, "txHash");
                assert.strictEqual(res.callReturn, "1");
                assert.strictEqual(res.from, augur.coinbase);
                assert.strictEqual(res.to, augur.contracts.comments);
                assert.isAbove(Number(res.blockHash), 0);
                assert.isAbove(Number(res.blockNumber), 0);
                assert.strictEqual(Number(res.value), 0);
                done();
            },
            done
        );
    });

    it("get comments for market " + market, function (done) {
        this.timeout(constants.TIMEOUT);
        comments.getMarketComments(market, function (err, comments) {
            assert.isNull(err);
            assert.isAbove(comments.length, 0);
            assert.isArray(comments);
            for (var i = 0, len = comments.length; i < len; ++i) {
                assert.isObject(comments[i]);
                assert.property(comments[i], "author");
                assert.property(comments[i], "message");
                assert.property(comments[i], "blockNumber");
                assert.isAbove(comments[i].blockNumber, 0);
                assert.property(comments[i], "time");
                assert.isAbove(comments[i].time, 0);
            }
            done();
        });
    });

    it("pin comment to all remote nodes", function (done) {
        this.timeout(constants.TIMEOUT);
        var augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));
        var comments = augur.comments;
        comments.broadcastPin(ipfsHash, function (err, pinningNodes) {
            assert.isNull(err);
            assert.isArray(pinningNodes);
            assert.strictEqual(pinningNodes.length, comments.remoteNodes.length);
            assert.sameDeepMembers(pinningNodes, comments.remoteNodes);
            assert.sameDeepMembers(pinningNodes, constants.IPFS_REMOTE);
            done();
        });
    });

    it("graceful IPFS node failure", function (done) {
        this.timeout(constants.TIMEOUT);
        var augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));
        var comments = augur.comments;
        var badHost = "sfpi.rugua.net";

        // insert bad node manually into remoteNodes array
        var com = abi.copy(comment);
        com.message = "players gonna play";
        assert.strictEqual(comments.remoteNodeIndex, 0);
        assert.isArray(comments.remoteNodes);
        assert.strictEqual(comments.remoteNodes.length, 4);
        assert.deepEqual(comments.remoteNodes, constants.IPFS_REMOTE);
        comments.remoteNodes[0].host = badHost;
        comments.remote = comments.remoteNodes[0].host;
        assert.strictEqual(comments.remoteNodeIndex, 0);
        assert.strictEqual(comments.useRemoteNode().host, badHost);
        assert.isNotNull(comments.remote);
        assert.strictEqual(comments.remoteNodes[comments.remoteNodeIndex].host, badHost);
        assert.strictEqual(comments.remote.host, badHost);
        assert.strictEqual(comments.remoteNodes.length, 4);
        comments.addMarketComment(com,
            function (res) {
                assert.isNotNull(comments.remote);
                assert.strictEqual(comments.remoteNodeIndex, 1);
                assert.deepEqual(comments.remote, comments.remoteNodes[1]);
                assert.property(res, "txHash");
                assert.strictEqual(res.callReturn, "1");
            },
            function (res) {
                assert.property(res, "txHash");
                assert.strictEqual(res.callReturn, "1");
                assert.strictEqual(res.from, augur.coinbase);
                assert.strictEqual(res.to, augur.contracts.comments);
                assert.isAbove(Number(res.blockHash), 0);
                assert.isAbove(Number(res.blockNumber), 0);
                assert.strictEqual(Number(res.value), 0);
                
                // specify bad node as argument to useRemoteNode
                comments.remoteNodeIndex = 0;
                comments.remoteNodes = abi.copy(constants.IPFS_REMOTE);
                assert.deepEqual(comments.remoteNodes, constants.IPFS_REMOTE);
                assert.strictEqual(comments.useRemoteNode({
                    host: badHost,
                    port: "443",
                    protocol: "https"
                }).host, badHost);
                assert.isNotNull(comments.remote);
                assert.strictEqual(comments.remoteNodes[comments.remoteNodeIndex].host, badHost);
                assert.strictEqual(comments.remote.host, badHost);
                assert.strictEqual(comments.remoteNodes.length, 5);
                assert.strictEqual(comments.remoteNodeIndex, 4);
                com.message = "breakers gonna break";
                comments.addMarketComment(com,
                    function (res) {
                        assert.isNotNull(comments.remote);
                        assert.strictEqual(comments.remoteNodeIndex, 6);
                        assert.deepEqual(comments.remote, comments.remoteNodes[1]);
                        assert.property(res, "txHash");
                        assert.strictEqual(res.callReturn, "1");
                    },
                    function (res) {
                        assert.property(res, "txHash");
                        assert.strictEqual(res.callReturn, "1");
                        assert.strictEqual(res.from, augur.coinbase);
                        assert.strictEqual(res.to, augur.contracts.comments);
                        assert.isAbove(Number(res.blockHash), 0);
                        assert.isAbove(Number(res.blockNumber), 0);
                        assert.strictEqual(Number(res.value), 0);

                        // revert to local IPFS node
                        assert.deepEqual(
                            comments.useLocalNode(constants.IPFS_LOCAL),
                            constants.IPFS_LOCAL
                        );
                        assert.isNotNull(comments.localNode);
                        assert.isNull(comments.remote);
                        assert.deepEqual(comments.localNode, constants.IPFS_LOCAL);
                        assert.strictEqual(comments.remoteNodeIndex, 6); // unchanged
                        done();
                    },
                    done
                );
            },
            done
        );
    });

});
