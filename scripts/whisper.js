var Augur = require("../src/augur");

function test_whisper() {
    var comment_text = Math.random().toString(36).substring(4);
    var market_id = "0x00000003";
    var whisper_id = Augur.newIdentity();
    if (whisper_id && !whisper_id.error) {
        var post_params = {
            from: whisper_id,
            topics: [ market_id ],
            priority: '0x64',
            ttl: "0x500" // time-to-live (until expiration) in seconds
        };
        Augur.commentFilter(market_id, function (filter) {
            post_params.payload = numeric.prefix_hex(numeric.encode_hex(comment_text));
            Augur.post(post_params, function (post_ok) {
                if (post_ok) {
                    Augur.getFilterChanges(filter, function (message) {
                        if (message) {
                            var updated_comments = JSON.stringify([{
                                whisperId: message[0].from, // whisper ID
                                from: Augur.coinbase, // ethereum account
                                comment: numeric.decode_hex(message[0].payload),
                                time: message[0].sent
                            }]);
                            // get existing comment(s) stored locally
                            Augur.comments.db.get(market_id, function (comments) {
                                if (comments) {
                                    updated_comments = updated_comments.slice(0,-1) + "," + comments.slice(1);
                                }
                                Augur.comments.db.write(market_id, updated_comments, function (put_ok) {
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
    } else {
        throw new Error(whisper_id.message);
    }
}

test_whisper();
