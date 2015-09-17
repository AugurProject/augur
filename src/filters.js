/**
 * Filters / logging
 */

"use strict";

var chalk = require("chalk");
var abi = require("augur-abi");
var utils = require("./utilities");
var errors = require("./errors");

module.exports = function (augur) {

    return {

        PULSE: 5000,

        price_filter: { id: null, heartbeat: null },

        contracts_filter: { id: null, heartbeat: null },

        block_filter: { id: null, heartbeat: null },

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
            var parsed, price_logs, market, marketplus;
            if (logs) {
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
                        if (market.eq(abi.bignum(market_id)) &&
                            abi.bignum(logs[i].topics[3]).eq(abi.bignum(outcome_id)))
                        {
                            price_logs.push({
                                price: abi.unfix(parsed[0], "string"),
                                cost: abi.unfix(parsed[1], "string"),
                                blockNumber: abi.hex(logs[i].blockNumber)
                            });
                        }
                    }
                }
                price_logs.reverse();
                return price_logs;
            }
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
                filtrate[i].data = augur.rpc.unmarshal(filtrate[i].data);
                if (onMessage) onMessage(filtrate[i]);
                messages.push(filtrate[i]);
            }
            if (messages.length) return messages;
        },

        poll_contracts_listener: function (onMessage) {
            if (utils.is_function(onMessage)) {
                var self = this;
                this.eth_getFilterChanges(this.contracts_filter.id, function (filtrate) {
                    if (filtrate) self.sift(filtrate, onMessage);
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
                    var data_array, market, marketplus;
                    if (filtrate && filtrate.length) {
                        for (var i = 0, len = filtrate.length; i < len; ++i) {
                            data_array = augur.rpc.unmarshal(filtrate[i].data);
                            market = abi.bignum(filtrate[i].topics[2]);
                            marketplus = market.plus(abi.constants.MOD);
                            if (marketplus.lt(abi.constants.BYTES_32)) {
                                market = marketplus;
                            }
                            onMessage({
                                user: abi.format_address(filtrate[i].topics[1]),
                                marketId: abi.hex(market),
                                outcome: abi.bignum(filtrate[i].topics[3], "string"),
                                price: abi.unfix(data_array[0], "string"),
                                cost: abi.unfix(data_array[1], "string"),
                                blockNumber: abi.bignum(filtrate[i].blockNumber, "string")
                            });
                        }
                    }
                }); // eth_getFilterChanges
            }
        },

        create_price_filter: function (label, f) {
            return augur.rpc.broadcast(augur.rpc.marshal("newFilter", {
                address: augur.contracts.buyAndSellShares,
                topics: [ label ]
            }), f);
        },

        start_price_listener: function (filter_name, cb) {
            var filter_id;
            if (this.price_filter && this.price_filter.id) {
                if (cb) {
                    cb(this.price_filter.id);
                } else {
                    return this.price_filter.id;
                }
            } else {
                if (utils.is_function(cb)) {
                    var self = this;
                    this.create_price_filter(filter_name, function (filter_id) {
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
                    filter_id = this.create_price_filter(filter_name);
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

        setup_contracts_filter: function () {
            var contract_list = [];
            for (var c in augur.contracts) {
                if (!augur.contracts.hasOwnProperty(c)) continue;
                contract_list.push(augur.contracts[c]);
            }
            this.contracts_filter = {
                id: this.eth_newFilter({
                    address: contract_list,
                    fromBlock: "0x01",
                    toBlock: "latest"
                }),
                heartbeat: null
            };
            return this.contracts_filter;
        },

        setup_block_filter: function () {
            this.block_filter = {
                id: this.eth_newBlockFilter(),
                heartbeat: null
            };
            return this.block_filter;
        },

        start_block_listener: function (cb) {
            if (this.block_filter.id === null) {
                if (utils.is_function(cb)) {
                    var self = this;
                    setTimeout(function () {
                        cb(self.setup_block_filter());
                    }, 0);
                } else {
                    return this.setup_block_filter();
                }
            }
        },

        start_contracts_listener: function (cb) {
            if (this.contracts_filter.id === null) {
                if (utils.is_function(cb)) {
                    var self = this;
                    setTimeout(function () {
                        cb(self.setup_contracts_filter());
                    }, 0);
                } else {
                    return this.setup_contracts_filter();
                }
            }
        },

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
            }
        },

        listen: function (cb) {
            var self = this;
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
            }
        }

    };
};
