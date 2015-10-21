/**
 * Filters / logging
 */

"use strict";

var async = require("async");
var chalk = require("chalk");
var abi = require("augur-abi");
var utils = require("./utilities");
var errors = require("./errors");
var constants = require("./constants");

module.exports = function () {

    var augur = this;

    return {

        PULSE: constants.SECONDS_PER_BLOCK * 500,

        price_filter: { id: null, heartbeat: null },

        contracts_filter: { id: null, heartbeat: null },

        block_filter: { id: null, heartbeat: null },

        creation_filter: { id: null, heartbeat: null },        

        eth_newFilter: function (params, f) {
            return augur.rpc.broadcast(augur.rpc.marshal("newFilter", params), f);
        },

        eth_newBlockFilter: function (f) {
            return augur.rpc.broadcast(augur.rpc.marshal("newBlockFilter"), f);
        },

        eth_newPendingTransactionFilter: function (f) {
            return augur.rpc.broadcast(augur.rpc.marshal("newPendingTransactionFilter"), f);
        },

        eth_getFilterChanges: function (filter, f) {
            return augur.rpc.broadcast(augur.rpc.marshal("getFilterChanges", filter), f);
        },

        eth_getFilterLogs: function (filter, f) {
            return augur.rpc.broadcast(augur.rpc.marshal("getFilterLogs", filter), f);
        },

        eth_getLogs: function (filter, f) {
            return augur.rpc.broadcast(augur.rpc.marshal("getLogs", filter), f);
        },

        eth_uninstallFilter: function (filter, f) {
            return augur.rpc.broadcast(augur.rpc.marshal("uninstallFilter", filter), f);
        },

        search_price_logs: function (logs, market_id, outcome_id) {
            // topics: [?, user, unadjusted marketid, outcome]
            // array data: [price, cost]
            if (!logs || !market_id || !outcome_id) return;
            var parsed, price_logs, market, marketplus;
            market_id = abi.bignum(market_id);
            outcome_id = abi.bignum(outcome_id);
            price_logs = [];
            for (var i = 0, len = logs.length; i < len; ++i) {
                if (logs[i] && logs[i].data !== undefined &&
                    logs[i].data !== null && logs[i].data !== "0x")
                {
                    parsed = augur.rpc.unmarshal(logs[i].data);
                    market = abi.bignum(logs[i].topics[2]);
                    marketplus = market.plus(abi.constants.MOD);
                    if (marketplus.lt(abi.constants.BYTES_32)) {
                        market = marketplus;
                    }
                    if (market.eq(market_id) &&
                        abi.bignum(logs[i].topics[3]).eq(outcome_id))
                    {
                        price_logs.push({
                            market: abi.hex(market_id),
                            user: abi.format_address(logs[i].topics[1]),
                            price: abi.unfix(parsed[0], "string"),
                            cost: abi.unfix(parsed[1], "string"),
                            blockNumber: abi.hex(logs[i].blockNumber)
                        });
                    }
                }
            }
            price_logs.reverse();
            return price_logs;
        },

        search_creation_logs: function (logs, market_id) {
            // topics: [?, user, unadjusted marketid, outcome]
            // array data: [price, cost]
            if (!logs || !market_id) return;
            var creation_logs, market, marketplus;
            creation_logs = [];
            market_id = abi.bignum(market_id);
            for (var i = 0, len = logs.length; i < len; ++i) {
                if (logs[i] && logs[i].topics && logs[i].topics.length > 1) {
                    market = abi.bignum(logs[i].topics[1]);
                    if (market.eq(market_id)) {
                        creation_logs.push({
                            blockNumber: abi.hex(logs[i].blockNumber)
                        });
                    }
                }
            }
            creation_logs.reverse();
            return creation_logs;
        },

        sift: function (filtrate, onMessage) {
            /**
             * filtrate example (array):
             * [{
             *   address: '0xc1c4e2f32e4b84a60b8b7983b6356af4269aab79',
             *   topics: [
             *      '0x1a653a04916ffd3d6f74d5966492bda358e560be296ecf5307c2e2c2fdedd35a',
             *      '0x00000000000000000000000005ae1d0ca6206c6168b42efcd1fbe0ed144e821b',
             *      '0x4fe60eb31b13f1c0afdb7735111513f27cbecf312170c6e68e3c7c1f8a1239f8',
             *      '0x0000000000000000000000000000000000000000000000000000000000000001'
             *   ],
             *   data: '0x000000000000000000000000000000000000000000000000ffffffffffffd570ffffffffffffffffffffffffffffffffffffffffffffffff00000000000002f7',
             *   blockNumber: '0x11db',
             *   logIndex: '0x0',
             *   blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
             *   transactionHash: '0x2d3dc5dea7fe6b14e034acb3b95d3d40bd45392dcd2e8030c2d15df3ddbd0594',
             *   transactionIndex: '0x0'
             * }, ...]
             */
            var messages = [];
            for (var i = 0, len = filtrate.length; i < len; ++i) {
                try {
                    if (filtrate[i]) {
                        if (filtrate[i].constructor === Object && filtrate[i].data) {
                            filtrate[i].data = augur.rpc.unmarshal(filtrate[i].data);
                        }
                        if (onMessage) onMessage(filtrate[i]);
                        messages.push(filtrate[i]);
                    }
                } catch (exc) {
                    console.error("contracts filter:", exc);
                    console.log(i, filtrate[i]);
                }
            }
            if (messages.length) return messages;
        },

        poll_contracts_listener: function (onMessage) {
            if (utils.is_function(onMessage)) {
                var self = this;
                this.eth_getFilterChanges(this.contracts_filter.id, function (filtrate) {
                    // example: [
                    //     "0xd92826bcb659b0b01c94930ca200d2abfddcaddce567d02f39ca48533db4086c",
                    //     "0x0591cdaa9178ed34d1f148f57ca463d7c50c93401329e7c501682a8f5b747f75",
                    //     "0xdbe9a517e5cc8464bbb845260c6a2cf38895013c3b306d8b8360a8570d7bfb28",
                    //     "0x41bdc70080b7c06fad9fff76b1224ef0a5f5fa9f96df0252a536ab2479ccddb4",
                    //     "0xb2b13a913991892f1dafe6aba3f575bef1695a5f313c4134b0cacb79b51e177f",
                    //     "0xa157d06679a1e564175242d088862d61bd851a057ba4f196db50c69de900655b",
                    //     "0xe14ebc4b6a25b49239672d9a426c1ded9bc5c7855ba665b0e4f62435e403ec93",
                    //     "0x1d6b342692927ad89224e14df71b179d59ff7bd1ab85789411dd8a1742e8b0c1",
                    //     "0xfa3b3d86e6f5650ecc1de4cb28981aa563616353a785591bdb82c3d7162e763e",
                    //     "0x7a6f4effa4bafb8cd5f3f4e0b32562e422dc8e187ffc64367a4ddf51a9452e11",
                    //     "0xd66431b7ac1714b93aac11a047a2e2dcd2ae2d8c08449e9ef3240a5c088fbaa6",
                    //     "0xb968d8781a39e6925180914ce1994210efc08b4eb9f7dcd118d0c91e6f2382e1",
                    //     "0xd68d71df25929468cd17ca67611e28a98920a693b9e96925787ba6f4e7684e24",
                    //     "0x74808c29ae08accce5c74b5d12cf6f2fe92d96cfd12c3eb08535f4e92bd97a02"
                    // ]
                    if (filtrate && filtrate.length && filtrate.constructor === Array) {
                        self.sift(filtrate, onMessage);
                    }
                });
            }
        },

        poll_block_listener: function (onMessage) {
            if (utils.is_function(onMessage)) {
                this.eth_getFilterChanges(this.block_filter.id, function (filtrate) {
                    if (filtrate && filtrate.length && filtrate.constructor === Array) {
                        for (var i = 0, len = filtrate.length; i < len; ++i) {
                            onMessage(filtrate[i]);
                        }
                    }
                });
            }
        },

        poll_price_listener: function (onMessage) {
            if (this.price_filter) {
                this.eth_getFilterChanges(this.price_filter.id, function (filtrate) {
                    // console.log("price filtrate:", filtrate);
                    var data_array, market, marketplus;
                    if (filtrate && filtrate.length) {
                        for (var i = 0, len = filtrate.length; i < len; ++i) {
                            if (filtrate[i] && filtrate[i].topics && filtrate[i].topics.length > 3) {
                                try {
                                    data_array = augur.rpc.unmarshal(filtrate[i].data);
                                    if (data_array && data_array.constructor === Array &&
                                        data_array.length > 1)
                                    {
                                        market = abi.bignum(filtrate[i].topics[2]);
                                        marketplus = market.plus(abi.constants.MOD);
                                        if (marketplus.lt(abi.constants.BYTES_32)) {
                                            market = marketplus;
                                        }
                                        onMessage({
                                            user: abi.format_address(filtrate[i].topics[1]),
                                            marketId: abi.hex(market),
                                            outcome: abi.string(filtrate[i].topics[3]),
                                            price: abi.unfix(data_array[0], "string"),
                                            cost: abi.unfix(data_array[1], "string"),
                                            blockNumber: abi.string(filtrate[i].blockNumber)
                                        });
                                    }
                                } catch (exc) {
                                    console.error("updatePrice filter:", exc);
                                    console.log(i, filtrate[i]);
                                }
                            }
                        }
                    }
                }); // eth_getFilterChanges
            }
        },

        poll_creation_listener: function (onMessage) {
            if (this.creation_filter) {
                this.eth_getFilterChanges(this.creation_filter.id, function (filtrate) {
                    // console.log("creation filtrate:", filtrate);
                    var market, marketplus;
                    if (filtrate && filtrate.length) {
                        for (var i = 0, len = filtrate.length; i < len; ++i) {
                            try {
                                if (filtrate[i] && filtrate[i].topics && filtrate[i].topics.length > 1) {
                                    market = abi.bignum(filtrate[i].topics[1]);
                                    marketplus = market.plus(abi.constants.MOD);
                                    if (marketplus.lt(abi.constants.BYTES_32)) {
                                        market = marketplus;
                                    }
                                    onMessage({
                                        marketId: abi.hex(market),
                                        blockNumber: abi.string(filtrate[i].blockNumber)
                                    });
                                }
                            } catch (exc) {
                                console.error("creationBlock filter:", exc);
                                console.log(i, filtrate[i]);
                            }
                        }
                    }
                }); // eth_getFilterChanges
            }
        },

        // clear/uninstall filters

        clear_price_filter: function (cb) {
            if (utils.is_function(cb)) {
                var self = this;
                this.eth_uninstallFilter(this.price_filter.id, function (uninst) {
                    if (uninst) self.price_filter.id = null;
                    cb(uninst);
                });
            } else {
                var uninst = this.eth_uninstallFilter(this.price_filter.id);
                if (uninst) this.price_filter.id = null;
                return uninst;
            }
        },

        clear_contracts_filter: function (cb) {
            if (utils.is_function(cb)) {
                var self = this;
                this.eth_uninstallFilter(this.contracts_filter.id, function (uninst) {
                    if (uninst) self.contracts_filter.id = null;
                    cb(uninst);
                });
            } else {
                var uninst = this.eth_uninstallFilter(this.contracts_filter.id);
                if (uninst) this.contracts_filter.id = null;
                return uninst;
            }
        },

        clear_block_filter: function (cb) {
            if (utils.is_function(cb)) {
                var self = this;
                this.eth_uninstallFilter(this.block_filter.id, function (uninst) {
                    if (uninst) self.block_filter.id = null;
                    cb(uninst);
                });
            } else {
                var uninst = this.eth_uninstallFilter(this.block_filter.id);
                if (uninst) this.block_filter.id = null;
                return uninst;
            }
        },

        clear_creation_filter: function (cb) {
            if (utils.is_function(cb)) {
                var self = this;
                this.eth_uninstallFilter(this.creation_filter.id, function (uninst) {
                    if (uninst) self.creation_filter.id = null;
                    cb(uninst);
                });
            } else {
                var uninst = this.eth_uninstallFilter(this.creation_filter.id);
                if (uninst) this.creation_filter.id = null;
                return uninst;
            }
        },

        // set up filters

        setup_price_filter: function (label, f) {
            return this.eth_newFilter({
                address: augur.contracts.buyAndSellShares,
                topics: [ label ]
            }, f);
        },

        setup_contracts_filter: function (f) {
            var self = this;
            var contract_list = [];
            for (var c in augur.contracts) {
                if (!augur.contracts.hasOwnProperty(c)) continue;
                contract_list.push(augur.contracts[c]);
            }
            var params = {
                address: contract_list,
                fromBlock: "0x01",
                toBlock: "latest"
            };
            if (!utils.is_function(f)) {
                this.contracts_filter = {
                    id: this.eth_newFilter(params),
                    heartbeat: null
                };
                return this.contracts_filter;
            }
            this.eth_newFilter(params, function (filter_id) {
                self.contracts_filter = {
                    id: filter_id,
                    heartbeat: null
                };
                f(self.contracts_filter);
            });
        },

        setup_block_filter: function (f) {
            var self = this;
            if (!utils.is_function(f)) {
                this.block_filter = {
                    id: this.eth_newBlockFilter(),
                    heartbeat: null
                };
                return this.block_filter;
            }
            this.eth_newBlockFilter(function (filter_id) {
                self.block_filter = {
                    id: filter_id,
                    heartbeat: null
                };
                f(self.block_filter);
            });
        },

        setup_creation_filter: function (f) {
            return this.eth_newFilter({
                address: augur.contracts.createMarket,
                topics: [ "creationBlock" ]
            }, f);
        },

        // start listeners

        start_price_listener: function (filter_name, cb) {
            if (this.price_filter && this.price_filter.id) {
                if (utils.is_function(cb)) {
                    cb(this.price_filter.id);
                } else {
                    return this.price_filter.id;
                }
            } else {
                if (utils.is_function(cb)) {
                    var self = this;
                    this.setup_price_filter(filter_name, function (filter_id) {
                        if (filter_id && filter_id !== "0x") {
                            self.price_filter = {
                                id: filter_id,
                                heartbeat: null
                            };
                            cb(filter_id);
                        } else {
                            cb(errors.FILTER_NOT_CREATED);
                        }
                    });
                } else {
                    var filter_id = this.setup_price_filter(filter_name);
                    if (filter_id && filter_id !== "0x") {
                        this.price_filter = {
                            id: filter_id,
                            heartbeat: null
                        };
                        return filter_id;
                    } else {
                        return errors.FILTER_NOT_CREATED;
                    }
                }
            }
        },

        start_contracts_listener: function (cb) {
            if (this.contracts_filter.id === null) {
                if (utils.is_function(cb)) {
                    this.setup_contracts_filter(cb);
                } else {
                    return this.setup_contracts_filter();
                }
            }
        },

        start_block_listener: function (cb) {
            if (this.block_filter.id === null) {
                if (utils.is_function(cb)) {
                    this.setup_block_filter(cb);
                } else {
                    return this.setup_block_filter();
                }
            }
        },

        start_creation_listener: function (cb) {
            if (this.creation_filter && this.creation_filter.id) {
                if (utils.is_function(cb)) return cb(this.creation_filter.id);
                return this.creation_filter.id;
            }
            if (utils.is_function(cb)) {
                var self = this;
                this.setup_creation_filter(function (filter_id) {
                    if (filter_id && filter_id !== "0x") {
                        self.creation_filter = {
                            id: filter_id,
                            heartbeat: null
                        };
                        cb(filter_id);
                    } else {
                        cb(errors.FILTER_NOT_CREATED);
                    }
                });
            } else {
                var filter_id = this.setup_creation_filter();
                if (filter_id && filter_id !== "0x") {
                    this.creation_filter = {
                        id: filter_id,
                        heartbeat: null
                    };
                    return filter_id;
                } else {
                    return errors.FILTER_NOT_CREATED;
                }
            }
        },

        // start/stop polling

        pacemaker: function (cb) {
            var self = this;
            if (cb && cb.constructor === Object) {
                if (utils.is_function(cb.contracts)) {
                    this.poll_contracts_listener(cb.contracts);
                    this.contracts_filter.heartbeat = setInterval(function () {
                        self.poll_contracts_listener(cb.contracts);
                    }, this.PULSE);
                }
                if (utils.is_function(cb.price)) {
                    this.poll_price_listener(cb.price);
                    this.price_filter.heartbeat = setInterval(function () {
                        self.poll_price_listener(cb.price);
                    }, this.PULSE);
                }
                if (utils.is_function(cb.block)) {
                    this.poll_block_listener(cb.block);
                    this.block_filter.heartbeat = setInterval(function () {
                        self.poll_block_listener(cb.block);
                    }, this.PULSE);
                }
                if (utils.is_function(cb.creation)) {
                    this.poll_creation_listener(cb.creation);
                    this.creation_filter.heartbeat = setInterval(function () {
                        self.poll_creation_listener(cb.creation);
                    }, this.PULSE);
                }
            }
        },

        listen: function (cb, setupComplete) {
            var self = this;
            if (utils.is_function(setupComplete)) {
                async.series([
                    function (callback) {
                        if (this.contracts_filter.id === null && cb.contracts) {
                            this.start_contracts_listener(function () {
                                self.pacemaker({ contracts: cb.contracts });
                                // console.log("contracts filter:", self.contracts_filter);
                                callback(null, { contracts: self.contracts_filter.id });
                            });
                        } else {
                            callback();
                        }
                    }.bind(this),
                    function (callback) {
                        var self = this;
                        if (this.price_filter.id === null && cb.price) {
                            this.start_price_listener("updatePrice", function () {
                                self.pacemaker({ price: cb.price });
                                // console.log("price filter:", self.price_filter);
                                callback(null, { price: self.price_filter.id });
                            });
                        } else {
                            callback();
                        }
                    }.bind(this),
                    function (callback) {
                        if (this.block_filter.id === null && cb.block) {
                            this.start_block_listener(function () {
                                self.pacemaker({ block: cb.block });
                                // console.log("block filter:", self.block_filter);
                                callback(null, { block: self.block_filter.id });
                            });
                        } else {
                            callback();
                        }
                    }.bind(this),
                    function (callback) {
                        var self = this;
                        if (this.creation_filter.id === null && cb.creation) {
                            this.start_creation_listener(function () {
                                self.pacemaker({ creation: cb.creation });
                                // console.log("creation filter:", self.creation_filter);
                                callback(null, { creation: self.creation_filter.id });
                            });
                        } else {
                            callback();
                        }
                    }.bind(this)
                ], function (err, filter_ids) {
                    if (err) console.error("listen error:", err);
                    console.log(filter_ids);
                    if (setupComplete) setupComplete(filter_ids);
                });
            }
            else {
                if (this.contracts_filter.id === null && cb.contracts) {
                    this.start_contracts_listener(function () {
                        self.pacemaker({ contracts: cb.contracts });
                    });
                }
                if (this.price_filter.id === null && cb.price) {
                    this.start_price_listener("updatePrice", function () {
                        self.pacemaker({ price: cb.price });
                    });
                }
                if (this.block_filter.id === null && cb.block) {
                    this.start_block_listener(function () {
                        self.pacemaker({ block: cb.block });
                    });
                }
                if (this.creation_filter.id === null && cb.creation) {
                    this.start_creation_listener(function () {
                        self.pacemaker({ creation: cb.creation });
                    });
                }
            }
        },

        ignore: function (uninstall, cb) {
            if (uninstall && uninstall.constructor === Object) {
                cb = {};
                if (utils.is_function(uninstall.price)) {
                    cb.price = uninstall.price;
                }
                if (utils.is_function(uninstall.contracts)) {
                    cb.contracts = uninstall.contracts;
                }
                if (utils.is_function(uninstall.block)) {
                    cb.block = uninstall.block;
                }
                if (utils.is_function(uninstall.creation)) {
                    cb.creation = uninstall.creation;
                }
                uninstall = false;
            }
            cb = cb || {};
            if (this.price_filter.heartbeat !== null) {
                clearInterval(this.price_filter.heartbeat);
                this.price_filter.heartbeat = null;
                if (!uninstall && utils.is_function(cb.price)) {
                    cb.price();
                }
            }
            if (this.contracts_filter.heartbeat !== null) {
                clearInterval(this.contracts_filter.heartbeat);
                this.contracts_filter.heartbeat = null;
                if (!uninstall && utils.is_function(cb.contracts)) {
                    cb.contracts();
                }
            }
            if (this.block_filter.heartbeat !== null) {
                clearInterval(this.block_filter.heartbeat);
                this.block_filter.heartbeat = null;
                if (!uninstall && utils.is_function(cb.block)) {
                    cb.block();
                }
            }
            if (this.creation_filter.heartbeat !== null) {
                clearInterval(this.creation_filter.heartbeat);
                this.creation_filter.heartbeat = null;
                if (!uninstall && utils.is_function(cb.creation)) {
                    cb.creation();
                }
            }
            if (uninstall) {
                if (this.price_filter.id !== null) {
                    this.clear_price_filter(cb.price);
                }
                if (this.contracts_filter.id !== null) {
                    this.clear_contracts_filter(cb.contracts);
                }
                if (this.block_filter.id !== null) {
                    this.clear_block_filter(cb.block);
                }
                if (this.creation_filter.id !== null) {
                    this.clear_creation_filter(cb.creation);
                }
            }
        }

    };
};
