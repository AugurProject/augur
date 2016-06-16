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
                                        assert.isArray(r.callReturn);
                                        assert.strictEqual(r.callReturn[0], 1);
                                        assert.strictEqual(r.callReturn.length, 3);
                                    },
                                    onTradeSuccess: function (r) {
                                        console.log("trade success:", r)
                                        assert.isArray(r.callReturn);
                                        assert.strictEqual(r.callReturn[0], 1);
                                        assert.strictEqual(r.callReturn.length, 3);
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
            newMarketId = res.marketIDs;
        },
        onFailed: done
    });
}

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
                            assert.property(logs[0], "user");
                            assert.isAbove(logs[0].market.length, 64);
                            assert.strictEqual(logs[0].trader.length, 42);
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
                        assert.property(logs[0], "user");
                        assert.isAbove(logs[0].market.length, 64);
                        assert.strictEqual(logs[0].trader.length, 42);
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
                        assert.strictEqual(tx.address, augur.contracts.buyAndSellShares);
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
