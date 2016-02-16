/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var test = require("tape");
var fs = require("fs");
var join = require("path").join;
var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var clone = require("clone");
var utils = require("../app/libs/utilities");
var flux = require("./mock");
var tools = require("./tools");

// market ID on network 7
var marketId = abi.bignum("-0xe23ad526eb822279190558241a9ead324be156fa03c16ef21e17e0e9a44fcf72");

flux.augur.rpc.useHostedNode();
flux.augur.connect();
var account = {address: flux.augur.rpc.coinbase()};
var blockNumber = flux.augur.rpc.blockNumber();
var marketInfo = flux.augur.getMarketInfo(abi.hex(marketId));

// from https://github.com/AugurProject/ramble tests
var expected = {
    marketId: abi.hex(marketId),
    image: fs.readFileSync(join(__dirname, "lena.png")),
    details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    tags: ["latin", "lorem ipsum"],
    source: "Reality Keys",
    links: [
        "http://www.lipsum.com/",
        "https://github.com/traviskaufman/node-lipsum"
    ]
};

test("MarketActions.loadMetadata", function (t) {
    function checkMetadata(metadata) {
        t.equal(metadata.constructor, Object, "metadata is an object");
        t.equal(metadata.marketId, abi.hex(marketId), "metadata.marketId == " + abi.hex(marketId));
        t.true(Buffer.isBuffer(metadata.image), "metadata.image is a Buffer");
        t.equal(metadata.image.toString("base64"), expected.image.toString("base64"), "metadata.image == <lena.png>");
        t.equal(metadata.details.constructor, String, "metadata.details is a string");
        t.equal(metadata.details, expected.details, "metadata.details == " + expected.details);
        t.equal(metadata.tags.constructor, Array, "metadata.tags is an array");
        for (var i = 0; i < metadata.tags.length; ++i) {
            t.equal(metadata.tags[i].constructor, String, "metadata.tags[" + i + "] is a string");
        }
        t.deepEqual(metadata.tags, expected.tags, "metadata.tags == " + JSON.stringify(expected.tags));
        t.equal(metadata.source.constructor, String, "metadata.source is a string");
        t.equal(metadata.source, expected.source, "metadata.source == " + expected.source);
        t.equal(metadata.links.constructor, Array, "metadata.links is an array");
        for (var i = 0; i < metadata.links.length; ++i) {
            t.equal(metadata.links[i].constructor, String, "metadata.links[" + i + "] is a string");
        }
        t.deepEqual(metadata.links, expected.links, "metadata.links == " + JSON.stringify(expected.links));
    }
    var markets = {};
    markets[marketId] = clone(marketInfo);
    flux.stores.market.state.markets = markets;
    var LOAD_METADATA_SUCCESS = flux.register.LOAD_METADATA_SUCCESS;
    flux.register.LOAD_METADATA_SUCCESS = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        checkMetadata(payload.metadata);
        LOAD_METADATA_SUCCESS(payload);
        t.pass("dispatch LOAD_METADATA_SUCCESS");
        checkMetadata(flux.store("market").getMetadata(marketId));
        flux.register.LOAD_METADATA_SUCCESS = LOAD_METADATA_SUCCESS;
        t.end();
    };
    flux.actions.market.loadMetadata(clone(marketInfo));
});
