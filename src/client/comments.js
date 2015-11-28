/**
 * Whispernet comments
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var async = require("async");
var multihash = require("multi-hash");
var ipfs = require("ipfs-api")("localhost", "5001");
var abi = require("augur-abi");
var errors = require("../errors");
var constants = require("../constants");

module.exports = function () {

    var augur = this;

    return {

        getMarketComments: function (market, cb) {
            if (!market || !augur.utils.is_function(cb)) return;
            augur.filters.eth_getLogs({
                fromBlock: "0x1",
                toBlock: "latest",
                address: augur.contracts.comments,
                topics: ["comment"]
            }, function (logs) {
                if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
                    return cb(null);
                }
                if (logs.error) return cb(logs);
                if (!logs || !market) return cb(null);
                var comments = [];
                market = abi.bignum(abi.unfork(market));
                async.eachSeries(logs, function (thisLog, nextLog) {
                    if (!thisLog || !thisLog.topics) return nextLog();
                    if (!abi.bignum(abi.unfork(thisLog.topics[1])).eq(market)) {
                        return nextLog();
                    }
                    var ipfsHash = multihash.encode(abi.unfork(thisLog.data));
                    ipfs.object.get(ipfsHash, function (err, obj) {
                        if (err) return nextLog(err);
                        var data = obj.Data;
                        data = JSON.parse(data.slice(data.indexOf("{"), data.lastIndexOf("}") + 1));
                        comments.push({
                            ipfsHash: ipfsHash,
                            author: data.author,
                            message: data.message || "",
                            blockNumber: abi.hex(thisLog.blockNumber)
                        });
                        nextLog();
                    });
                }, function (err) {
                    if (err) return cb(err);
                    comments.reverse();
                    cb(comments);
                });
            });
        },

        // comment: {marketId, message, author}
        addMarketComment: function (comment, onSent, onSuccess, onFailed) {
            var tx = augur.utils.copy(augur.tx.comments.addComment);
            ipfs.add(new Buffer(JSON.stringify(comment)), function (err, files) {
                if (err) return onFailed(err);
                if (files && files.constructor === Array && files.length) {
                    tx.params = [
                        abi.unfork(comment.marketId, true),
                        abi.hex(multihash.decode(files[0].Hash), true)
                    ];
                    augur.transact(tx, onSent, onSuccess, onFailed);
                }
            });
        }
    };
};
