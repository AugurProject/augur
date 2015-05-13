#!/usr/bin/env node
/**
 * Test-driving Augur's whisper-based comments system
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var Augur = require("./../augur");
var constants = require("./constants");

var print = console.log;

var TestComments = function () {
    // var market = "-0x57a7e0a3b713b12662f7891c5a29cf55a6756b28ecb5b1c2dc7869fbdcaa594a";
    var market = "0x01";

    print("\nReset comments");
    print(Augur.resetComments(market));
    
    print("\nAugur.getMarketComments:");
    var comments = Augur.getMarketComments(market);
    print(comments)
    
    print("\nAugur.initComments:");
    var filter = Augur.initComments(market);

    var pkg = {
        marketId: market,
        message: Math.random().toString(36).substring(4),
        author: Augur.coinbase
    };
    print("\nAugur.addMarketComment(" + JSON.stringify(pkg, null, 2) + "):");
    var updated_comments = Augur.addMarketComment(pkg);

    pkg.message = Math.random().toString(36).substring(4);
    print("\nAugur.addMarketComment(" + JSON.stringify(pkg, null, 2) + "):");
    var updated_comments = Augur.addMarketComment(pkg);
    print(updated_comments.length.toString() + " comments found");
    print(updated_comments);

    print("\nAugur.getMarketComments:");
    var comments = Augur.getMarketComments(market);
    print(comments)

    pkg.message = Math.random().toString(36).substring(4);
    print("\nAugur.addMarketComment(" + JSON.stringify(pkg, null, 2) + "):");
    var updated_comments = Augur.addMarketComment(pkg);
    print(updated_comments.length.toString() + " comments found");
    print(updated_comments);

    print("\nReset comments");
    print(Augur.resetComments(market));

    // crashes geth (!)
    // print("\nUninstalling filter " + filter);
    // print(Augur.uninstallFilter(filter));
};

var Interlocutor = function () {
    var market = "0x01";

    print("\nAugur.getMarketComments:");
    var comments = Augur.getMarketComments(market);
    print(comments)

    var pkg = {
        marketId: market,
        message: Math.random().toString(36).substring(4),
        author: Augur.coinbase
    };
    print("\nAugur.addMarketComment(" + JSON.stringify(pkg, null, 2) + "):");
    var updated_comments = Augur.addMarketComment(pkg);
    pkg.message = Math.random().toString(36).substring(4);
    print("\nAugur.addMarketComment(" + JSON.stringify(pkg, null, 2) + "):");
    var updated_comments = Augur.addMarketComment(pkg);
    pkg.message = Math.random().toString(36).substring(4);
    print("\nAugur.addMarketComment(" + JSON.stringify(pkg, null, 2) + "):");
    var updated_comments = Augur.addMarketComment(pkg);
    print(updated_comments.length.toString() + " comments found");
    print(updated_comments);
};

var TestWhisper = function () {
    var comment_text = Math.random().toString(36).substring(4);
    var dbname = "augur";
    var market_id = "0x00000003";
    Augur.newIdentity(function (whisper_id) {
        if (whisper_id) {
            var post_params = {
                from: whisper_id,
                topics: [ market_id ],
                priority: '0x64',
                ttl: "0x500" // time-to-live (until expiration) in seconds
            };
            Augur.commentFilter(market_id, function (filter) {
                post_params.payload = Augur.prefix_hex(Augur.encode_hex(comment_text));
                Augur.post(post_params, function (post_ok) {
                    if (post_ok) {
                        Augur.getFilterChanges(filter, function (message) {
                            if (message) {
                                var updated_comments = JSON.stringify([{
                                    whisperId: message[0].from, // whisper ID
                                    from: Augur.coinbase, // ethereum account
                                    comment: Augur.decode_hex(message[0].payload),
                                    time: message[0].sent
                                }]);
                                // get existing comment(s) stored locally
                                Augur.getString(market_id, function (comments) {
                                    if (comments) {
                                        updated_comments = updated_comments.slice(0,-1) + "," + comments.slice(1);
                                    }
                                    Augur.putString(market_id, updated_comments, function (put_ok) {
                                        if (put_ok && updated_comments) {
                                            print(JSON.parse(updated_comments));
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            });
        }
    });
};

TestComments();
// TestWhisper();
