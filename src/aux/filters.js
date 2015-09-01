/**
 * Filters / logging
 */

"use strict";

var chalk = require("chalk");
var abi = require("augur-abi");
var errors = require("../errors");
var log = console.log;

module.exports = function (augur) {

    return {

        price_filters: {
            updatePrice: null,
            pricePaid: null,
            priceSold: null
        },

        contracts_filter: null,

        heart: null,

        eth_newFilter: function (params, f) {
            return augur.rpc.broadcast(augur.rpc.marshal("newFilter", params), f);
        },

        create_price_filter: function (label, f) {
            return augur.rpc.broadcast(augur.rpc.marshal("newFilter", {
                address: augur.contracts.buyAndSellShares,
                topics: [ label ]
            }), f);
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
            var parsed, rtype, price_logs;
            if (logs) {
                rtype = (augur.bignumbers) ? "BigNumber" : "string";
                price_logs = [];
                for (var i = 0, len = logs.length; i < len; ++i) {
                    if (logs[i] && logs[i].data !== undefined &&
                        logs[i].data !== null && logs[i].data !== "0x")
                    {
                        parsed = augur.rpc.unmarshal(logs[i].data);
                        var market = abi.bignum(logs[i].topics[2]);
                        var marketplus = market.plus(abi.constants.MOD);
                        if (marketplus.lt(abi.constants.BYTES_32)) {
                            market = marketplus;
                        }
                        if (market.eq(abi.bignum(market_id)) &&
                            abi.bignum(logs[i].topics[3]).eq(abi.bignum(outcome_id)))
                        {
                            price_logs.push({
                                price: abi.unfix(parsed[0], rtype),
                                cost: abi.unfix(parsed[1], rtype),
                                blockNumber: abi.bignum(logs[i].blockNumber, rtype)
                            });
                        }
                    }
                }
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
            var stringify, hexify, messages = [];
            if (augur.bignumbers) {
                stringify = hexify = "BigNumber";
            } else {
                stringify = "string";
                hexify = "hex";
            }
            for (var i = 0, len = filtrate.length; i < len; ++i) {
                filtrate[i].data = augur.rpc.unmarshal(filtrate[i].data);
                if (onMessage) onMessage(filtrate[i]);
                messages.push(filtrate[i]);
            }
            if (messages && messages.length) return messages;
        },

        poll_eth_listener: function (filter_name, onMessage) {
            if (this.price_filters[filter_name]) {
                var filterId = this.price_filters[filter_name].filterId;
                this.eth_getFilterChanges(filterId, function (filtrate) {
                    var stringify, hexify, data_array, market, marketplus;
                    if (augur.bignumbers) {
                        stringify = hexify = "BigNumber";
                    } else {
                        stringify = "string";
                        hexify = "hex";
                    }
                    for (var i = 0, len = filtrate.length; i < len; ++i) {
                        data_array = augur.rpc.unmarshal(filtrate[i].data);
                        market = abi.bignum(filtrate[i].topics[2]);
                        marketplus = market.plus(abi.constants.MOD);
                        if (marketplus.lt(abi.constants.BYTES_32)) market = marketplus;
                        onMessage({
                            user: filtrate[i].topics[1],
                            marketId: abi.bignum(market, hexify),
                            outcome: abi.bignum(filtrate[i].topics[3], stringify),
                            price: abi.unfix(data_array[0], stringify),
                            cost: abi.unfix(data_array[1], stringify),
                            blockNumber: abi.bignum(filtrate[i].blockNumber, stringify)
                        });
                    }
                }.bind(this)); // eth_getFilterChanges
            }
        },

        poll_listeners: function (onMessage) {
            if (onMessage && onMessage.constructor === Function) {
                this.eth_getFilterChanges(this.contracts_filter, function (filtrate) {
                    if (filtrate) this.sift(filtrate, onMessage);
                }.bind(this));
            }
        },

        start_eth_listener: function (filter_name, callback) {
            var filter_id;

            if (this.price_filters[filter_name] &&
                this.price_filters[filter_name].filterId)
            {
                filter_id = this.price_filters[filter_name].filterId;

                if (callback) {
                    callback(filter_id);
                } else {
                    return filter_id;
                }

            } else {
                if (callback && callback.constructor === Function) {
                    this.create_price_filter(filter_name, function (filter_id) {
                        if (filter_id && filter_id !== "0x") {

                            this.price_filters[filter_name] = {
                                filterId: filter_id,
                                polling: false
                            };
                            callback(filter_id);

                        } else {
                            callback(errors.FILTER_NOT_CREATED);
                        }
                    }.bind(this));

                } else {
                    filter_id = this.create_price_filter(filter_name);

                    if (filter_id && filter_id !== "0x") {

                        this.price_filters[filter_name] = {
                            filterId: filter_id,
                            polling: false
                        };
                        return filter_id;

                    } else {
                        return errors.FILTER_NOT_CREATED;
                    }                    
                }
            }
        },

        clear_contracts_filter: function (callback) {
            if (callback && callback.constructor === Function) {
                this.eth_uninstallFilter(this.contracts_filter, function (uninst) {
                    if (uninst) this.contracts_filter = null;
                    callback(uninst);
                }.bind(this));
            } else {
                var uninst = this.eth_uninstallFilter(this.contracts_filter);
                if (uninst) this.contracts_filter = null;
                return uninst;
            }
        },

        setup_contracts_filter: function () {
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
            this.contracts_filter = this.eth_newFilter(params);
            return this.contracts_filter;
        },

        start_contracts_listener: function (callback) {

            // set up contracts filter (if needed)
            if (this.contracts_filter === null) {
                if (callback && callback.constructor === Function) {
                    setTimeout(function () {
                        callback(this.setup_contracts_filter());
                    }.bind(this), 0);
                } else {
                    return this.setup_contracts_filter();
                }
            }
        },

        heartbeat: function (callback) {
            callback = callback || function (msg) { log(msg); };
            this.poll_listeners(callback);
            this.heart = setInterval(function () {
                this.poll_listeners(callback);
            }.bind(this), 5000);
        },

        stop_heartbeat: function () {
            clearInterval(this.heart);
            this.heart = null;
        }

    };
};
