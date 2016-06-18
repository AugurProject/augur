/**
 * price logging/filter tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var join = require("path").join;
var async = require("async");
var BigNumber = require("bignumber.js");
var locks = require("locks");
var chalk = require("chalk");
var assert = require("chai").assert;
var abi = require("augur-abi");
var madlibs = require("madlibs");
var tools = require("../tools");
var constants = require("../../src/constants");
var augurpath = "../../src/index";
var augur = tools.setup(require(augurpath), process.argv.slice(2));

var DELAY = 2500;
var branch = augur.branches.dev;
var markets = augur.getMarketsInBranch(branch);
var numMarkets = markets.length;
var marketId, marketInfo;
do {
    marketId = markets[--numMarkets];
    marketInfo = augur.getMarketInfo(marketId);
} while (marketInfo.type === "combinatorial");
var outcome = "1";
var amount = "1";
var sellAmount = (Number(amount) / 2).toString();
var newMarketId;

function trade(done, augur) {
    var password = fs.readFileSync(join(process.env.HOME, ".ethereum", ".password")).toString();
    var accounts = augur.rpc.personal("listAccounts");
    augur.rpc.personal("unlockAccount", [accounts[0], password]);
    augur.from = accounts[0];
    augur.connector.from_field_tx(accounts[0]);
    augur.sync(augur.connector);
    augur.buyCompleteSets({
        market: marketId,
        amount: amount,
        onSent: function (r) {},
        onSuccess: function (r) {
            augur.sell({
                amount: amount,
                price: "0.01",
                market: marketId,
                outcome: outcome,
                onSent: function (r) {},
                onSuccess: function (r) {
                    augur.from = accounts[2];
                    augur.connector.from_field_tx(accounts[2]);
                    augur.sync(augur.connector);
                    augur.get_trade_ids(marketId, function (trade_ids) {
                        async.eachSeries(trade_ids, function (thisTrade, nextTrade) {
                            augur.get_trade(thisTrade, function (tradeInfo) {
                                if (!tradeInfo) return nextTrade("no trade info found");
                                if (tradeInfo.owner === augur.from) return nextTrade();
                                if (tradeInfo.type === "buy") return nextTrade();
                                augur.rpc.personal("unlockAccount", [accounts[2], password]);
                                augur.trade({
                                    max_value: amount,
                                    max_amount: 0,
                                    trade_ids: [thisTrade],
                                    onTradeHash: function (r) {
                                        assert.notProperty(r, "error");
                                        assert.isString(r);
                                    },
                                    onCommitSent: function (r) {
                                        assert.strictEqual(r.callReturn, "1");
                                    },
                                    onCommitSuccess: function (r) {
                                        assert.strictEqual(r.callReturn, "1");
                                    },
                                    onCommitFailed: nextTrade,
                                    onTradeSent: function (r) {

                                    },
                                    onTradeSuccess: function (r) {
                                        console.log("trade success:", r)
                                        nextTrade(r);
                                    },
                                    onTradeFailed: nextTrade
                                });
                            });
                        }, function (x) {
                            if (x && x.callReturn) return done();
                            done(x);
                        });
                    });
                },
                onFailed: done
            });
        },
        onFailed: done
    });
}

function createMarket(done, augur) {
    var suffix = Math.random().toString(36).substring(4);
    var description = madlibs.adjective() + "-" + madlibs.noun() + "-" + suffix;
    augur.createSingleEventMarket({
        branchId: branch,
        description: description,
        expDate: new Date().getTime() / 1000,
        minValue: 1,
        maxValue: 2,
        numOutcomes: 2,
        tradingFee: "0.03",
        makerFees: "0.5",
        tags: ["what", "me", "worry?"],
        extraInfo: "what, me worry?",
        resolution: "augur.js test suite",
        onSent: function (r) {

        },
        onSuccess: function (r) {
            newMarketId = r.marketIDs;
        },
        onFailed: done
    });
}

describe("Unit tests", function () {

    describe("parse_block_message", function () {
        var test = function (msg) {
            it(JSON.stringify(msg), function (done) {
                augur.filters.parse_block_message(msg, function (parsed) {
                    console.log("parse_block_message:", parsed);
                    done();
                });
            });
        };
        test({
            difficulty: '0x46015d94',
            extraData: '0xd783010500844765746887676f312e352e31856c696e7578',
            gasLimit: '0x47e7c4',
            gasUsed: '0xa410',
            hash: '0x96a9e1fd64969355521cbfd125569d6bb0088f36685200db58b77ca7a7fbebd6',
            logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            miner: '0xdf712c685be75739eb44cb6665f92129e45864e4',
            nonce: '0x32894b6becfa3b8e',
            number: '0x11941a',
            parentHash: '0xeada45540e0e1505ac0b6759e429ce8dc24a65c6e4c9bc3346a0cd3f22297d1e',
            receiptRoot: '0x204590761a4d9f825ebf97f82f663979e78ce7caab303688bc6815e62b5f012b',
            sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
            size: '0x302',
            stateRoot: '0x381b58ccdb2a890a89b9f7e6110429acadb2884199962497a267ef3b054e3c52',
            timestamp: '0x576469fe',
            totalDifficulty: '0xf109f9a4e6f3',
            transactionsRoot: '0x4f90d1155e24c3e52f0c44c6e1b5eafa4395e196339749d0453600017627df4e',
            uncles: []
        });
        test({
            difficulty: '0x45c62a5a',
            extraData: '0xd783010500844765746887676f312e352e31856c696e7578',
            gasLimit: '0x47e7c4',
            gasUsed: '0x0',
            hash: '0xa4cd3abb9124548b39454f8a26d52edc1ba0df5e7ae026430b123829e58b31e9',
            logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            miner: '0xdf712c685be75739eb44cb6665f92129e45864e4',
            nonce: '0x179b12d04951c04b',
            number: '0x11961c',
            parentHash: '0x1272370c853752237b18561f6409f24a486ff1b842189d2e6c264b2c8b5de043',
            receiptRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
            sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
            size: '0x21b',
            stateRoot: '0x571ee6e9fc9845031a13ff885db64249405dec8fde94d6520488214f09722760',
            timestamp: '0x57648769',
            totalDifficulty: '0xf196b3653c38',
            transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
            uncles: []
        });
        test({
            difficulty: '0x456f3e0b',
            extraData: '0xd783010500844765746887676f312e352e31856c696e7578',
            gasLimit: '0x47e7c4',
            gasUsed: '0x493e0',
            hash: '0x6eb2ccd03087179bf53e32ef89db8ae1a7d4c407c691f31c467825e631a53c02',
            logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            miner: '0xdf712c685be75739eb44cb6665f92129e45864e4',
            nonce: '0xd3764129399cdce6',
            number: '0x119633',
            parentHash: '0x9b3dda703bc0de8a2162adb1666880f1dca6f421190616733c7b5a3e127ec7eb',
            receiptRoot: '0x197e4c93706b5c8d685a47909374a99b096948295abba0578aae46708a1e4435',
            sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
            size: '0x2b6',
            stateRoot: '0x385a5bdca25f1214fd9e244ac7146cf9dfc21f6a4dfe29819cdd069b2bfc63b8',
            timestamp: '0x57648910',
            totalDifficulty: '0xf19cf28ef992',
            transactionsRoot: '0x7c416eb59638d9a58ec5f526dd1b4326f37e50fa3968700e28d5f65f704e85fc',
            uncles: []
        });
    });
    describe("parse_contracts_message", function () {
        var test = function (msg) {
            it(JSON.stringify(msg), function (done) {
                augur.filters.parse_contracts_message(msg, function (parsed) {
                    console.log("parse_contracts_message:", parsed);
                    done();
                });
            });
        };
        test([{
            "address": "0x8d28df956673fa4a8bc30cd0b3cb657445bc820e",
            "blockHash": "0x949556543bbbefc3e440abe08606c8a1903c6d9c100c3e93bdd3f6bc4cdd9974",
            "blockNumber": "0x119406",
            "data": "0x0000000000000000000000007c0d52faab596c08f484e3478aebc6205f3f5d8c0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000851eb851eb851eb8000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000011f32619b74f9d54f77d94a7f86aef48d67421770774953d023f3c4f0e7bf2a8d",
            "logIndex": "0x0",
            "topics": [
              "0x8dbed7bffe37a9907a92186110f23d8104f5967a71fb059f3b907ca9001fd160",
              "0xebb0d4c04bc87d3b401a5baad3b093a5e7cc3f4e996dc53e36db78c8b374cc9a"
            ],
            "transactionHash": "0xd0f3c5d28308f55f00ad7456e4060ae638acd4927ca79165f620fa970d692201",
            "transactionIndex": "0x0"
        }]);
        test([{
            "address": "0x8d28df956673fa4a8bc30cd0b3cb657445bc820e",
            "blockHash": "0x0e2f477418a6cc65306a2559a611cafc22d50505b493a1e3674ad9c8076e15e2",
            "blockNumber": "0x11963b",
            "data": "0x0000000000000000000000007c0d52faab596c08f484e3478aebc6205f3f5d8c0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000df8a189bb07bf96c000000000000000000000000000000000000000000000149000000000000000000000000000000000000000000000000000000000000000000000000000000024eef144a1d15da2a6ad96e36147f3fee70e0ecc3a4f0cbb3932fbd7133809f09",
            "logIndex": "0x2",
            "topics": [
              "0x8dbed7bffe37a9907a92186110f23d8104f5967a71fb059f3b907ca9001fd160",
              "0x3b19a87dc13d7c9165f444bef3044543c132cbd979f062f2459ef3725633a3f4"
            ],
            "transactionHash": "0xe0384041bbc3b637fddc2835841b25d14f893e6cf9866032a13e5fd5068e4ab6",
            "transactionIndex": "0x2"
        }]);
        test([{
            "address": "0x8d28df956673fa4a8bc30cd0b3cb657445bc820e",
            "blockHash": "0x8c3fa0f2a092adf52702b8ebda332c12311f32a9d7dbeca3fd7ad3237a1b143a",
            "blockNumber": "0x11964c",
            "data": "0x000000000000000000000000ae1ba9370f9c3d64894ed9a101079fd17bf1044800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000001d7dd185ffffff8d00000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000002ccb7a4c7d0c9a0de5c08c459ce78642b23fdbd9df707781a9f4c24f9c1205bfd",
            "logIndex": "0x1",
            "topics": [
              "0x8dbed7bffe37a9907a92186110f23d8104f5967a71fb059f3b907ca9001fd160",
              "0xbbc704ce88ff685a56a6a8e708cec54f981d750d8fe83a53d8c4ffb2d4bf4ddd"
            ],
            "transactionHash": "0xa1796f1e7bd1290ba695908a2633a5164deb83c1431c5106c51fb186e79c257e",
            "transactionIndex": "0x3"
        }]);
        test([{
            address: '0x8d28df956673fa4a8bc30cd0b3cb657445bc820e',
            blockHash: '0x171e8b766a39d5922cdeb45f9f4b3ebfba60d98a4a0b5c1e2dd14fb223fcd595',
            blockNumber: '0x11966f',
            data: 
            [ '0x0000000000000000000000007c0d52faab596c08f484e3478aebc6205f3f5d8c',
             '0x0000000000000000000000000000000000000000000000008000000000000000',
             '0x0000000000000000000000000000000000000000000000010000000000000000',
             '0xc84e2b59c1a8cb678624e582d22e3ac0b4bbed6490900065143bf29b0563e1ee',
             '0x0000000000000000000000000000000000000000000000000000000000000001',
             '0x0000000000000000000000000000000000000000000000000000000000000002' ],
            logIndex: '0x0',
            topics: 
            [ '0x9ecf4903f3efaf1549dc51545bd945f94d51923f37ce198a3b838125a2f397d5',
             '0x467982cbbb0fbb3fc4499f4376aa15795f44a999f32369476f355196f52eeb68' ],
            transactionHash: '0xf5a45ffe66c9182545dd6c876d2727dded27ea41369ebee7d1b3c7469e70a99c',
            transactionIndex: '0x2'
        }]);
    });
    describe("parse_add_tx_message", function () {
        var test = function (msg) {
            it(JSON.stringify(msg), function (done) {
                augur.filters.parse_add_tx_message(msg, function (parsed) {
                    console.log("parse_add_tx_message:", parsed);
                    done();
                });
            });
        };
        test([{
            address: '0x8d28df956673fa4a8bc30cd0b3cb657445bc820e',
            blockHash: '0xf0bf95c2829ab839253a40cb9c048209f6ce296b92195d6d563dc632d1bc6408',
            blockNumber: '0x11940f',
            data: '0x0000000000000000000000007c0d52faab596c08f484e3478aebc6205f3f5d8c0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000851eb851eb851eb800000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000001ab0e4dde7838418cb19b273a86530e1a99121fc56311c5e69149f853fb96f11d',
            logIndex: '0x0',
            topics: [
                '0x8dbed7bffe37a9907a92186110f23d8104f5967a71fb059f3b907ca9001fd160',
                '0xebb0d4c04bc87d3b401a5baad3b093a5e7cc3f4e996dc53e36db78c8b374cc9a'
            ],
            transactionHash: '0x66556e5b7c3cb708ca6d807518eaf4ee3f5f0c3512262fae585fbb7d173d6593',
            transactionIndex: '0x0'
        }]);
        test([{
            address: '0x8d28df956673fa4a8bc30cd0b3cb657445bc820e',
            blockHash: '0xf36f8a64964ad218c140d4fe7f35e3ff102a2da044323a58b5eea84a2953a4fb',
            blockNumber: '0x11962d',
            data: '0x0000000000000000000000007c0d52faab596c08f484e3478aebc6205f3f5d8c0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000f018ac6a199998f600000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000000000000000000000002c5a915396f55abfa25862758001012dd5d0d73c0036c21b7244ee58499293dd3',
            logIndex: '0x0',
            topics: [
                '0x8dbed7bffe37a9907a92186110f23d8104f5967a71fb059f3b907ca9001fd160',
                '0x912461a845a572a1fff40a3013bfd639c53493d5b89099e0462ca26cc02be35e'
            ],
            transactionHash: '0xe0932645a38d2bbba352d12ecdfa17abc30131da3f04c53db9ae4030ffc8374c',
            transactionIndex: '0x1'
        }]);
        test([{
            address: '0x8d28df956673fa4a8bc30cd0b3cb657445bc820e',
            blockHash: '0x0e2f477418a6cc65306a2559a611cafc22d50505b493a1e3674ad9c8076e15e2',
            blockNumber: '0x11963b',
            data: '0x0000000000000000000000007c0d52faab596c08f484e3478aebc6205f3f5d8c0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000a3778633199999bd0000000000000000000000000000000000000000000000d70000000000000000000000000000000000000000000000000000000000000000000000000000000233647cb4e21faa8ce19ca0ddb3d0bdaa59dfe2643707f25656a1a8e67890f506',
            logIndex: '0x0',
            topics: [
                '0x8dbed7bffe37a9907a92186110f23d8104f5967a71fb059f3b907ca9001fd160',
                '0x3b19a87dc13d7c9165f444bef3044543c132cbd979f062f2459ef3725633a3f4'
            ],
            transactionHash: '0x409156212bd92eec4273032b5b9c2d6ae8d73eb9169df2b181b78d8a463465a4',
            transactionIndex: '0x0'
        }]);
        test([{
            address: '0x8d28df956673fa4a8bc30cd0b3cb657445bc820e',
            blockHash: '0x0e2f477418a6cc65306a2559a611cafc22d50505b493a1e3674ad9c8076e15e2',
            blockNumber: '0x11963b',
            data: '0x0000000000000000000000007c0d52faab596c08f484e3478aebc6205f3f5d8c0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000c180cf67650ac995000000000000000000000000000000000000000000000149000000000000000000000000000000000000000000000000000000000000000000000000000000027b95951c2366ae4d1155214a01a9000cb018c9b69cf23343d4c292feb9126514',
            logIndex: '0x1',
            topics: [
                '0x8dbed7bffe37a9907a92186110f23d8104f5967a71fb059f3b907ca9001fd160',
                '0x3b19a87dc13d7c9165f444bef3044543c132cbd979f062f2459ef3725633a3f4'
            ],
            transactionHash: '0x77033aaa1f445b556265d1f9c13265e433121d76adbd5860143f3f0db3e258f6',
            transactionIndex: '0x1'
        }]);
        test([{
            address: '0x8d28df956673fa4a8bc30cd0b3cb657445bc820e',
            blockHash: '0x0e2f477418a6cc65306a2559a611cafc22d50505b493a1e3674ad9c8076e15e2',
            blockNumber: '0x11963b',
            data: '0x0000000000000000000000007c0d52faab596c08f484e3478aebc6205f3f5d8c0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000df8a189bb07bf96c000000000000000000000000000000000000000000000149000000000000000000000000000000000000000000000000000000000000000000000000000000024eef144a1d15da2a6ad96e36147f3fee70e0ecc3a4f0cbb3932fbd7133809f09',
            logIndex: '0x2',
            topics: [
                '0x8dbed7bffe37a9907a92186110f23d8104f5967a71fb059f3b907ca9001fd160',
                '0x3b19a87dc13d7c9165f444bef3044543c132cbd979f062f2459ef3725633a3f4'
            ],
            transactionHash: '0xe0384041bbc3b637fddc2835841b25d14f893e6cf9866032a13e5fd5068e4ab6',
            transactionIndex: '0x2'
        }]);
        test([{
            address: '0x8d28df956673fa4a8bc30cd0b3cb657445bc820e',
            blockHash: '0x8c3fa0f2a092adf52702b8ebda332c12311f32a9d7dbeca3fd7ad3237a1b143a',
            blockNumber: '0x11964c',
            data: '0x000000000000000000000000ae1ba9370f9c3d64894ed9a101079fd17bf1044800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000001d7dd185ffffff8d00000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000002ccb7a4c7d0c9a0de5c08c459ce78642b23fdbd9df707781a9f4c24f9c1205bfd',
            logIndex: '0x1',
            topics: [
                '0x8dbed7bffe37a9907a92186110f23d8104f5967a71fb059f3b907ca9001fd160',
                '0xbbc704ce88ff685a56a6a8e708cec54f981d750d8fe83a53d8c4ffb2d4bf4ddd'
            ],
            transactionHash: '0xa1796f1e7bd1290ba695908a2633a5164deb83c1431c5106c51fb186e79c257e',
            transactionIndex: '0x3'
        }]);
    });
    describe("parse_cancel_message", function () {
        var test = function (msg) {
            it(JSON.stringify(msg), function (done) {
                augur.filters.parse_cancel_message(msg, function (parsed) {
                    console.log("parse_cancel_message:", parsed);
                    done();
                });
            });
        };
        test([{
            address: '0x8d28df956673fa4a8bc30cd0b3cb657445bc820e',
            blockHash: '0x171e8b766a39d5922cdeb45f9f4b3ebfba60d98a4a0b5c1e2dd14fb223fcd595',
            blockNumber: '0x11966f',
            data: '0x0000000000000000000000007c0d52faab596c08f484e3478aebc6205f3f5d8c00000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000010000000000000000c84e2b59c1a8cb678624e582d22e3ac0b4bbed6490900065143bf29b0563e1ee00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002',
            logIndex: '0x0',
            topics: [
                '0x9ecf4903f3efaf1549dc51545bd945f94d51923f37ce198a3b838125a2f397d5',
                '0x467982cbbb0fbb3fc4499f4376aa15795f44a999f32369476f355196f52eeb68'
            ],
            transactionHash: '0xf5a45ffe66c9182545dd6c876d2727dded27ea41369ebee7d1b3c7469e70a99c',
            transactionIndex: '0x2'
        }]);
    });
    describe("parse_price_message", function () {
        var test = function (msg) {
            it(JSON.stringify(msg), function (done) {
                augur.filters.parse_price_message(msg, function (parsed) {
                    console.log("parse_price_message:", parsed);
                    done();
                });
            });
        };
        test([{
            "address": "0x13cef2d86d4024f102e480627239359b5cb7bf52",
            "blockHash": "0x188e8deb5ef1da50cfc8ce60d26010b701a104f29f69c8e4e68a48393efce36a",
            "blockNumber": "0x119423",
            "data": "0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000ffbe76c8b439581000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000057646aa60000000000000000000000000000000000000000000000000000000000000001",
            "logIndex": "0x1",
            "topics": [
              "0xf448ecd2d0b1133184bb354020b9e90e2810dbc78102637d9a054ed06e8506d3",
              "0xebb0d4c04bc87d3b401a5baad3b093a5e7cc3f4e996dc53e36db78c8b374cc9a",
              "0x0000000000000000000000007c0d52faab596c08f484e3478aebc6205f3f5d8c"
            ],
            "transactionHash": "0xe724a6884599d52b5427c023e07adef902bdd0352b1e0aacfc2b09280425f1ef",
            "transactionIndex": "0x1"
        }]);
        test([{
            "address": "0x13cef2d86d4024f102e480627239359b5cb7bf52",
            "blockHash": "0xd6384b47e8af20217eb4c0fe8b622c42f8bd5e50cc63d0fa73e35df96bed2b4f",
            "blockNumber": "0x11964b",
            "data": "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000001d7dd185ffffff8d0000000000000000000000000000000000000000000000001d7dd185ffffff8d0000000000000000000000000000000000000000000000000000000057648a5b0000000000000000000000000000000000000000000000000000000000000002",
            "logIndex": "0x2",
            "topics": [
              "0xf448ecd2d0b1133184bb354020b9e90e2810dbc78102637d9a054ed06e8506d3",
              "0xbbc704ce88ff685a56a6a8e708cec54f981d750d8fe83a53d8c4ffb2d4bf4ddd",
              "0x000000000000000000000000ae1ba9370f9c3d64894ed9a101079fd17bf10448"
            ],
            "transactionHash": "0x6becec25bcb68824ad1904ed3424bdd056055413b96a4195b803c7a1b32b6c1e",
            "transactionIndex": "0x1"
        }]);
    });
    
    describe("parse_thru_message", function () {
        var test = function (msg) {
            it(JSON.stringify(msg), function (done) {
                augur.filters.parse_thru_message(msg, function (parsed) {
                    console.log("parse_thru_message:", parsed);
                    done();
                });
            });
        };
        // test();
    });
    describe("parse_penalize_message", function () {
        var test = function (msg) {
            it(JSON.stringify(msg), function (done) {
                augur.filters.parse_penalize_message(msg, function (parsed) {
                    console.log("parse_penalize_message:", parsed);
                    done();
                });
            });
        };
        // test();
    });
    describe("parse_marketCreated_message", function () {
        var test = function (msg) {
            it(JSON.stringify(msg), function (done) {
                augur.filters.parse_marketCreated_message(msg, function (parsed) {
                    console.log("parse_marketCreated_message:", parsed);
                    done();
                });
            });
        };
        test([{
            "address": "0x660cdfdf3d0e7443e7935343a1131b961575ccc7",
            "blockHash": "0xcf5d85980bfaf9734abac4420ff6917e39e840e9cb6251a9b640b5450f33405f",
            "blockNumber": "0x119635",
            "data": "0x3b19a87dc13d7c9165f444bef3044543c132cbd979f062f2459ef3725633a3f4",
            "logIndex": "0x0",
            "topics": [
              "0x63f140d7adcc464732c9379020aa9e5ce1b1e350796814d780ea3ca41d62a36b"
            ],
            "transactionHash": "0xb3a253b63bc7ea4e69699fbfa5d637c3a08acc9747eabd394caa4c9ebd5d254e",
            "transactionIndex": "0x0"
        }]);
    });
    describe("parse_tradingFeeUpdated_message", function () {
        var test = function (msg) {
            it(JSON.stringify(msg), function (done) {
                augur.filters.parse_tradingFeeUpdated_message(msg, function (parsed) {
                    console.log("parse_tradingFeeUpdated_message:", parsed);
                    done();
                });
            });
        };
        // test();
    });
    describe("parse_approval_message", function () {
        var test = function (msg) {
            it(JSON.stringify(msg), function (done) {
                augur.filters.parse_approval_message(msg, function (parsed) {
                    console.log("parse_approval_message:", parsed);
                    done();
                });
            });
        };
        // test();
    });
    describe("parse_transfer_message", function () {
        var test = function (msg) {
            it(JSON.stringify(msg), function (done) {
                augur.filters.parse_transfer_message(msg, function (parsed) {
                    console.log("parse_transfer_message:", parsed);
                    done();
                });
            });
        };
        // test();
    });
    describe("parse_fill_tx_message", function () {
        var test = function (msg) {
            it(JSON.stringify(msg), function (done) {
                augur.filters.parse_fill_tx_message(msg, function (parsed) {
                    console.log("parse_fill_tx_message:", parsed);
                    done();
                });
            });
        };
        test([{
            address: '0x13cef2d86d4024f102e480627239359b5cb7bf52',
            blockHash: '0x8171815b23ee1e0cf62e331f283c6d977689a93e3574b2ca35f75c19804914ef',
            blockNumber: '0x11941e',
            data: '0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000028f5c28f5c28f5c0000000000000000000000000000000000000000000000010000000000000000dd122c8309edd6025b07038ed4225c5c906ff0a7694814da88abf978e22af13b0000000000000000000000000000000000000000000000000000000000000001',
            logIndex: '0x0',
            topics: [
                '0x715b9a9cb6dfb4fa9cb1ebc2eba40d2a7bd66aa8cef75f87a77d1ff05d29a3b6',
                '0xebb0d4c04bc87d3b401a5baad3b093a5e7cc3f4e996dc53e36db78c8b374cc9a',
                '0x0000000000000000000000007c0d52faab596c08f484e3478aebc6205f3f5d8c',
                '0x00000000000000000000000015f6400a88fb320822b689607d425272bea2175f'
            ],
            transactionHash: '0xf9d3dd428f4d27c6ee14c6a08d877f777bc0365d29fad06ddc0f9dce11dbb9ce',
            transactionIndex: '0x0'
        }]);
        test([{
            address: '0x13cef2d86d4024f102e480627239359b5cb7bf52',
            blockHash: '0x0a383bf904a7156d840dbf7ebd0b30ff79dce4950dfa4b5b80bdb619070085d1',
            blockNumber: '0x11964b',
            data: '0x00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000001d7dd185ffffff8d0000000000000000000000000000000000000000000000001d7dd185ffffff8d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002',
            logIndex: '0x1',
            topics: 
             [ '0x715b9a9cb6dfb4fa9cb1ebc2eba40d2a7bd66aa8cef75f87a77d1ff05d29a3b6',
               '0xbbc704ce88ff685a56a6a8e708cec54f981d750d8fe83a53d8c4ffb2d4bf4ddd',
               '0x000000000000000000000000ae1ba9370f9c3d64894ed9a101079fd17bf10448',
               '0x000000000000000000000000dfb3458ad28f9ce1a6405e8c85daa8c8bdefb24b' ],
            transactionHash: '0x6becec25bcb68824ad1904ed3424bdd056055413b96a4195b803c7a1b32b6c1e',
            transactionIndex: '0x2'
        }]);
    });

    describe("poll_filter", function () {
        var test = function (t) {
            it(JSON.stringify(t), function () {

            });
        };
        // test();
    });

    describe("clear_filter", function () {
        var test = function (t) {
            it(JSON.stringify(t), function () {

            });
        };
        // test();
    });

    describe("setup_event_filter", function () {
        var test = function (t) {
            it(JSON.stringify(t), function () {

            });
        };
        // test();
    });
    describe("setup_contracts_filter", function () {
        var test = function (t) {
            it(JSON.stringify(t), function () {

            });
        };
        // test();
    });
    describe("setup_block_filter", function () {
        var test = function (t) {
            it(JSON.stringify(t), function () {

            });
        };
        test();
    });

    describe("start_event_listener", function () {
        var test = function (t) {
            it(JSON.stringify(t), function () {

            });
        };
        // test();
    });
    describe("start_contracts_listener", function () {
        var test = function (t) {
            it(JSON.stringify(t), function () {

            });
        };
        // test();
    });
    describe("start_block_listener", function () {
        var test = function (t) {
            it(JSON.stringify(t), function () {

            });
        };
        // test();
    });

    describe("pacemaker", function () {
        var test = function (t) {
            it(JSON.stringify(t), function () {

            });
        };
        // test();
    });

    describe("listen", function () {
        var test = function (t) {
            it(JSON.stringify(t), function () {

            });
        };
        // test();
    });

    describe("all_filters_removed", function () {
        var test = function (t) {
            it(JSON.stringify(t), function () {

            });
        };
        // test();
    });

    describe("ignore", function () {
        var test = function (t) {
            it(JSON.stringify(t), function () {

            });
        };
        // test();
    });
});

if (process.env.AUGURJS_INTEGRATION_TESTS) {
    describe("Integration tests", function () {
        describe("Price history", function () {
            before("Trade in market " + marketId, function (done) {
                this.timeout(tools.TIMEOUT*4);
                trade(done, augur);
            });

            it("[async] getMarketPriceHistory(" + marketId + ")", function (done) {
                this.timeout(tools.TIMEOUT);
                var start = (new Date()).getTime();
                augur.getMarketPriceHistory(marketId, function (priceHistory) {
                    console.log("[async] getMarketPriceHistory:", ((new Date()).getTime() - start) / 1000, "seconds");
                    console.log("priceHistory:", priceHistory);
                    assert.isObject(priceHistory);
                    for (var k in priceHistory) {
                        if (!priceHistory.hasOwnProperty(k)) continue;
                        var logs = priceHistory[k];
                        assert.isArray(logs);
                        if (k === outcome && process.env.AUGURJS_INTEGRATION_TESTS) {
                            assert.property(logs, "length");
                            assert.isAbove(logs.length, 0);
                            assert.property(logs[0], "price");
                            assert.property(logs[0], "blockNumber");
                            assert.property(logs[0], "market");
                            assert.isAbove(logs[0].market.length, 64);
                        }
                    }
                    done();
                });
            });

            it("[sync] getMarketPriceHistory(" + marketId + ")", function () {
                this.timeout(tools.TIMEOUT);
                var start = (new Date()).getTime();
                var priceHistory = augur.getMarketPriceHistory(marketId);
                console.log("[sync] getMarketPriceHistory:", ((new Date()).getTime() - start) / 1000, "seconds");
                assert.isObject(priceHistory);
                for (var k in priceHistory) {
                    if (!priceHistory.hasOwnProperty(k)) continue;
                    var logs = priceHistory[k];
                    assert.isArray(logs);
                    if (k === outcome && process.env.AUGURJS_INTEGRATION_TESTS) {
                        assert.property(logs, "length");
                        assert.isAbove(logs.length, 0);
                        assert.property(logs[0], "price");
                        assert.property(logs[0], "blockNumber");
                        assert.property(logs[0], "market");
                        assert.isAbove(logs[0].market.length, 64);
                    }
                }
            });
        });

        describe("Account trade list", function () {
            var account = augur.coinbase;
            it("getAccountTrades(" + account + ")", function (done) {
                this.timeout(tools.TIMEOUT);
                augur.getAccountTrades(account, function (trades) {
                    for (var marketId in trades) {
                        if (!trades.hasOwnProperty(marketId)) continue;
                        for (var outcomeId in trades[marketId]) {
                            if (!trades[marketId].hasOwnProperty(outcomeId)) continue;
                            assert.isArray(trades[marketId][outcomeId]);
                            for (var i = 0; i < trades[marketId][outcomeId].length; ++i) {
                                assert.property(trades[marketId][outcomeId][i], "price");
                                assert.property(trades[marketId][outcomeId][i], "blockNumber");
                                assert.property(trades[marketId][outcomeId][i], "market");
                                assert.property(trades[marketId][outcomeId][i], "amount");
                                assert.isAbove(trades[marketId][outcomeId][i].market.length, 64);
                                assert.isAbove(trades[marketId][outcomeId][i].blockNumber, 0);
                            }
                        }
                    }
                    done();
                });
            });

            it("meanTradePrice", function () {
                this.timeout(tools.TIMEOUT);
                var trades = {
                  "0x29701b0b0e6f5ca52a67a4768fc00dbb8be71adbc8cb46227730d38b716a47c4": {
                    "1": [
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.82045824954424709328",
                        "amount": "1.00033646597655826437",
                        "blockNumber": 644977
                      },
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.81993897859964738704",
                        "amount": "-1.01492725834409269876",
                        "blockNumber": 644979
                      },
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.82518241364421609455",
                        "amount": "1.00321833667456551254",
                        "blockNumber": 644983
                      },
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.83052169849481654283",
                        "amount": "1.00325336239990454703",
                        "blockNumber": 644986
                      },
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.82784170897281763885",
                        "amount": "-1.01361019283052997848",
                        "blockNumber": 644989
                      },
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.83321923360457458493",
                        "amount": "1.00326476873164053795",
                        "blockNumber": 644991
                      },
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.83865486635747354266",
                        "amount": "1.00327623427627250928",
                        "blockNumber": 644993
                      },
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.84412555914513416264",
                        "amount": "1.00327376484288607731",
                        "blockNumber": 644997
                      },
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.84961008802936918184",
                        "amount": "1.00325880660532661712",
                        "blockNumber": 644999
                      },
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.8550891039941987265",
                        "amount": "1.00323278795722464969",
                        "blockNumber": 645008
                      }
                    ],
                    "2": [
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.82104052498215984637",
                        "amount": "1.00066160366174530544",
                        "blockNumber": 644731
                      }
                    ]
                  },
                  "0x5301a04389ab011f4778c1d24b9b0a3e765e056191f15a0a05bb4095f77cd086": {
                    "2": [
                      {
                        "market": "-0xacfe5fbc7654fee0b8873e2db464f5c189a1fa9e6e0ea5f5fa44bf6a08832f7a",
                        "price": "0.99828751399118974795",
                        "amount": "1.11816215039897339423",
                        "blockNumber": 644960
                      },
                      {
                        "market": "-0xacfe5fbc7654fee0b8873e2db464f5c189a1fa9e6e0ea5f5fa44bf6a08832f7a",
                        "price": "0.5553283405211204048",
                        "amount": "-0.63470644776311777503",
                        "blockNumber": 644962
                      }
                    ]
                  },
                  "0xbfe7647c995a8717f80ec7ef7721ef44b99fafa00c826305b4172d5b14c638b6": {
                    "3": [
                      {
                        "market": "-0x40189b8366a578e807f1381088de10bb4660505ff37d9cfa4be8d2a4eb39c74a",
                        "price": "0.90344548683303604712",
                        "amount": "1.37277010248498623241",
                        "blockNumber": 644964
                      },
                      {
                        "market": "-0x40189b8366a578e807f1381088de10bb4660505ff37d9cfa4be8d2a4eb39c74a",
                        "price": "0.36231443954838966209",
                        "amount": "-0.56176596848969141732",
                        "blockNumber": 644966
                      }
                    ]
                  },
                  "0x287af51fd19e97db3055d20419ed6cfc8ad1ce580242aa6093bb9913ea6b083a": {
                    "2": [
                      {
                        "market": "-0xd7850ae02e616824cfaa2dfbe6129303752e31a7fdbd559f6c4466ec1594f7c6",
                        "price": "1.00000000000000587377",
                        "amount": "1.00000000000000528987",
                        "blockNumber": 667651
                      },
                      {
                        "market": "-0xd7850ae02e616824cfaa2dfbe6129303752e31a7fdbd559f6c4466ec1594f7c6",
                        "price": "0.99999999999999613851",
                        "amount": "-1.0204081632653015863",
                        "blockNumber": 667653
                      }
                    ],
                    "3": [
                      {
                        "market": "-0xd7850ae02e616824cfaa2dfbe6129303752e31a7fdbd559f6c4466ec1594f7c6",
                        "price": "0.70463773817496133754",
                        "amount": "1.48830862006795100636",
                        "blockNumber": 644968
                      },
                      {
                        "market": "-0xd7850ae02e616824cfaa2dfbe6129303752e31a7fdbd559f6c4466ec1594f7c6",
                        "price": "0.27231145890661296715",
                        "amount": "-0.5869038243269707533",
                        "blockNumber": 644970
                      }
                    ]
                  },
                  "0x4ad2142863a455113af108057a1608480359221345c77ef4f8f55b44710f96ae": {
                    "2": [
                      {
                        "market": "-0xb52debd79c5baaeec50ef7fa85e9f7b7fca6ddecba38810b070aa4bb8ef06952",
                        "price": "0.18117645173059083834",
                        "amount": "1.18730067747118666215",
                        "blockNumber": 667655
                      },
                      {
                        "market": "-0xb52debd79c5baaeec50ef7fa85e9f7b7fca6ddecba38810b070aa4bb8ef06952",
                        "price": "0.12983029337645998584",
                        "amount": "-0.85940882610217979164",
                        "blockNumber": 667658
                      }
                    ],
                    "4": [
                      {
                        "market": "-0xb52debd79c5baaeec50ef7fa85e9f7b7fca6ddecba38810b070aa4bb8ef06952",
                        "price": "0.18117645173059083834",
                        "amount": "1.18730067747118666215",
                        "blockNumber": 644973
                      },
                      {
                        "market": "-0xb52debd79c5baaeec50ef7fa85e9f7b7fca6ddecba38810b070aa4bb8ef06952",
                        "price": "0.12983029337645998584",
                        "amount": "-0.85940882610217979164",
                        "blockNumber": 644975
                      }
                    ]
                  },
                  "0xf802fa843af371d221445c30a2054abc6eea5a0d2acb9036b63b44b49b414b83": {
                    "2": [
                      {
                        "market": "-0x7fd057bc50c8e2ddebba3cf5dfab5439115a5f2d5346fc949c4bb4b64beb47d",
                        "price": "0.57248695603157573591",
                        "amount": "1.06290160506661108074",
                        "blockNumber": 659046
                      }
                    ]
                  },
                  "0x2b131e449fb911834913ca4299f2bb62acb188014e5ae3c6ea3acba001c80875": {
                    "2": [
                      {
                        "market": "-0xd4ece1bb6046ee7cb6ec35bd660d449d534e77feb1a51c3915c5345ffe37f78b",
                        "price": "0.34262501842840975465",
                        "amount": "1.03104995111143660311",
                        "blockNumber": 667646
                      },
                      {
                        "market": "-0xd4ece1bb6046ee7cb6ec35bd660d449d534e77feb1a51c3915c5345ffe37f78b",
                        "price": "0.32329006699866180002",
                        "amount": "-0.99272033845955606048",
                        "blockNumber": 667648
                      }
                    ]
                  },
                  "0xe0e2437401aad23f5749a824da1687e01f3684a865af029486b477374717d07e": {
                    "1": [
                      {
                        "market": "-0x1f1dbc8bfe552dc0a8b657db25e9781fe0c97b579a50fd6b794b88c8b8e82f82",
                        "price": "5.98466764900056586492",
                        "amount": "1.00059023342246584995",
                        "blockNumber": 769430
                      },
                      {
                        "market": "-0x1f1dbc8bfe552dc0a8b657db25e9781fe0c97b579a50fd6b794b88c8b8e82f82",
                        "price": "5.9873591204774185958",
                        "amount": "1.00027789495418851169",
                        "blockNumber": 769531
                      },
                      {
                        "market": "-0x1f1dbc8bfe552dc0a8b657db25e9781fe0c97b579a50fd6b794b88c8b8e82f82",
                        "price": "5.98902834507923924161",
                        "amount": "1.000123148368266603",
                        "blockNumber": 769609
                      },
                      {
                        "market": "-0x1f1dbc8bfe552dc0a8b657db25e9781fe0c97b579a50fd6b794b88c8b8e82f82",
                        "price": "5.98988779997774854237",
                        "amount": "1.00006510096019420768",
                        "blockNumber": 769620
                      },
                      {
                        "market": "-0x1f1dbc8bfe552dc0a8b657db25e9781fe0c97b579a50fd6b794b88c8b8e82f82",
                        "price": "5.99038766400426114182",
                        "amount": "1.0000385268331504762",
                        "blockNumber": 769717
                      },
                      {
                        "market": "-0x1f1dbc8bfe552dc0a8b657db25e9781fe0c97b579a50fd6b794b88c8b8e82f82",
                        "price": "5.99065978895162333084",
                        "amount": "1.00002150807361564492",
                        "blockNumber": 769726
                      },
                      {
                        "market": "-0x1f1dbc8bfe552dc0a8b657db25e9781fe0c97b579a50fd6b794b88c8b8e82f82",
                        "price": "5.99085393522999034785",
                        "amount": "1.00001544610078180791",
                        "blockNumber": 769732
                      }
                    ],
                    "2": [
                      {
                        "market": "-0x1f1dbc8bfe552dc0a8b657db25e9781fe0c97b579a50fd6b794b88c8b8e82f82",
                        "price": "5.96578704547290622831",
                        "amount": "1.0001876876599125205",
                        "blockNumber": 769490
                      },
                      {
                        "market": "-0x1f1dbc8bfe552dc0a8b657db25e9781fe0c97b579a50fd6b794b88c8b8e82f82",
                        "price": "5.96595355779457257178",
                        "amount": "1.00002257663456226473",
                        "blockNumber": 769528
                      }
                    ]
                  }
                };
                var meanBuyPrice, meanSellPrice;
                for (var marketId in trades) {
                    if (!trades.hasOwnProperty(marketId)) continue;
                    meanBuyPrice = augur.meanTradePrice(trades[marketId]);
                    meanSellPrice = augur.meanTradePrice(trades[marketId], true);
                    for (var outcomeId in meanBuyPrice) {
                        if (!meanBuyPrice.hasOwnProperty(outcomeId)) continue;
                        assert.isAbove(abi.number(meanBuyPrice[outcomeId]), 0);
                    }
                    for (var outcomeId in meanSellPrice) {
                        if (!meanSellPrice.hasOwnProperty(outcomeId)) continue;
                        assert.isAbove(abi.number(meanSellPrice[outcomeId]), 0);
                    }
                }
            });

            it("getAccountMeanTradePrices(" + account + ")", function (done) {
                this.timeout(tools.TIMEOUT);
                augur.getAccountMeanTradePrices(account, function (meanPrices) {
                    for (var bs in meanPrices) {
                        if (!meanPrices.hasOwnProperty(bs)) continue;
                        for (var marketId in meanPrices[bs]) {
                            if (!meanPrices[bs].hasOwnProperty(marketId)) continue;
                            for (var outcomeId in meanPrices[bs][marketId]) {
                                if (!meanPrices[bs][marketId].hasOwnProperty(outcomeId)) continue;
                                assert.isAbove(abi.number(meanPrices[bs][marketId][outcomeId]), 0);
                            }
                        }
                    }
                    done();
                });
            });
        });

        describe("listen/ignore", function () {

            it("block filter", function (done) {
                this.timeout(tools.TIMEOUT);
                var augur = tools.setup(require(augurpath), process.argv.slice(2));
                augur.filters.listen({
                    block: function (blockHash) {
                        // example:
                        // 0x999553c632fa10f3eb2af9a2be9ab612726372721680e3f76441f75f7c879a2f
                        assert.strictEqual(blockHash.slice(0, 2), "0x");
                        assert.strictEqual(blockHash.length, 66);
                        assert.isNull(augur.filters.filter.contracts.heartbeat);
                        assert.isNull(augur.filters.filter.price.heartbeat);
                        if (!augur.rpc.wsUrl && !augur.rpc.ipcpath) {
                            assert.isNotNull(augur.filters.filter.block.heartbeat);
                        }
                        assert.isNull(augur.filters.filter.contracts.id);
                        assert.isNull(augur.filters.filter.price.id);
                        assert.isNotNull(augur.filters.filter.block.id);

                        // stop heartbeat and tear down filters
                        augur.filters.ignore(true, {
                            block: function () {
                                assert.isNull(augur.filters.filter.contracts.heartbeat);
                                assert.isNull(augur.filters.filter.price.heartbeat);
                                assert.isNull(augur.filters.filter.block.heartbeat);
                                assert.isNull(augur.filters.filter.contracts.id);
                                assert.isNull(augur.filters.filter.price.id);
                                assert.isNull(augur.filters.filter.block.id);
                                done();
                            }
                        });
                    }
                });
            });

            it("contracts filter", function (done) {
                this.timeout(tools.TIMEOUT);
                var augur = tools.setup(require(augurpath), process.argv.slice(2));
                augur.filters.listen({
                    contracts: function (tx) {
                        assert.property(tx, "address");
                        assert.property(tx, "topics");
                        assert.property(tx, "data");
                        assert.property(tx, "blockNumber");
                        assert.property(tx, "logIndex");
                        assert.property(tx, "blockHash");
                        assert.property(tx, "transactionHash");
                        assert.property(tx, "transactionIndex");
                        assert.isArray(tx.topics);
                        assert.isArray(tx.data);
                        assert.isAbove(parseInt(tx.blockNumber), 0);
                        assert.isAbove(parseInt(augur.filters.filter.contracts.id), 0);

                        // stop heartbeat
                        augur.filters.ignore({
                            contracts: function () {
                                assert.isNull(augur.filters.filter.contracts.heartbeat);
                                assert.isNull(augur.filters.filter.price.heartbeat);
                                assert.isNull(augur.filters.filter.block.heartbeat);
                                assert.isNotNull(augur.filters.filter.contracts.id);
                                assert.isNull(augur.filters.filter.price.id);
                                assert.isNull(augur.filters.filter.block.id);

                                // tear down filters
                                augur.filters.ignore(true, {
                                    contracts: function () {
                                        assert.isNull(augur.filters.filter.contracts.heartbeat);
                                        assert.isNull(augur.filters.filter.price.heartbeat);
                                        assert.isNull(augur.filters.filter.block.heartbeat);
                                        assert.isNull(augur.filters.filter.contracts.id);
                                        assert.isNull(augur.filters.filter.price.id);
                                        assert.isNull(augur.filters.filter.block.id);
                                        done();
                                    }
                                });
                            }
                        });
                    }
                });
                setTimeout(function () { trade(done, augur); }, DELAY);
            });

            it("price filter", function (done) {
                this.timeout(tools.TIMEOUT);
                var augur = tools.setup(require(augurpath), process.argv.slice(2));
                augur.filters.listen({
                    price: function (update) {
                        assert.property(update, "marketId");
                        assert.property(update, "outcome");
                        assert.property(update, "price");
                        assert.property(update, "blockNumber");
                        assert.isAbove(parseInt(update.blockNumber), 0);
                        assert.strictEqual(update.outcome, outcome);
                        assert(abi.bignum(update.trader).eq(abi.bignum(augur.coinbase)));
                        assert.isAbove(parseInt(augur.filters.filter.price.id), 0);
                        assert.isNull(augur.filters.filter.contracts.heartbeat);
                        if (!augur.rpc.wsUrl && !augur.rpc.ipcpath) {
                            assert.isNotNull(augur.filters.filter.price.heartbeat);
                        }
                        assert.isNull(augur.filters.filter.block.heartbeat);
                        assert.isNull(augur.filters.filter.contracts.id);
                        assert.isNotNull(augur.filters.filter.price.id);
                        assert.isNull(augur.filters.filter.block.id);

                        // stop heartbeat and tear down filters
                        augur.filters.ignore(true, {
                            price: function () {
                                assert.isNull(augur.filters.filter.contracts.heartbeat);
                                assert.isNull(augur.filters.filter.price.heartbeat);
                                assert.isNull(augur.filters.filter.block.heartbeat);
                                assert.isNull(augur.filters.filter.contracts.id);
                                assert.isNull(augur.filters.filter.price.id);
                                assert.isNull(augur.filters.filter.block.id);
                                done();
                            }
                        });
                    }
                });
                setTimeout(function () { trade(done, augur); }, DELAY);
            });

            it("combined", function (done) {
                this.timeout(tools.TIMEOUT*10);
                var augur = tools.setup(tools.reset(augurpath), process.argv.slice(2));
                var setup = {
                    block: null,
                    contracts: null,
                    price: null
                };
                var called_teardown = {
                    block: false,
                    contracts: false,
                    price: false
                };

                // stop heartbeat and tear down filters
                function teardown(setup, done) {
                    if (setup.price && setup.contracts && setup.block) {
                        var mutex = locks.createMutex();
                        mutex.lock(function () {
                            augur.filters.ignore(true, {
                                block: function () {
                                    assert.isNull(augur.filters.filter.block.heartbeat);
                                    assert.isNull(augur.filters.filter.block.id);
                                },
                                contracts: function () {
                                    assert.isNull(augur.filters.filter.contracts.heartbeat);
                                    assert.isNull(augur.filters.filter.contracts.id);
                                },
                                price: function () {
                                    assert.isNull(augur.filters.filter.price.heartbeat);
                                    assert.isNull(augur.filters.filter.price.id);
                                }
                            }, function (err) {
                                mutex.unlock();
                                if (err) return done(err);
                                done();
                            });
                        });
                    }
                }
                augur.filters.listen({
                    block: function (blockHash) {
                        assert.strictEqual(blockHash.slice(0, 2), "0x");
                        assert.strictEqual(blockHash.length, 66);
                        if (!augur.rpc.wsUrl && !augur.rpc.ipcpath) {
                            assert.isNotNull(augur.filters.filter.block.heartbeat);
                        }
                        assert.isNotNull(augur.filters.filter.block.id);
                        if (!setup.block) {
                            setup.block = true;
                            teardown(setup, done);
                        }
                    },
                    contracts: function (tx) {
                        assert.property(tx, "address");
                        assert.property(tx, "topics");
                        assert.property(tx, "data");
                        assert.property(tx, "blockNumber");
                        assert.property(tx, "logIndex");
                        assert.property(tx, "blockHash");
                        assert.property(tx, "transactionHash");
                        assert.property(tx, "transactionIndex");
                        assert.isAbove(parseInt(tx.blockNumber), 0);
                        assert.isAbove(parseInt(augur.filters.filter.contracts.id), 0);
                        if (!setup.contracts) {
                            setup.contracts = true;
                            teardown(setup, done);
                        }
                    },
                    price: function (update) {
                        assert.property(update, "marketId");
                        assert.property(update, "outcome");
                        assert.property(update, "price");
                        assert.property(update, "blockNumber");
                        assert.isAbove(parseInt(update.blockNumber), 0);
                        assert.strictEqual(update.outcome, outcome);
                        assert(abi.bignum(update.trader).eq(abi.bignum(augur.coinbase)));
                        assert.isAbove(parseInt(augur.filters.filter.price.id), 0);
                        if (!augur.rpc.wsUrl && !augur.rpc.ipcpath) {
                            assert.isNotNull(augur.filters.filter.price.heartbeat);
                        }
                        assert.isNotNull(augur.filters.filter.price.id);
                        if (!setup.price) {
                            setup.price = true;
                            teardown(setup, done);
                        }
                    }
                });
                setTimeout(function () { trade(done, augur); }, DELAY);
                setTimeout(function () { createMarket(done, augur); }, DELAY);
            });
        });
    });
}
