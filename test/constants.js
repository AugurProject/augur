/** 
 * constants for augur.js unit tests
 */
var MODULAR = typeof(module) != 'undefined';

var constants = {};

constants.accounts = {
    loopy: "0x00e3f8de3ed9d428dc235ce0c25bc1136073be8b",
    jack: "0x63524e3fe4791aefce1e932bbfb3fdf375bfad89",
    jack_eth: "0x32a34974787b46a62dbecc491c8a030185eaeb9d",
    heavy: "0x816e547d69e20e918340e7ff766c9ea841fe577a",
    lifespan: "0x74dcba4a17d257486785f1811604c8fba5373eb4",
    lifespan_eth: "0x8c9c88015d33c5b40d26ba87f1425dcc6cc98ff2",
    simulator2: "0x78829d3d1fd441aee8eff7a1263c11ed2f3adba7",
    toast: "0xb76a02724d44c89c20e41882f729a092f14d3eaf",
    joey: "0x1c11aa45c792e202e9ffdc2f12f99d0d209bef70",
    chris: "0x9b7e6cd69f45d93336606b0f70dac77b5b6e9fb0",
    scott: "0x6fc0a64e2dce367e35417bfd1568fa35af9f3e4b",
    jay: "0x6a56cf7a57405800b18e3e0940628c190cfa73bc"
};

constants.examples = {
    ten: "0x3caf506cf3d5bb16ba2c8f89a6591c5160d69cf3",
    mul2: "0x5204f18c652d1c31c6a5968cb65e011915285a50",
    multiplier: "0x8a7529b95f769cd0197cd7022cab5f4ef0874b31"
};

if (MODULAR) module.exports = constants;
