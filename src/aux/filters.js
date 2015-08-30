/**
 * Filters / logging
 */

"use strict";

var chalk = require("chalk");
var abi = require("augur-abi");
var log = console.log;

module.exports = function (augur) {

    return {

        price_filters: {
            updatePrice: null,
            pricePaid: null,
            priceSold: null
        },

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

        poll_eth_listener: function (filter_name, onMessage) {
            if (this.price_filters[filter_name]) {
                var filterId = this.price_filters[filter_name].filterId;

                this.eth_getFilterChanges(filterId, function (message) {
                    if (message) {
                        var num_messages = message.length;

                        if (num_messages) {
                            for (var i = 0; i < num_messages; ++i) {
                                var data_array = augur.rpc.unmarshal(message[i].data);
                                var rtype = (augur.bignumbers) ? "BigNumber" : "string";
                                var market = abi.bignum(message[i].topics[2]);
                                var marketplus = market.plus(abi.constants.MOD);
                                if (marketplus.lt(abi.constants.BYTES_32)) {
                                    market = marketplus;
                                }
                                onMessage({
                                    user: message[i].topics[1],
                                    marketId: abi.bignum(market, rtype),
                                    outcome: abi.bignum(message[i].topics[3], rtype),
                                    price: abi.unfix(data_array[0], rtype),
                                    cost: abi.unfix(data_array[1], rtype),
                                    blockNumber: abi.bignum(message[i].blockNumber, rtype)
                                });
                            }
                        }
                    }
                }); // eth_getFilterChanges
            }
        },

        start_eth_listener: function (filter_name, callback) {
            var filter_id;

            if (this.price_filters[filter_name] &&
                this.price_filters[filter_name].filterId)
            {
                filter_id = this.price_filters[filter_name].filterId;

            } else {
                this.create_price_filter(filter_name, function (filter_id) {

                    if (filter_id && filter_id !== "0x") {

                        this.price_filters[filter_name] = {
                            filterId: filter_id,
                            polling: false
                        };
                        if (callback) callback(filter_id);

                    } else {
                        log("Couldn't create " + filter_name + " filter:",
                            chalk.green(filter_id));
                    }
                }.bind(this));
            }
        }

    };
};

