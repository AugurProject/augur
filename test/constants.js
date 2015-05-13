/** 
 * constants for augur.js unit tests
 */
var MODULAR = typeof(module) != 'undefined';

var constants = {};

constants.accounts = {
    loopy: "0x00e3f8de3ed9d428dc235ce0c25bc1136073be8b",
    jack: "0xa18e10a46a36d59cb2ef1fe8ec18a0a5c78a7fbf",
    jack_old: "0x63524e3fe4791aefce1e932bbfb3fdf375bfad89",
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
constants.whisper = {
    jack: "0x04ba344c755678c805a966f9ff425872e297220c3a25a7cc3f0400313fa29d387d83b899f046fd18b4cfab845d4c8a78f6ab14a5bbd823219577091c33d766012b",
    vent: "0x04caf66a8e7eb14434ccb0f5d79782578b1b93c9e0467270989e58f276f564b7aaf7a44706af01fecf029f6e8db86eafc46f9e959e9d2aa680d2f875a964bfd722"
};

constants.examples = {
    ten: "0x3caf506cf3d5bb16ba2c8f89a6591c5160d69cf3",
    mul2: "0x5204f18c652d1c31c6a5968cb65e011915285a50",
    multiplier: "0x8a7529b95f769cd0197cd7022cab5f4ef0874b31"
};

if (MODULAR) module.exports = constants;
