/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");

BigNumber.config({MODULO_MODE: BigNumber.EUCLID});

module.exports = {

    createSingleEventMarket: function (branchId, description, expDate, minValue, maxValue, numOutcomes, resolution, takerFee, tags, makerFee, extraInfo, onSent, onSuccess, onFailed) {
        var self = this;
        if (branchId.constructor === Object && branchId.branchId) {
            description = branchId.description;         // string
            expDate = branchId.expDate;
            minValue = branchId.minValue;               // integer (1 for binary)
            maxValue = branchId.maxValue;               // integer (2 for binary)
            numOutcomes = branchId.numOutcomes;         // integer (2 for binary)
            resolution = branchId.resolution;
            takerFee = branchId.takerFee;
            tags = branchId.tags;
            makerFee = branchId.makerFee;
            extraInfo = branchId.extraInfo;
            onSent = branchId.onSent;                   // function
            onSuccess = branchId.onSuccess;             // function
            onFailed = branchId.onFailed;               // function
            branchId = branchId.branchId;               // sha256 hash
        }
        onSent = onSent || utils.noop;
        onSuccess = onSuccess || utils.noop;
        onFailed = onFailed || utils.noop;
        if (!tags || tags.constructor !== Array) tags = [];
        if (tags.length) {
            for (var i = 0; i < tags.length; ++i) {
                if (tags[i] === null || tags[i] === undefined || tags[i] === "") {
                    tags[i] = "0x0";
                } else {
                    tags[i] = abi.short_string_to_int256(tags[i]);
                }
            }
        }
        while (tags.length < 3) {
            tags.push("0x0");
        }
        var bnMakerFee = abi.bignum(makerFee);
        var tradingFee = abi.bignum(takerFee).plus(bnMakerFee).dividedBy(new BigNumber("1.5"));
        var makerProportionOfFee = bnMakerFee.dividedBy(tradingFee);
        description = description.trim();
        expDate = parseInt(expDate);
        var tx = clone(this.tx.CreateMarket.createEvent);
        tx.params = [
            branchId,
            description,
            expDate,
            abi.fix(minValue, "hex"),
            abi.fix(maxValue, "hex"),
            numOutcomes,
            resolution
        ];
        this.transact(tx, utils.noop, function (res) {
            var tx = clone(self.tx.CreateMarket.createMarket);
            tx.params = [
                branchId,
                description,
                abi.fix(tradingFee, "hex"),
                res.callReturn,
                tags[0],
                tags[1],
                tags[2],
                abi.fix(makerProportionOfFee, "hex"),
                extraInfo || ""
            ];
            self.rpc.gasPrice(function (gasPrice) {
                tx.gasPrice = gasPrice;
                gasPrice = abi.bignum(gasPrice);
                tx.value = abi.prefix_hex((new BigNumber("1200000").times(gasPrice).plus(new BigNumber("500000").times(gasPrice))).toString(16));
                self.getPeriodLength(branchId, function (periodLength) {
                    self.transact(tx, onSent, function (res) {
                        self.rpc.getBlock(res.blockNumber, false, function (block) {
                            var futurePeriod = abi.prefix_hex(new BigNumber(expDate, 10).dividedBy(new BigNumber(periodLength)).floor().toString(16));
                            res.marketID = utils.sha3([
                                futurePeriod,
                                abi.fix(tradingFee, "hex"),
                                block.timestamp,
                                tags[0],
                                tags[1],
                                tags[2],
                                expDate,
                                new Buffer(description, "utf8").length,
                                description
                            ]);
                            res.callReturn = res.marketID;
                            onSuccess(res);
                        });
                    }, onFailed);
                });
                // self.getPeriodLength(branchId, function (periodLength) {
                //     self.transact(tx, onSent, function (res) {
                //         var tradingPeriod = abi.prefix_hex(new BigNumber(expDate).dividedBy(new BigNumber(periodLength)).floor().toString(16));
                //         self.rpc.getBlock(res.blockNumber, false, function (block) {
                //             res.marketID = utils.sha3([
                //                 tradingPeriod,
                //                 abi.fix(tradingFee, "hex"),
                //                 block.timestamp,
                //                 tags[0],
                //                 tags[1],
                //                 tags[2],
                //                 expDate,
                //                 new Buffer(description, "utf8").length,
                //                 description
                //             ]);
                //             res.callReturn = res.marketID;
                //             onSuccess(res);
                //         });
                //     }, onFailed);
                // });
            });
        }, onFailed);
        // var tx = clone(this.tx.CreateMarket.createSingleEventMarket);
        // tx.params = [
        //     branchId,
        //     description,
        //     expDate,
        //     abi.fix(minValue, "hex"),
        //     abi.fix(maxValue, "hex"),
        //     numOutcomes,
        //     resolution,
        //     abi.fix(tradingFee, "hex"),
        //     tags[0],
        //     tags[1],
        //     tags[2],
        //     abi.fix(makerProportionOfFee, "hex"),
        //     extraInfo || ""
        // ];
        // this.rpc.gasPrice(function (gasPrice) {
        //     tx.gasPrice = gasPrice;
        //     gasPrice = abi.bignum(gasPrice);
        //     tx.value = abi.prefix_hex((new BigNumber("1200000").times(gasPrice).plus(new BigNumber("500000").times(gasPrice))).toString(16));
        //     self.transact(tx, onSent, function (res) {
        //         self.getPeriodLength(branchId, function (periodLength) {
        //             self.rpc.getBlock(res.blockNumber, false, function (block) {
        //                 var tradingPeriod = abi.prefix_hex(new BigNumber(expDate).dividedBy(new BigNumber(periodLength)).floor().toString(16));
        //                 res.marketID = utils.sha3([
        //                     tradingPeriod,
        //                     abi.fix(tradingFee, "hex"),
        //                     block.timestamp,
        //                     tags[0],
        //                     tags[1],
        //                     tags[2],
        //                     expDate,
        //                     new Buffer(description, "utf8").length,
        //                     description
        //                 ]);
        //                 onSuccess(res);
        //             });
        //         });
        //     }, onFailed);
        // });
    },

    createEvent: function (branchId, description, expDate, minValue, maxValue, numOutcomes, resolution, onSent, onSuccess, onFailed) {
        if (branchId.constructor === Object && branchId.branchId) {
            description = branchId.description;         // string
            minValue = branchId.minValue;               // integer (1 for binary)
            maxValue = branchId.maxValue;               // integer (2 for binary)
            numOutcomes = branchId.numOutcomes;         // integer (2 for binary)
            expDate = branchId.expDate;
            resolution = branchId.resolution;
            onSent = branchId.onSent;                   // function
            onSuccess = branchId.onSuccess;             // function
            onFailed = branchId.onFailed;               // function
            branchId = branchId.branchId;               // sha256 hash
        }
        var tx = clone(this.tx.CreateMarket.createEvent);
        tx.params = [
            branchId,
            description.trim(),
            parseInt(expDate),
            abi.fix(minValue, "hex"),
            abi.fix(maxValue, "hex"),
            numOutcomes,
            resolution
        ];
        return this.transact(tx, onSent, onSuccess, onFailed);
    },

    createMarket: function (branchId, description, takerFee, events, tags, makerFee, extraInfo, onSent, onSuccess, onFailed) {
        var self = this;
        if (branchId.constructor === Object && branchId.branchId) {
            description = branchId.description; // string
            takerFee = branchId.takerFee;
            events = branchId.events;           // array [sha256, ...]
            tags = branchId.tags;
            makerFee = branchId.makerFee;
            extraInfo = branchId.extraInfo;
            onSent = branchId.onSent;           // function
            onSuccess = branchId.onSuccess;     // function
            onFailed = branchId.onFailed;       // function
            branchId = branchId.branchId;       // sha256 hash
        }
        onSent = onSent || utils.noop;
        onSuccess = onSuccess || utils.noop;
        onFailed = onFailed || utils.noop;
        if (!tags || tags.constructor !== Array) tags = [];
        if (tags.length) {
            for (var i = 0; i < tags.length; ++i) {
                if (tags[i] === null || tags[i] === undefined || tags[i] === "") {
                    tags[i] = "0x0";
                } else {
                    tags[i] = abi.short_string_to_int256(tags[i]);
                }
            }
        }
        while (tags.length < 3) {
            tags.push("0x0");
        }
        var bnMakerFee = abi.bignum(makerFee);
        var tradingFee = abi.bignum(takerFee).plus(bnMakerFee).dividedBy(new BigNumber("1.5"));
        var makerProportionOfFee = bnMakerFee.dividedBy(tradingFee);
        var tx = clone(this.tx.CreateMarket.createMarket);
        description = description.trim();
        tx.params = [
            branchId,
            description,
            abi.fix(tradingFee, "hex"),
            events,
            tags[0],
            tags[1],
            tags[2],
            abi.fix(makerProportionOfFee, "hex"),
            extraInfo || ""
        ];
        this.rpc.gasPrice(function (gasPrice) {
            tx.gasPrice = gasPrice;
            gasPrice = abi.bignum(gasPrice);
            tx.value = abi.prefix_hex((new BigNumber("1200000").times(gasPrice).plus(new BigNumber("1000000").times(gasPrice).times(new BigNumber(events.length - 1)).plus(new BigNumber("500000").times(gasPrice)))).toString(16));
            self.getPeriodLength(branchId, function (periodLength) {
                self.transact(tx, onSent, function (res) {
                    self.getExpiration(events, function (expDate) {
                        expDate = parseInt(expDate);
                        self.rpc.getBlock(res.blockNumber, false, function (block) {
                            var futurePeriod = abi.prefix_hex(new BigNumber(expDate, 10).dividedBy(new BigNumber(periodLength)).floor().toString(16));
                            res.marketID = utils.sha3([
                                futurePeriod,
                                abi.fix(tradingFee, "hex"),
                                block.timestamp,
                                tags[0],
                                tags[1],
                                tags[2],
                                expDate,
                                new Buffer(description, "utf8").length,
                                description
                            ]);
                            res.callReturn = res.marketID;
                            onSuccess(res);
                        });
                    });
                }, onFailed);
            });
        });
    },

    updateTradingFee: function (branch, market, tradingFee, onSent, onSuccess, onFailed) {
        var tx = clone(this.tx.CreateMarket.updateTradingFee);
        var unpacked = utils.unpack(branch, utils.labels(this.updateTradingFee), arguments);
        tx.params = unpacked.params;
        tx.params[2] = abi.fix(tx.params[2], "hex");
        return this.transact.apply(this, [tx].concat(unpacked.cb));
    }
};
