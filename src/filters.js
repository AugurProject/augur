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
            price: {id: null, heartbeat: null},
            fill_tx: {id: null, heartbeat: null},
            add_tx: {id: null, heartbeat: null},
            cancel: {id: null, heartbeat: null}
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
            if (this.filter.price) {
                augur.rpc.getFilterChanges(this.filter.price.id, function (filtrate) {
                    var data_array, market, marketplus, outcome;
                    if (filtrate && filtrate.length) {
                        for (var i = 0, len = filtrate.length; i < len; ++i) {
                            if (filtrate[i] && filtrate[i].topics && filtrate[i].topics.length > 3) {
                                try {
                                    data_array = augur.rpc.unmarshal(filtrate[i].data);
                                    if (data_array && data_array.constructor === Array &&
                                        data_array.length > 1) {
                                        onMessage({
                                            marketId: filtrate[i].topics[1],
                                            trader: abi.format_address(filtrate[i].topics[2]),
                                            type: (parseInt(data_array[0]) === 1) ? "buy" : "sell",
                                            price: abi.unfix(data_array[1], "string"),
                                            amount: abi.unfix(data_array[2], "string"),
                                            timestamp: parseInt(data_array[3]),
                                            outcome: abi.string(data_array[4]),
                                            blockNumber: filtrate[i].blockNumber
                                        });
                                    }
                                } catch (exc) {
                                    console.error("price filter:", exc);
                                    console.log(i, filtrate[i]);
                                }
                            }
                        }
                    }
                }); // eth_getFilterChanges
            }
        },

        poll_fill_tx_listener: function (onMessage) {
            if (this.filter.fill_tx) {
                augur.rpc.getFilterChanges(this.filter.fill_tx.id, onMessage);
            }
        },

        poll_add_tx_listener: function (onMessage) {
            if (this.filter.add_tx) {
                augur.rpc.getFilterChanges(this.filter.add_tx.id, onMessage);
            }
        },

        poll_cancel_listener: function (onMessage) {
            if (this.filter.cancel) {
                augur.rpc.getFilterChanges(this.filter.cancel.id, onMessage);
            }
        },

        // clear/uninstall filters

        clear_price_filter: function (cb) {
            if (utils.is_function(cb)) {
                var self = this;
                augur.rpc.uninstallFilter(this.filter.price.id, function (uninst) {
                    self.filter.price.id = null;
                    cb(uninst);
                });
            } else {
                var uninst = augur.rpc.uninstallFilter(this.filter.price.id);
                this.filter.price.id = null;
                return uninst;
            }
        },

        clear_fill_tx_filter: function (cb) {
            if (utils.is_function(cb)) {
                var self = this;
                augur.rpc.uninstallFilter(this.filter.fill_tx.id, function (uninst) {
                    self.filter.fill_tx.id = null;
                    cb(uninst);
                });
            } else {
                var uninst = augur.rpc.uninstallFilter(this.filter.fill_tx.id);
                this.filter.fill_tx.id = null;
                return uninst;
            }
        },

        clear_add_tx_filter: function (cb) {
            if (utils.is_function(cb)) {
                var self = this;
                augur.rpc.uninstallFilter(this.filter.add_tx.id, function (uninst) {
                    self.filter.add_tx.id = null;
                    cb(uninst);
                });
            } else {
                var uninst = augur.rpc.uninstallFilter(this.filter.add_tx.id);
                this.filter.add_tx.id = null;
                return uninst;
            }
        },

        clear_cancel_filter: function (cb) {
            if (utils.is_function(cb)) {
                var self = this;
                augur.rpc.uninstallFilter(this.filter.cancel.id, function (uninst) {
                    self.filter.cancel.id = null;
                    cb(uninst);
                });
            } else {
                var uninst = augur.rpc.uninstallFilter(this.filter.cancel.id);
                this.filter.cancel.id = null;
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

        setup_trade_filter: function (contract, label, f) {
            return augur.rpc.newFilter({
                address: augur.contracts[contract],
                topics: [abi.prefix_hex(abi.keccak_256(constants.LOGS[label]))]
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

        start_trade_listener: function (contract, filter_name, cb) {
            var self = this;
            if (this.filter[filter_name] && this.filter[filter_name].id) {
                if (!utils.is_function(cb)) return this.filter[filter_name].id;
                return cb(this.filter[filter_name].id);
            }
            if (!utils.is_function(cb)) {
                var filter_id = this.setup_trade_filter(contract, filter_name);
                if (!filter_id || filter_id === "0x") {
                    return errors.FILTER_NOT_CREATED;
                }
                if (filter_id.error) return filter_id;
                self.filter[filter_name] = {
                    id: filter_id,
                    heartbeat: null
                };
                return filter_id;
            }
            this.setup_trade_filter(contract, filter_name, function (filter_id) {
                if (!filter_id || filter_id === "0x") {
                    return cb(errors.FILTER_NOT_CREATED);
                }
                console.log(contract, filter_name, filter_id);
                if (filter_id.error) return cb(filter_id);
                self.filter[filter_name] = {
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
                    this.filter.price.heartbeat = setInterval(function () {
                        self.poll_price_listener(cb.price);
                    }, this.PULSE);
                }
                if (utils.is_function(cb.fill_tx)) {
                    this.poll_fill_tx_listener(cb.fill_tx);
                    this.filter.fill_tx.heartbeat = setInterval(function () {
                        self.poll_fill_tx_listener(cb.fill_tx);
                    }, this.PULSE);
                }
                if (utils.is_function(cb.add_tx)) {
                    this.poll_add_tx_listener(cb.add_tx);
                    this.filter.add_tx.heartbeat = setInterval(function () {
                        self.poll_add_tx_listener(cb.add_tx);
                    }, this.PULSE);
                }
                if (utils.is_function(cb.cancel)) {
                    this.poll_cancel_listener(cb.cancel);
                    this.filter.cancel.heartbeat = setInterval(function () {
                        self.poll_cancel_listener(cb.cancel);
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
                        if (this.filter.price.id === null && cb.price) {
                            this.start_trade_listener("trade", "price", function () {
                                self.pacemaker({price: cb.price});
                                callback(null, ["price", self.filter.price.id]);
                            });
                        } else {
                            callback();
                        }
                    }.bind(this),
                    function (callback) {
                        if (this.filter.fill_tx.id === null && cb.fill_tx) {
                            this.start_trade_listener("trade", "fill_tx", function () {
                                self.pacemaker({fill_tx: cb.fill_tx});
                                callback(null, ["fill_tx", self.filter.fill_tx.id]);
                            });
                        } else {
                            callback();
                        }
                    }.bind(this),
                    function (callback) {
                        if (this.filter.add_tx.id === null && cb.add_tx) {
                            this.start_trade_listener("buyAndSellShares", "add_tx", function () {
                                self.pacemaker({add_tx: cb.add_tx});
                                callback(null, ["add_tx", self.filter.add_tx.id]);
                            });
                        }
                    }.bind(this),
                    function (callback) {
                        if (this.filter.cancel.id === null && cb.cancel) {
                            this.start_trade_listener("buyAndSellShares", "cancel", function () {
                                self.pacemaker({cancel: cb.cancel});
                                callback(null, ["cancel", self.filter.cancel.id]);
                            });
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
            } else {
                if (this.filter.contracts.id === null && cb.contracts) {
                    this.start_contracts_listener(function () {
                        self.pacemaker({contracts: cb.contracts});
                    });
                }
                if (this.filter.price.id === null && cb.price) {
                    this.start_trade_listener("trade", constants.LOGS.price, function () {
                        self.pacemaker({price: cb.price});
                    });
                }
                if (this.filter.fill_tx.id === null && cb.fill_tx) {
                    this.start_trade_listener("trade", constants.LOGS.fill_tx, function () {
                        self.pacemaker({fill_tx: cb.fill_tx});
                    });
                }
                if (this.filter.add_tx.id === null && cb.add_tx) {
                    this.start_trade_listener("buyAndSellShares", constants.LOGS.add_tx, function () {
                        self.pacemaker({add_tx: cb.add_tx});
                    });
                }
                if (this.filter.cancel.id === null && cb.cancel) {
                    this.start_trade_listener("buyAndSellShares", constants.LOGS.cancel, function () {
                        self.pacemaker({cancel: cb.cancel});
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
            return this.filter.price.heartbeat === null &&
                this.filter.fill_tx.heartbeat === null &&
                this.filter.add_tx.heartbeat === null &&
                this.filter.cancel.heartbeat === null &&
                this.filter.contracts.heartbeat === null &&
                this.filter.block.heartbeat === null &&
                this.filter.price.id === null &&
                this.filter.fill_tx.id === null &&
                this.filter.add_tx.id === null &&
                this.filter.cancel.id === null &&
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
                if (utils.is_function(uninstall.fill_tx)) {
                    cb.fill_tx = uninstall.fill_tx;
                }
                if (utils.is_function(uninstall.add_tx)) {
                    cb.add_tx = uninstall.add_tx;
                }
                if (utils.is_function(uninstall.cancel)) {
                    cb.cancel = uninstall.cancel;
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
            cb.fill_tx = utils.is_function(cb.fill_tx) ? cb.fill_tx : utils.noop;
            cb.add_tx = utils.is_function(cb.add_tx) ? cb.add_tx : utils.noop;
            cb.cancel = utils.is_function(cb.cancel) ? cb.cancel : utils.noop;
            cb.contracts = utils.is_function(cb.contracts) ? cb.contracts : utils.noop;
            cb.block = utils.is_function(cb.block) ? cb.block : utils.noop;
            complete = utils.is_function(complete) ? complete : utils.noop; // after all filters removed
            if (this.filter.price.heartbeat !== null) {
                clearInterval(this.filter.price.heartbeat);
                this.filter.price.heartbeat = null;
                if (!uninstall && utils.is_function(cb.price)) {
                    cb.price();
                    if (this.all_filters_removed()) complete();
                }
            }
            if (this.filter.fill_tx.heartbeat !== null) {
                clearInterval(this.filter.fill_tx.heartbeat);
                this.filter.fill_tx.heartbeat = null;
                if (!uninstall && utils.is_function(cb.fill_tx)) {
                    cb.fill_tx();
                    if (this.all_filters_removed()) complete();
                }
            }
            if (this.filter.add_tx.heartbeat !== null) {
                clearInterval(this.filter.add_tx.heartbeat);
                this.filter.add_tx.heartbeat = null;
                if (!uninstall && utils.is_function(cb.add_tx)) {
                    cb.add_tx();
                    if (this.all_filters_removed()) complete();
                }
            }
            if (this.filter.cancel.heartbeat !== null) {
                clearInterval(this.filter.cancel.heartbeat);
                this.filter.cancel.heartbeat = null;
                if (!uninstall && utils.is_function(cb.cancel)) {
                    cb.cancel();
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
                if (this.filter.price.id !== null) {
                    this.clear_price_filter(function (uninst) {
                        cleared(uninst, cb.price, complete);
                    });
                }
                if (this.filter.fill_tx.id !== null) {
                    this.clear_fill_tx_filter(function (uninst) {
                        cleared(uninst, cb.fill_tx, complete);
                    });
                }
                if (this.filter.add_tx.id !== null) {
                    this.clear_add_tx_filter(function (uninst) {
                        cleared(uninst, cb.add_tx, complete);
                    });
                }
                if (this.filter.cancel.id !== null) {
                    this.clear_cancel_filter(function (uninst) {
                        cleared(uninst, cb.cancel, complete);
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
