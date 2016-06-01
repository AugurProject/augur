/**
 * Filters / logging
 */

"use strict";

var async = require("async");
var abi = require("augur-abi");
var errors = require("augur-contracts").errors;
var utils = require("./utilities");
var constants = require("./constants");

module.exports = function () {

    var augur = this;

    return {

        PULSE: constants.SECONDS_PER_BLOCK * 500,

        filter: {
            block: {id: null, heartbeat: null},
            contracts: {id: null, heartbeat: null},
            log_price: {id: null, heartbeat: null}
        },

        createMarketMessage: function (data, blockNumber, onMessage) {
            var tx = {
                to: augur.contracts.createMarket,
                from: augur.from,
                data: data,
                gas: augur.rpc.DEFAULT_GAS
            };
            if (!utils.is_function(onMessage)) return augur.rpc.call(tx);
            augur.rpc.call(tx, function (callReturn) {
                onMessage({
                    label: "createMarket",
                    marketId: callReturn,
                    creationBlock: blockNumber
                });
            });
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
                        if (filtrate[i].constructor === Object) {
                            if (filtrate.address === augur.contracts.createMarket) {
                                this.createMarketMessage(filtrate[i].data, filtrate[i].blockNumber);
                            } else {
                                if (filtrate[i].data) {
                                    filtrate[i].data = augur.rpc.unmarshal(filtrate[i].data);
                                }
                            }
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
                augur.rpc.getFilterChanges(this.filter.contracts.id, function (filtrate) {
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
                augur.rpc.getFilterChanges(this.filter.block.id, function (filtrate) {
                    if (filtrate && filtrate.length && filtrate.constructor === Array) {
                        for (var i = 0, len = filtrate.length; i < len; ++i) {
                            onMessage(filtrate[i]);
                        }
                    }
                });
            }
        },

        poll_price_listener: function (onMessage) {
            if (this.filter.log_price) {
                augur.rpc.getFilterChanges(this.filter.log_price.id, function (filtrate) {
                    var data_array, market, marketplus, outcome;
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
                                        market = abi.hex(market);
                                        outcome = abi.string(filtrate[i].topics[3]);
                                        onMessage({
                                            user: abi.format_address(filtrate[i].topics[1]),
                                            marketId: market,
                                            outcome: outcome,
                                            price: abi.unfix(data_array[0], "string"),
                                            cost: abi.unfix(data_array[1], "string"),
                                            shares: abi.unfix(data_array[2], "string"),
                                            blockNumber: abi.string(filtrate[i].blockNumber)
                                        });
                                    }
                                } catch (exc) {
                                    console.error("log_price filter:", exc);
                                    console.log(i, filtrate[i]);
                                }
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
                augur.rpc.uninstallFilter(this.filter.log_price.id, function (uninst) {
                    self.filter.log_price.id = null;
                    cb(uninst);
                });
            } else {
                var uninst = augur.rpc.uninstallFilter(this.filter.log_price.id);
                this.filter.log_price.id = null;
                return uninst;
            }
        },

        clear_contracts_filter: function (cb) {
            if (utils.is_function(cb)) {
                var self = this;
                augur.rpc.uninstallFilter(this.filter.contracts.id, function (uninst) {
                    self.filter.contracts.id = null;
                    cb(uninst);
                });
            } else {
                var uninst = augur.rpc.uninstallFilter(this.filter.contracts.id);
                this.filter.contracts.id = null;
                return uninst;
            }
        },

        clear_block_filter: function (cb) {
            if (utils.is_function(cb)) {
                var self = this;
                augur.rpc.uninstallFilter(this.filter.block.id, function (uninst) {
                    self.filter.block.id = null;
                    cb(uninst);
                });
            } else {
                var uninst = augur.rpc.uninstallFilter(this.filter.block.id);
                this.filter.block.id = null;
                return uninst;
            }
        },

        // set up filters

        setup_price_filter: function (label, f) {
            return augur.rpc.newFilter({
                address: augur.contracts.trade,
                topics: [augur.rpc.sha3(label)]
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
                this.filter.contracts = {
                    id: augur.rpc.newFilter(params),
                    heartbeat: null
                };
                return this.filter.contracts;
            }
            augur.rpc.newFilter(params, function (filter_id) {
                self.filter.contracts = {
                    id: filter_id,
                    heartbeat: null
                };
                f(self.filter.contracts);
            });
        },

        setup_block_filter: function (f) {
            var self = this;
            if (!utils.is_function(f)) {
                this.filter.block = {
                    id: augur.rpc.newBlockFilter(),
                    heartbeat: null
                };
                return this.filter.block;
            }
            augur.rpc.newBlockFilter(function (filter_id) {
                self.filter.block = {
                    id: filter_id,
                    heartbeat: null
                };
                f(self.filter.block);
            });
        },

        // start listeners

        start_price_listener: function (filter_name, cb) {
            var self = this;
            if (this.filter.log_price && this.filter.log_price.id) {
                if (!utils.is_function(cb)) return this.filter.log_price.id;
                return cb(this.filter.log_price.id);
            }
            if (!utils.is_function(cb)) {
                var filter_id = this.setup_price_filter(filter_name);
                if (!filter_id || filter_id === "0x") {
                    return errors.FILTER_NOT_CREATED;
                }
                if (filter_id.error) return filter_id;
                self.filter.log_price = {
                    id: filter_id,
                    heartbeat: null
                };
                return filter_id;
            }
            this.setup_price_filter(filter_name, function (filter_id) {
                if (!filter_id || filter_id === "0x") {
                    return cb(errors.FILTER_NOT_CREATED);
                }
                if (filter_id.error) return cb(filter_id);
                self.filter.log_price = {
                    id: filter_id,
                    heartbeat: null
                };
                cb(filter_id);
            });
        },

        start_contracts_listener: function (cb) {
            if (this.filter.contracts.id === null) {
                if (utils.is_function(cb)) {
                    this.setup_contracts_filter(cb);
                } else {
                    return this.setup_contracts_filter();
                }
            }
        },

        start_block_listener: function (cb) {
            if (this.filter.block.id === null) {
                if (utils.is_function(cb)) {
                    this.setup_block_filter(cb);
                } else {
                    return this.setup_block_filter();
                }
            }
        },

        // start/stop polling

        pacemaker: function (cb) {
            var self = this;
            if (cb && cb.constructor === Object) {
                if (utils.is_function(cb.contracts)) {
                    this.poll_contracts_listener(cb.contracts);
                    this.filter.contracts.heartbeat = setInterval(function () {
                        self.poll_contracts_listener(cb.contracts);
                    }, this.PULSE);
                }
                if (utils.is_function(cb.price)) {
                    this.poll_price_listener(cb.price);
                    this.filter.log_price.heartbeat = setInterval(function () {
                        self.poll_price_listener(cb.price);
                    }, this.PULSE);
                }
                if (utils.is_function(cb.block)) {
                    this.poll_block_listener(cb.block);
                    this.filter.block.heartbeat = setInterval(function () {
                        self.poll_block_listener(cb.block);
                    }, this.PULSE);
                }
            }
        },

        listen: function (cb, setup_complete) {
            var self = this;
            if (utils.is_function(setup_complete)) {
                async.parallel([
                    function (callback) {
                        if (this.filter.contracts.id === null && cb.contracts) {
                            this.start_contracts_listener(function () {
                                self.pacemaker({contracts: cb.contracts});
                                callback(null, ["contracts", self.filter.contracts.id]);
                            });
                        } else {
                            callback();
                        }
                    }.bind(this),
                    function (callback) {
                        var self = this;
                        if (this.filter.log_price.id === null && cb.price) {
                            this.start_price_listener(constants.LOGS.log_price, function () {
                                self.pacemaker({price: cb.price});
                                callback(null, ["price", self.filter.log_price.id]);
                            });
                        } else {
                            callback();
                        }
                    }.bind(this),
                    function (callback) {
                        if (this.filter.block.id === null && cb.block) {
                            this.start_block_listener(function () {
                                self.pacemaker({block: cb.block});
                                callback(null, ["block", self.filter.block.id]);
                            });
                        } else {
                            callback();
                        }
                    }.bind(this)
                ], function (err, filter_ids) {
                    if (err) {
                        console.error("filters.listen:", err);
                        return setup_complete(err);
                    }
                    var filters = {};
                    if (filter_ids && filter_ids.length) {
                        for (var i = 0; i < filter_ids.length; ++i) {
                            if (filter_ids[i] && filter_ids[i].length) {
                                filters[filter_ids[i][0]] = filter_ids[i][1];
                            }
                        }
                    }
                    setup_complete(filters);
                });
            }
            else {
                if (this.filter.contracts.id === null && cb.contracts) {
                    this.start_contracts_listener(function () {
                        self.pacemaker({contracts: cb.contracts});
                    });
                }
                if (this.filter.log_price.id === null && cb.price) {
                    this.start_price_listener("log_price", function () {
                        self.pacemaker({price: cb.price});
                    });
                }
                if (this.filter.block.id === null && cb.block) {
                    this.start_block_listener(function () {
                        self.pacemaker({block: cb.block});
                    });
                }
            }
        },

        all_filters_removed: function () {
            return this.filter.log_price.heartbeat === null &&
                this.filter.contracts.heartbeat === null &&
                this.filter.block.heartbeat === null &&
                this.filter.log_price.id === null &&
                this.filter.contracts.id === null &&
                this.filter.block.id === null;
        },

        ignore: function (uninstall, cb, complete) {
            var self = this;

            function cleared(uninst, callback, complete) {
                callback(uninst);
                if (uninst && uninst.constructor === Object) {
                    return complete(uninst);
                }
                if (self.all_filters_removed()) complete();
            }

            if (!complete && utils.is_function(cb)) {
                complete = cb;
                cb = null;
            }
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
                uninstall = false;
            }
            cb = cb || {}; // individual filter removal callbacks
            cb.price = utils.is_function(cb.price) ? cb.price : utils.noop;
            cb.contracts = utils.is_function(cb.contracts) ? cb.contracts : utils.noop;
            cb.block = utils.is_function(cb.block) ? cb.block : utils.noop;
            complete = utils.is_function(complete) ? complete : utils.noop; // after all filters removed
            if (this.filter.log_price.heartbeat !== null) {
                clearInterval(this.filter.log_price.heartbeat);
                this.filter.log_price.heartbeat = null;
                if (!uninstall && utils.is_function(cb.price)) {
                    cb.price();
                    if (this.all_filters_removed()) complete();
                }
            }
            if (this.filter.contracts.heartbeat !== null) {
                clearInterval(this.filter.contracts.heartbeat);
                this.filter.contracts.heartbeat = null;
                if (!uninstall && utils.is_function(cb.contracts)) {
                    cb.contracts();
                    if (this.all_filters_removed()) complete();
                }
            }
            if (this.filter.block.heartbeat !== null) {
                clearInterval(this.filter.block.heartbeat);
                this.filter.block.heartbeat = null;
                if (!uninstall && utils.is_function(cb.block)) {
                    cb.block();
                    if (this.all_filters_removed()) complete();
                }
            }
            if (uninstall) {
                if (this.filter.log_price.id !== null) {
                    this.clear_price_filter(function (uninst) {
                        cleared(uninst, cb.price, complete);
                    });
                }
                if (this.filter.contracts.id !== null) {
                    this.clear_contracts_filter(function (uninst) {
                        cleared(uninst, cb.contracts, complete);
                    });
                }
                if (this.filter.block.id !== null) {
                    this.clear_block_filter(function (uninst) {
                        cleared(uninst, cb.block, complete);
                    });
                }
            }
        }

    };
};
