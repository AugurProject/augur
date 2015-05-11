GLOBAL.BigNumber = require('bignumber.js');
GLOBAL.keccak_256 = require('js-sha3').keccak_256;
GLOBAL.XHR2 = require('xhr2');
GLOBAL.httpsync = require('http-sync');
GLOBAL.crypto = require('crypto');
GLOBAL._ = require('lodash');
GLOBAL.Augur = require('./augur');
GLOBAL.constants = require('./test/constants');
GLOBAL.rpc = {
    protocol: "http",
    host: "localhost",
    port: 8545
};

// var market = "0xeb81155da80c058324ef7a0d100fffa85f5ea459b6f8a48fa110c0875a1f5e63"
// Augur.getMarketInfo(market)
// traderID = Augur.getParticipantNumber(market, Augur.coinbase)
// Augur.getParticipantSharesPurchased(market, traderID, 1)
// Augur.getParticipantSharesPurchased(market, traderID, 2)
// Augur.buyShares(1010101, market, 1, 1)

// > Augur.buyShares(1010101, market, 2, '3.1415')
// [augur.js] {"id":6,"jsonrpc":"2.0","method":"eth_call","params":[{"from":"0x63524e3fe4791aefce1e932bbfb3fdf375bfad89","to":"0x9dff8b4278f05e37f00d7461b175e092ae611380","data":"0x40e0f208eb81155da80c058324ef7a0d100fffa85f5ea459b6f8a48fa110c0875a1f5e63","gas":"0x2dc6c0"}]}
// [augur.js] {"id":7,"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{"from":"0x63524e3fe4791aefce1e932bbfb3fdf375bfad89","to":"0x9dff8b4278f05e37f00d7461b175e092ae611380","data":"0xb8714a9a00000000000000000000000000000000000000000000000000000000000f69b5eb81155da80c058324ef7a0d100fffa85f5ea459b6f8a48fa110c0875a1f5e63000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000324395810624dd2f20000000000000000000000000000000000000000000000000000000000000000","gas":"0x2dc6c0"}]}
// '0xeef686db717fbba28f3623bc6eb8d6872d749ed8f3730a19d726a8bfee008044'
