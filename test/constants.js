var NODE_JS = typeof(module) != 'undefined';

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
    chris: "0x9b7e6cd69f45d93336606b0f70dac77b5b6e9fb0"
};

constants.contracts = {
    examples: {
        ten: "0x3caf506cf3d5bb16ba2c8f89a6591c5160d69cf3",
        mul2: "0x5204f18c652d1c31c6a5968cb65e011915285a50",
        multiplier: "0x8a7529b95f769cd0197cd7022cab5f4ef0874b31"
    },
    // data & api files
    whitelist: "0x21dbe4a05a9174e96e6c6bc1e05a7096338cb0d6",
    events: "0xb71464588fc19165cbdd1e6e8150c40df544467b",
    expiringEvents: "0x61d90fd4c1c3502646153003ec4d5c177de0fb58",
    reporting: "0xd1f7f020f24abca582366ec80ce2fef6c3c22233",
    branches: "0x13dc5836cd5638d0b81a1ba8377a7852d41b5bbe",
    info: "0x910b359bb5b2c2857c1d3b7f207a08f3f25c4a8b",
    cash: "0xf1d413688a330839177173ce98c86529d0da6e5c",
    markets: "0x75ee234fe5ef1cd493c2af38a2ae7d0d0cba01f5",
    // function files
    checkQuorum: "0x4eaa7a8b00107bbc11909e327e163b067fd3cfb9",
    createBranch: "0x5c955b31ac72c83ffd7562aed4e2100b2ba09a3b",
    buyAndSellShares: "0xfde83609d8bd5e4bfd6479af2b1cb28c85f0bce7",
    createEvent: "0xcae6d5912033d66650894e2ae8c2f7502eaba15c",
    p2pwagers: "0x45077327d89f04c8b892ae0872e5c31fc0447288",
    sendReputation: "0x049487d32b727be98a4c8b58c4eab6521791f288",
    transferShares: "0x78da82256f5775df22eee51096d27666772b592d",
    makeReports: "0x72f249c06299308e5b7aaaa4d155ed61a1f66671",
    createMarket: "0x386acc6b970aea7c6f9b87e7622d2ae7c18d377a",
    closeMarket: "0xf365b989d905a63157af2885c3d5bf03d68be3cb",
    dispatch: "0x9bb646e3137f1d43e4a31bf8a6377c299f26727d",
    // consensus
    statistics: "0x0cb1277671d162b2f5c81e9435744f63768398d0",
    interpolate: "0xeb51564b43068745ae80136fcefe3ca532617a87",
    center: "0xcff950797165df23550b6d79fa98e55d4c250fbe",
    score: "0x7e6a5373193e42e77133b44707e6dbce92adc6f4",
    adjust: "0xfd268b3d161e0af75e487950d44e23c91229eb7f",
    resolve: "0x82a0ce86301c4f1832f78a324c20dd981e21d57b",
    payout: "0x0a4184e2bc58669fb78a9bcee0cc1ab0da9d3ce3",
    redeem_interpolate: "0x6e87d29e2b80d1cfeff57f782dcb57cd2cc15d2d",
    redeem_center: "0x1f0571210c03efb7a616ed8a29d408a81cefe846",
    redeem_score: "0xcd2f28fe067ea3cdc3b55f1a1e62cb347118b04c",
    redeem_adjust: "0x562cc65e8d901f03bbeb6d83011bbd48ad1d377e",
    redeem_resolve: "0xa9b43b17ed17106f075960f9b9af38c330df9471",
    redeem_payout: "0xe995724195e58489f75c2e12247ce28bf50a5245"
};

if (NODE_JS) module.exports = constants;
