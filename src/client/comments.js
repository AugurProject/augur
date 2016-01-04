/**
 * augur comments
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var async = require("async");
var multihash = require("multi-hash");
var abi = require("augur-abi");
var errors = require("augur-contracts").errors;
var constants = require("../constants");
var ipfsAPI;
if (global) {
    ipfsAPI = global.ipfsAPI || require("ipfs-api");
} else if (window) {
    ipfsAPI = window.ipfsAPI || require("ipfs-api");
} else {
    ipfsAPI = require("ipfs-api");
}

var IPFS_DEFAULT = constants.IPFS_LOCAL;
var NUM_NODES = constants.IPFS_REMOTE.length;
var REMOTE = null;

module.exports = function () {

    var augur = this;
    if (augur.protocol === "https:") {
        IPFS_DEFAULT = constants.IPFS_REMOTE[0];
        REMOTE = IPFS_DEFAULT;
    }

    return {

        debug: false,

        ipfs: ipfsAPI(IPFS_DEFAULT),

        remote: REMOTE,

        remoteNodeIndex: 0,

        remoteNodes: constants.IPFS_REMOTE,

        localNode: (REMOTE) ? null : constants.IPFS_LOCAL,

        useLocalNode: function (url) {
            if (url) this.localNode = url;
            this.ipfs = ipfsAPI(this.localNode);
            this.remote = null;
            return this.localNode;
        },

        useRemoteNode: function (url) {
            if (url) {
                this.remote = url;
                this.remoteNodes.push(url);
                this.remoteNodeIndex = this.remoteNodes.length - 1;
                ++NUM_NODES;
            }
            this.remote = this.remoteNodes[this.remoteNodeIndex % NUM_NODES];
            this.ipfs = ipfsAPI(this.remote);
            this.localNode = null;
            return this.remote;
        },

        getComment: function (ipfsHash, blockNumber, cb, tries) {
            var self = this;
            tries = tries || 0;
            if (tries > NUM_NODES) return cb(errors.IPFS_GET_FAILURE);
            this.ipfs.object.get(ipfsHash, function (err, obj) {
                if (err) {
                    self.remote = self.remoteNodes[++self.remoteNodeIndex % NUM_NODES];
                    self.ipfs = ipfsAPI(self.remote);
                    return self.getComment(ipfsHash, blockNumber, cb, ++tries);
                }
                if (!obj) return self.getComment(ipfsHash, blockNumber, cb, ++tries);
                self.ipfs.pin.add(ipfsHash, function (e, pinned) {
                    if (e) {
                        self.remote = self.remoteNodes[++self.remoteNodeIndex % NUM_NODES];
                        self.ipfs = ipfsAPI(self.remote);
                        return self.getComment(ipfsHash, blockNumber, cb, ++tries);
                    }
                    var data = obj.Data;
                    if (!data) return self.getComment(ipfsHash, blockNumber, cb, ++tries);
                    data = JSON.parse(data.slice(data.indexOf("{"), data.lastIndexOf("}") + 1));
                    if (blockNumber === null || blockNumber === undefined) {
                        return cb(null, {
                            ipfsHash: ipfsHash,
                            author: data.author,
                            message: data.message || ""
                        });
                    }
                    augur.rpc.getBlock(blockNumber, true, function (block) {
                        if (!block || block.error) return cb(block);
                        cb(null, {
                            ipfsHash: ipfsHash,
                            author: data.author,
                            message: data.message || "",
                            blockNumber: parseInt(blockNumber),
                            time: parseInt(block.timestamp)
                        });
                    });
                });
            });
        },

        getMarketComments: function (market, cb) {
            if (!market || !augur.utils.is_function(cb)) return;
            var self = this;
            augur.filters.eth_getLogs({
                fromBlock: "0x1",
                toBlock: "latest",
                address: augur.contracts.comments,
                topics: ["comment"]
            }, function (logs) {
                if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
                    return cb(errors.IPFS_GET_FAILURE);
                }
                if (logs.error) return cb(logs);
                if (!logs || !market) return cb(errors.IPFS_GET_FAILURE);
                var comments = [];
                market = abi.bignum(abi.unfork(market));
                async.eachSeries(logs, function (thisLog, nextLog) {
                    if (!thisLog || !thisLog.topics) return nextLog();
                    if (!abi.bignum(abi.unfork(thisLog.topics[1])).eq(market)) {
                        return nextLog();
                    }
                    var ipfsHash = multihash.encode(abi.unfork(thisLog.data));
                    var blockNumber = abi.hex(thisLog.blockNumber);
                    self.getComment(ipfsHash, blockNumber, function (err, comment) {
                        if (err) return nextLog(err);
                        comments.push(comment);
                        nextLog();
                    });
                }, function (err) {
                    if (err) return cb(err);
                    comments.reverse();
                    cb(null, comments);
                });
            });
        },

        // pin data to all remote nodes
        // TODO: attach ipfsAPI instances to object for re-use
        broadcastPin: function (ipfsHash, cb) {
            var self = this;
            var pinningNodes = [];
            cb = cb || function () {};
            async.eachSeries(this.remoteNodes, function (node, nextNode) {
                if (self.remote && node.host === self.remote.host) {
                    console.log("1", node);
                    return nextNode();
                }
                ipfsAPI(node).pin.add(ipfsHash, function (err, pinned) {
                    if (err) {
                        console.log("2", node, err);
                        return nextNode(err);
                    }
                    if (pinned) {
                        if (pinned.error) { console.log("3", node); return nextNode(pinned); }
                        pinningNodes.push(node);
                    }
                    console.log("4", node);
                    nextNode();
                });
            }, function (err) {
                if (err) cb(err);
                cb(null, pinningNodes);
            });
        },

        // comment: {marketId, message, author}
        addMarketComment: function (comment, onSent, onSuccess, onFailed) {
            var self = this;
            var tx = abi.copy(augur.tx.comments.addComment);
            this.ipfs.add(this.ipfs.Buffer(JSON.stringify(comment)), function (err, files) {
                if (self.debug) console.log("ipfs.add:", files);
                if (err) {
                    console.log("remoteNodeIndex:", self.remoteNodeIndex);
                    self.remote = self.remoteNodes[++self.remoteNodeIndex % NUM_NODES];
                    self.ipfs = ipfsAPI(self.remote);
                    return self.addMarketComment(comment, onSent, onSuccess, onFailed);
                }
                if (!files) return onFailed(errors.IPFS_ADD_FAILURE);
                var ipfsHash = (files.constructor === Array) ? files[0].Hash : files.Hash;

                // pin data to the active node
                self.ipfs.pin.add(ipfsHash, function (err, pinned) {
                    if (self.debug) console.log("ipfs.pin.add:", pinned);
                    if (err) return onFailed(err);
                    tx.params = [
                        abi.unfork(comment.marketId, true),
                        abi.hex(multihash.decode(ipfsHash), true)
                    ];
                    augur.transact(tx, function (res) {
                        self.broadcastPin(ipfsHash);
                        onSent(res);
                    }, onSuccess, onFailed);
                });
            });
        }
    };
};
