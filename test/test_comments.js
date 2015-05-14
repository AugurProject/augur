/**
 * Test-driving Augur's whisper-based comments system
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var Augur = require("../augur");

Augur.connect();

var log = console.log;

function test_comments() {
    var market = "0x01";

    log("\nReset comments");
    log(Augur.resetComments(market));
    
    log("\nAugur.getMarketComments:");
    var comments = Augur.getMarketComments(market);
    log(comments);
    
    log("\nAugur.initComments:");
    if (Augur.initComments(market)) {
        var pkg = {
            marketId: market,
            message: Math.random().toString(36).substring(4),
            author: Augur.coinbase
        };
        log("\nAugur.addMarketComment(" + JSON.stringify(pkg, null, 2) + "):");
        var updated_comments = Augur.addMarketComment(pkg);

        pkg.message = Math.random().toString(36).substring(4);
        log("\nAugur.addMarketComment(" + JSON.stringify(pkg, null, 2) + "):");
        updated_comments = Augur.addMarketComment(pkg);
        log(updated_comments.length.toString() + " comments found");
        log(updated_comments);

        log("\nAugur.getMarketComments:");
        comments = Augur.getMarketComments(market);
        log(comments);

        pkg.message = Math.random().toString(36).substring(4);
        log("\nAugur.addMarketComment(" + JSON.stringify(pkg, null, 2) + "):");
        updated_comments = Augur.addMarketComment(pkg);
        log(updated_comments.length.toString() + " comments found");
        log(updated_comments);

        log("\nReset comments");
        log(Augur.resetComments(market));

        // crashes geth (!)
        // log("\nUninstalling filter " + filter);
        // log(Augur.uninstallFilter(filter));
    }
}

function interlocutor() {
    var market = "0x01";

    log("\nAugur.getMarketComments:");
    var comments = Augur.getMarketComments(market);
    log(comments);

    var pkg = {
        marketId: market,
        message: Math.random().toString(36).substring(4),
        author: Augur.coinbase
    };
    log("\nAugur.addMarketComment(" + JSON.stringify(pkg, null, 2) + "):");
    var updated_comments = Augur.addMarketComment(pkg);
    pkg.message = Math.random().toString(36).substring(4);
    log("\nAugur.addMarketComment(" + JSON.stringify(pkg, null, 2) + "):");
    updated_comments = Augur.addMarketComment(pkg);
    pkg.message = Math.random().toString(36).substring(4);
    log("\nAugur.addMarketComment(" + JSON.stringify(pkg, null, 2) + "):");
    updated_comments = Augur.addMarketComment(pkg);
    log(updated_comments.length.toString() + " comments found");
    log(updated_comments);
}

function test_whisper() {
    var comment_text = Math.random().toString(36).substring(4);
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
                                            log(JSON.parse(updated_comments));
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
}

test_comments();
// test_whisper();
