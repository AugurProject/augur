/**
 * Whispernet comments
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var abi = require("augur-abi");
var errors = require("../errors");
var constants = require("../constants");

module.exports = function () {

    var augur = this;

    return {

        // key: marketId => {filterId: hexstring, polling: bool}
        filters: {},

        shh_newIdentity: function (f) {
            return augur.rpc.broadcast(augur.rpc.marshal("newIdentity", null, "shh_"), f);
        },

        shh_newFilter: function (params, f) {
            return augur.rpc.broadcast(augur.rpc.marshal("newFilter", params, "shh_"), f);
        },

        commentFilter: function (market, f) {
            return this.shh_newFilter({ topics: [market] }, f);
        },

        shh_uninstallFilter: function (filter, f) {
            return augur.rpc.broadcast(augur.rpc.marshal("uninstallFilter", filter, "shh_"), f);
        },

        shh_post: function (params, f) {
            return augur.rpc.broadcast(augur.rpc.marshal("post", params, "shh_"), f);
        },

        shh_getMessages: function (filter, f) {
            return augur.rpc.broadcast(augur.rpc.marshal("getMessages", filter, "shh_"), f);
        },

        shh_getFilterChanges: function (filter, f) {
            /**
             * example:
             * [ { payload: '0x5b7b22776869737065724964223a22307830343134616631343835663634646637626665313330326333336363636163383930313735663966633736333734313132626334633765636362616162396461393033353237323061633830636133336666626565373030373637633231626265386631386261613966323665363263313266343232353533323263373961613462222c2266726f6d223a22307830356165316430636136323036633631363862343265666364316662653065643134346538323162222c22636f6d6d656e74223a2231316d353865347a3873656d69222c2274696d65223a313434333539363731307d2c7b22776869737065724964223a22307830343831656164346337353565373730666362386331393135313235646163663539663733656534636665316632333162663835356439653935376466323766303836323634323235613531656263346363346232323266663665613030383363623737663539626164623937623864656337346230323665616361333466393638222c2266726f6d223a22307830356165316430636136323036633631363862343265666364316662653065643134346538323162222c22636f6d6d656e74223a2272386f7270366d6575336469222c2274696d65223a313434333539363730377d5d',
             * to: '0x0',
             * from: '0x045cf41dbc207a249f27b3ef5b7863558d68d16e72af0599019eedb209d9537dd2dbd866ce2dbb84c5a16c690339f0d297064a2ce762437e10e2ba4df72d603f94',
             * sent: 1443599113,
             * ttl: 1536,
             * hash: '0x1965bee026fcb03d00b02dbee66820fcba12148f7604ea618eab69a83bb98a5f' } ]
             */
            return augur.rpc.broadcast(augur.rpc.marshal("getFilterChanges", filter, "shh_"), f);
        },

        /**
         * Incoming comment filter:
         *  - compare comment string length, write the longest to leveldb
         *  - 10 second ethereum network polling interval
         */
        pollFilter: function (market_id, filter_id) {
            var self = this;
            var incoming_comments, stored_comments, num_messages, incoming_parsed, stored_parsed;
            this.shh_getFilterChanges(filter_id, function (message) {
                if (message) {
                    num_messages = message.length;
                    if (num_messages) {
                        for (var i = 0; i < num_messages; ++i) {
                            // console.log("\n\nPOLLFILTER: reading incoming message " + i.toString());
                            incoming_comments = abi.decode_hex(message[i].payload);
                            if (incoming_comments) {
                                incoming_parsed = JSON.parse(incoming_comments);
                                // console.log(incoming_parsed);
                    
                                // get existing comment(s) stored locally
                                stored_comments = augur.db.leveldb.get(augur.rpc, market_id, "comments");

                                // check if incoming comments length > stored
                                if (stored_comments && stored_comments.length) {
                                    stored_parsed = JSON.parse(stored_comments);
                                    if (incoming_parsed.length > stored_parsed.length ) {
                                        // console.log(incoming_parsed.length.toString() + " incoming comments");
                                        // console.log("[" + filter_id + "] overwriting comments for market: " + market_id);
                                        if (augur.db.leveldb.put(augur.rpc, market_id, incoming_comments, "comments")) {
                                            // console.log("[" + filter_id + "] overwrote comments for market: " + market_id);
                                        }
                                    } else {
                                        // console.log(stored_parsed.length.toString() + " stored comments");
                                        // console.log("[" + filter_id + "] retaining comments for market: " + market_id);
                                    }
                                } else {
                                    // console.log(incoming_parsed.length.toString() + " incoming comments");
                                    // console.log("[" + filter_id + "] inserting first comments for market: " + market_id);
                                    if (augur.db.leveldb.put(augur.rpc, market_id, incoming_comments, "comments")) {
                                        // console.log("[" + filter_id + "] overwrote comments for market: " + market_id);
                                    }
                                }
                            }
                        }
                    }
                }
                // wait a few seconds, then poll the filter for new messages
                setTimeout(function () {
                    self.pollFilter(market_id, filter_id);
                }, constants.COMMENT_POLL_INTERVAL);
            });
        },

        initComments: function (market) {
            var filter, comments, whisper_id;

            // make sure there's only one shh filter per market
            if (this.filters[market] && this.filters[market].filterId) {
                // console.log("existing filter found");
                this.pollFilter(market, this.filters[market].filterId);
                return this.filters[market].filterId;

            // create a new shh filter for this market
            } else {
                filter = this.commentFilter(market);
                if (filter && filter !== "0x") {
                    // console.log("creating new filter");
                    this.filters[market] = {
                        filterId: filter,
                        polling: true
                    };

                    // broadcast all comments in local leveldb
                    comments = augur.db.leveldb.get(augur.rpc, market, "comments");
                    if (comments) {
                        whisper_id = this.shh_newIdentity();
                        if (whisper_id) {
                            var transmission = {
                                from: whisper_id,
                                topics: [market],
                                payload: abi.prefix_hex(abi.encode_hex(comments)),
                                priority: "0x64",
                                ttl: "0x500" // time-to-live (until expiration) in seconds
                            };
                            // console.log(JSON.stringify(transmission, null, 2));
                            if (!this.shh_post(transmission)) {
                                return errors.WHISPER_POST_FAILED;
                            }
                        }
                    }
                    this.pollFilter(market, filter);
                    return filter;
                }
            }
        },

        resetComments: function (market) {
            return augur.db.leveldb.put(augur.rpc, market, "", "comments");
        },

        getMarketComments: function (market, callback) {
            if (callback && callback.constructor === Function) {
                augur.db.leveldb.get(augur.rpc, market, "comments", function (comments) {
                    if (comments && !comments.error) {
                        return callback(JSON.parse(comments));
                    }
                    callback(comments);
                });
            } else {
                var comments = augur.db.leveldb.get(augur.rpc, market, "comments");
                if (comments) {
                    if (!comments.error) {
                        return JSON.parse(comments);
                    } else {
                        return comments;
                    }
                } else {
                    return null;
                }
            }
        },

        addMarketComment: function (pkg) {
            var market, comment_text, author, updated, transmission, whisper_id, comments;

            market = pkg.marketId;
            comment_text = pkg.message;
            author = pkg.author;
            whisper_id = this.shh_newIdentity();

            if (whisper_id && !whisper_id.error) {
                updated = JSON.stringify([{
                    whisperId: whisper_id,
                    from: author, // ethereum account
                    comment: comment_text,
                    time: Math.floor((new Date()).getTime() / 1000)
                }]);

                // get existing comment(s) stored locally
                comments = augur.db.leveldb.get(augur.rpc, market, "comments");
                if (comments !== undefined && comments !== null && !comments.error) {
                    if (comments && comments !== '""') {
                        updated = updated.slice(0, -1) + "," + comments.slice(1);
                    }
                    if (augur.db.leveldb.put(augur.rpc, market, updated, "comments")) {
                        transmission = {
                            from: whisper_id,
                            topics: [market],
                            payload: abi.prefix_hex(abi.encode_hex(updated)),
                            priority: "0x64",
                            ttl: "0x600" // 10 minutes
                        };
                        // console.log(JSON.stringify(transmission, null, 2));
                        if (this.shh_post(transmission)) {
                            return JSON.parse(abi.decode_hex(transmission.payload));
                        } else {
                            return errors.WHISPER_POST_FAILED;
                        }
                    } else {
                        return errors.DB_WRITE_FAILED;
                    }
                } else {
                    return comments;
                }
            } else {
                return whisper_id;
            }
        }

    };
};
