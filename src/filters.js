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

        parse_contracts_message: function (message, onMessage) {
            var messages = [];
            for (var i = 0, len = message.length; i < len; ++i) {
                try {
                    if (message[i]) {
                        if (message[i].constructor === Object) {
                            if (message.address === augur.contracts.createMarket) {
                                this.createMarketMessage(message[i].data, message[i].blockNumber);
                            } else {
                                if (message[i].data) {
                                    message[i].data = augur.rpc.unmarshal(message[i].data);
                                }
                            }
                        }
                        if (onMessage) onMessage(message[i]);
                        messages.push(message[i]);
                    }
                } catch (exc) {
                    console.error("parse_contracts_message:", exc);
                    console.log(i, message[i]);
                }
            }
        },

        poll_contracts_listener: function (onMessage) {
            if (utils.is_function(onMessage)) {
                var self = this;
                augur.rpc.getFilterChanges(this.filter.contracts.id, function (message) {
                    if (message && message.length && message.constructor === Array) {
                        self.parse_contracts_message(message, onMessage);
                    }
                });
            }
        },

        poll_block_listener: function (onMessage) {
            if (utils.is_function(onMessage)) {
                augur.rpc.getFilterChanges(this.filter.block.id, function (message) {
                    if (message && message.length && message.constructor === Array) {
                        for (var i = 0, len = message.length; i < len; ++i) {
                            onMessage(message[i]);
                        }
                    }
                });
            }
        },

        parse_price_message: function (message, onMessage) {
            var data_array, market, marketplus, outcome;
            if (message && message.length) {
                for (var i = 0, len = message.length; i < len; ++i) {
                    if (message[i] && message[i].topics && message[i].topics.length > 3) {
                        try {
                            data_array = augur.rpc.unmarshal(message[i].data);
                            if (data_array && data_array.constructor === Array &&
                                data_array.length > 1) {
                                onMessage({
                                    marketId: message[i].topics[1],
                                    trader: abi.format_address(message[i].topics[2]),
                                    type: (parseInt(data_array[0]) === 1) ? "buy" : "sell",
                                    price: abi.unfix(data_array[1], "string"),
                                    amount: abi.unfix(data_array[2], "string"),
                                    timestamp: parseInt(data_array[3]),
                                    outcome: abi.string(data_array[4]),
                                    blockNumber: message[i].blockNumber
                                });
                            }
                        } catch (exc) {
                            console.error("parse_price_message:", exc);
                            console.log(i, message[i]);
                        }
                    }
                }
            }
        },

        poll_price_listener: function (onMessage) {
            var self = this;
            if (this.filter.price) {
                augur.rpc.getFilterChanges(this.filter.price.id, function (message) {
                    self.parse_price_message(message, onMessage);
                });
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
                this.unsubscribe(this.filter.price.id, function (uninst) {
                    self.filter.price.id = null;
                    cb(uninst);
                });
            } else {
                var uninst = this.unsubscribe(this.filter.price.id);
                this.filter.price.id = null;
                return uninst;
            }
        },

        clear_fill_tx_filter: function (cb) {
            if (utils.is_function(cb)) {
                var self = this;
                this.unsubscribe(this.filter.fill_tx.id, function (uninst) {
                    self.filter.fill_tx.id = null;
                    cb(uninst);
                });
            } else {
                var uninst = this.unsubscribe(this.filter.fill_tx.id);
                this.filter.fill_tx.id = null;
                return uninst;
            }
        },

        clear_add_tx_filter: function (cb) {
            if (utils.is_function(cb)) {
                var self = this;
                this.unsubscribe(this.filter.add_tx.id, function (uninst) {
                    self.filter.add_tx.id = null;
                    cb(uninst);
                });
            } else {
                var uninst = this.unsubscribe(this.filter.add_tx.id);
                this.filter.add_tx.id = null;
                return uninst;
            }
        },

        clear_cancel_filter: function (cb) {
            if (utils.is_function(cb)) {
                var self = this;
                this.unsubscribe(this.filter.cancel.id, function (uninst) {
                    self.filter.cancel.id = null;
                    cb(uninst);
                });
            } else {
                var uninst = this.unsubscribe(this.filter.cancel.id);
                this.filter.cancel.id = null;
                return uninst;
            }
        },

        clear_contracts_filter: function (cb) {
            if (utils.is_function(cb)) {
                var self = this;
                this.unsubscribe(this.filter.contracts.id, function (uninst) {
                    self.filter.contracts.id = null;
                    cb(uninst);
                });
            } else {
                var uninst = this.unsubscribe(this.filter.contracts.id);
                this.filter.contracts.id = null;
                return uninst;
            }
        },

        clear_block_filter: function (cb) {
            if (utils.is_function(cb)) {
                var self = this;
                this.unsubscribe(this.filter.block.id, function (uninst) {
                    self.filter.block.id = null;
                    cb(uninst);
                });
            } else {
                var uninst = this.unsubscribe(this.filter.block.id);
                this.filter.block.id = null;
                return uninst;
            }
        },

        // set up filters

        setup_trade_filter: function (contract, label, f) {
            return this.subscribeLogs({
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
                    id: this.subscribeLogs(params),
                    heartbeat: null
                };
                return this.filter.contracts;
            }
            this.subscribeLogs(params, function (filter_id) {
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
                    id: this.subscribeNewBlocks(),
                    heartbeat: null
                };
                return this.filter.block;
            }
            this.subscribeNewBlocks(function (filter_id) {
                self.filter.block = {id: filter_id, heartbeat: null};
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
            if (!cb || cb.constructor !== Object) return;
            if (!augur.rpc.wsUrl && !augur.rpc.ipcpath) {
                if (utils.is_function(cb.block)) {
                    this.poll_block_listener(cb.block);
                    this.filter.block.heartbeat = setInterval(function () {
                        self.poll_block_listener(cb.block);
                    }, this.PULSE);
                }
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
            } else {
                if (utils.is_function(cb.block)) {
                    augur.rpc.registerSubscriptionCallback(this.filter.block.id, function (msg) {
                        cb.block(msg.hash);
                    });
                }
                if (utils.is_function(cb.contracts)) {
                    augur.rpc.registerSubscriptionCallback(this.filter.contracts.id, function (msg) {
                        self.parse_contracts_message(msg, cb.contracts);
                    });
                }
                if (utils.is_function(cb.price)) {
                    augur.rpc.registerSubscriptionCallback(this.filter.price.id, function (msg) {
                        self.parse_price_message(msg, cb.price);
                    });
                }
                if (utils.is_function(cb.fill_tx)) {
                    augur.rpc.registerSubscriptionCallback(this.filter.fill_tx.id, cb.fill_tx);
                }
                if (utils.is_function(cb.add_tx)) {
                    augur.rpc.registerSubscriptionCallback(this.filter.add_tx.id, cb.add_tx);
                }
                if (utils.is_function(cb.cancel)) {
                    augur.rpc.registerSubscriptionCallback(this.filter.cancel.id, cb.cancel);
                }
            }
        },

        listen: function (cb, setup_complete) {
            var run, self = this;
            if (!augur.rpc.wsUrl && !augur.rpc.ipcpath) {
                this.subscribeLogs = augur.rpc.newFilter.bind(augur.rpc);
                this.subscribeNewBlocks = augur.rpc.newBlockFilter.bind(augur.rpc);
                this.unsubscribe = augur.rpc.uninstallFilter.bind(augur.rpc);
                run = async.parallel;
            } else {
                this.subscribeLogs = augur.rpc.subscribeLogs.bind(augur.rpc);
                this.subscribeNewBlocks = augur.rpc.subscribeNewBlocks.bind(augur.rpc);
                this.unsubscribe = augur.rpc.unsubscribe.bind(augur.rpc);
                run = async.series;
            }
            if (utils.is_function(setup_complete)) {
                run([
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
                        } else {
                            callback();
                        }
                    }.bind(this),
                    function (callback) {
                        if (this.filter.cancel.id === null && cb.cancel) {
                            this.start_trade_listener("buyAndSellShares", "cancel", function () {
                                self.pacemaker({cancel: cb.cancel});
                                callback(null, ["cancel", self.filter.cancel.id]);
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
            } else {
                if (this.filter.contracts.id === null && cb.contracts) {
                    this.start_contracts_listener(function () {
                        self.pacemaker({contracts: cb.contracts});
                    });
                }
                if (this.filter.price.id === null && cb.price) {
                    this.start_trade_listener("trade", "price", function () {
                        self.pacemaker({price: cb.price});
                    });
                }
                if (this.filter.fill_tx.id === null && cb.fill_tx) {
                    this.start_trade_listener("trade", "fill_tx", function () {
                        self.pacemaker({fill_tx: cb.fill_tx});
                    });
                }
                if (this.filter.add_tx.id === null && cb.add_tx) {
                    this.start_trade_listener("buyAndSellShares", "add_tx", function () {
                        self.pacemaker({add_tx: cb.add_tx});
                    });
                }
                if (this.filter.cancel.id === null && cb.cancel) {
                    this.start_trade_listener("buyAndSellShares", "cancel", function () {
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
