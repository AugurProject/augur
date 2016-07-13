/**
 * Filters / logging
 */

"use strict";

var async = require("async");
var abi = require("augur-abi");
var errors = require("augur-contracts").errors;
var utils = require("./utilities");
var constants = require("./constants");

var FILTER_LABELS = [
    "block",
    "contracts",
    "price",
    "fill_tx",
    "add_tx",
    "cancel",
    "thru",
    "penalize",
    "marketCreated",
    "tradingFeeUpdated",
    "approval",
    "transfer"
];
var filters = {};
for (var i = 0, n = FILTER_LABELS.length; i < n; ++i) {
    filters[FILTER_LABELS[i]] = {id: null, heartbeat: null};
}

module.exports = function () {

    var augur = this;

    return {

        PULSE: constants.SECONDS_PER_BLOCK * 500,

        filter: filters,

        parse_block_message: function (message, onMessage) {
            if (message) {
                if (message.length && message.constructor === Array) {
                    for (var i = 0, len = message.length; i < len; ++i) {
                        if (message[i]) onMessage(message[i].hash);
                    }
                } else {
                    if (message.hash) onMessage(message.hash);
                }
            }
        },
        parse_contracts_message: function (message, onMessage) {
            if (message) {
                if (message.length && message.constructor === Array) {
                    for (var i = 0, len = message.length; i < len; ++i) {
                        if (message[i]) {
                            if (message[i].constructor === Object && message[i].data) {
                                message[i].data = augur.rpc.unmarshal(message[i].data);
                            }
                            if (onMessage) onMessage(message[i]);
                        }
                    }
                } else {
                    onMessage(message);
                }
            }
        },
        parse_add_tx_message: function (message, onMessage) {
            if (message) {
                if (message.length && message.constructor === Array) {
                    for (var i = 0, len = message.length; i < len; ++i) {
                        if (message[i]) {
                            if (message[i].constructor === Object && message[i].data) {
                                message[i].data = augur.rpc.unmarshal(message[i].data);
                            }
                            if (onMessage) onMessage(message[i]);
                        }
                    }
                } else {
                    onMessage(message);
                }
            }
        },
        parse_cancel_message: function (message, onMessage) {
            console.log("cancel:", JSON.stringify(message, null, 2));
            if (message) {
                if (message.length && message.constructor === Array) {
                    for (var i = 0, len = message.length; i < len; ++i) {
                        if (message[i]) {
                            if (message[i].constructor === Object && message[i].data) {
                                message[i].data = augur.rpc.unmarshal(message[i].data);
                            }
                            if (onMessage) onMessage(message[i]);
                        }
                    }
                } else {
                    onMessage(message);
                }
            }
        },
        parse_thru_message: function (message, onMessage) {
            console.log("thru:", JSON.stringify(message, null, 2));
            for (var i = 0, len = message.length; i < len; ++i) {
                if (message[i]) {
                    if (message[i].constructor === Object && message[i].data) {
                        message[i].data = augur.rpc.unmarshal(message[i].data);
                    }
                    if (onMessage) onMessage(message[i]);
                }
            }
        },
        parse_penalize_message: function (message, onMessage) {
            console.log("penalize:", JSON.stringify(message, null, 2));
            if (message) {
                if (message.length && message.constructor === Array) {
                    for (var i = 0, len = message.length; i < len; ++i) {
                        if (message[i]) {
                            if (message[i].constructor === Object && message[i].data) {
                                message[i].data = augur.rpc.unmarshal(message[i].data);
                            }
                            if (onMessage) onMessage(message[i]);
                        }
                    }
                } else {
                    onMessage(message);
                }
            }
        },
        parse_marketCreated_message: function (message, onMessage) {
            if (message) {
                if (message.length && message.constructor === Array) {
                    for (var i = 0, len = message.length; i < len; ++i) {
                        if (message[i]) onMessage(message[i].data);
                    }
                } else {
                    if (message.data) onMessage(message.data);
                }
            }
        },
        parse_tradingFeeUpdated_message: function (message, onMessage) {
            console.log("tradingFeeUpdated:", JSON.stringify(message, null, 2));
            if (message) {
                if (message.length && message.constructor === Array) {
                    for (var i = 0, len = message.length; i < len; ++i) {
                        if (message[i]) {
                            if (message[i].constructor === Object && message[i].data) {
                                message[i].data = augur.rpc.unmarshal(message[i].data);
                            }
                            if (onMessage) onMessage(message[i]);
                        }
                    }
                } else {
                    onMessage(message);
                }
            }
        },
        parse_approval_message: function (message, onMessage) {
            console.log("approval:", JSON.stringify(message, null, 2));
            if (message) {
                if (message.length && message.constructor === Array) {
                    for (var i = 0, len = message.length; i < len; ++i) {
                        if (message[i]) {
                            if (message[i].constructor === Object && message[i].data) {
                                message[i].data = augur.rpc.unmarshal(message[i].data);
                            }
                            if (onMessage) onMessage(message[i]);
                        }
                    }
                } else {
                    onMessage(message);
                }
            }
        },
        parse_transfer_message: function (message, onMessage) {
            console.log("transfer:", JSON.stringify(message, null, 2));
            if (message) {
                if (message.length && message.constructor === Array) {
                    for (var i = 0, len = message.length; i < len; ++i) {
                        if (message[i]) {
                            if (message[i].constructor === Object && message[i].data) {
                                message[i].data = augur.rpc.unmarshal(message[i].data);
                            }
                            if (onMessage) onMessage(message[i]);
                        }
                    }
                } else {
                    onMessage(message);
                }
            }
        },
        parse_fill_tx_message: function (message, onMessage) {
            if (message) {
                if (message.length && message.constructor === Array) {
                    for (var i = 0, len = message.length; i < len; ++i) {
                        if (message[i]) {
                            if (message[i].constructor === Object && message[i].data) {
                                message[i].data = augur.rpc.unmarshal(message[i].data);
                            }
                            if (onMessage) onMessage(message[i]);
                        }
                    }
                } else {
                    onMessage(message);
                }
            }
        },
        parse_price_message: function (message, onMessage) {
            var data_array, market, marketplus, outcome;
            if (message && message.length) {
                for (var i = 0, len = message.length; i < len; ++i) {
                    if (message[i] && message[i].topics && message[i].topics.length === 3) {
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
                    }
                }
            }
        },

        poll_filter: function (label, onMessage) {
            var callback, self = this;
            if (this.filter[label]) {
                switch (label) {
                case "price":
                    callback = function (msg) {
                        self.parse_price_message(msg, onMessage);
                    };
                    break;
                case "contracts":
                    callback = function (msg) {
                        self.parse_contracts_message(msg, onMessage);
                    };
                    break;
                case "block":
                    callback = function (msg) {
                        self.parse_block_message(msg, onMessage);
                    };
                    break;
                default:
                    callback = onMessage;
                }
                augur.rpc.getFilterChanges(this.filter[label].id, callback);
            }
        },

        // clear/uninstall filters
        clear_filter: function (label, cb) {
            if (utils.is_function(cb)) {
                var self = this;
                this.unsubscribe(this.filter[label].id, function (uninst) {
                    self.filter[label].id = null;
                    cb(uninst);
                });
            } else {
                var uninst = this.unsubscribe(this.filter[label].id);
                this.filter[label].id = null;
                return uninst;
            }
        },

        // set up filters
        setup_event_filter: function (contract, label, f) {
            return this.subscribeLogs({
                address: augur.contracts[contract],
                topics: [constants.LOGS[label].signature]
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
        start_event_listener: function (label, cb) {
            var self = this;
            var contract = constants.LOGS[label].contract;
            if (this.filter[label] && this.filter[label].id) {
                if (!utils.is_function(cb)) return this.filter[label].id;
                return cb(this.filter[label].id);
            }
            if (!utils.is_function(cb)) {
                var filter_id = this.setup_event_filter(contract, label);
                if (!filter_id || filter_id === "0x") {
                    return errors.FILTER_NOT_CREATED;
                }
                if (filter_id.error) return filter_id;
                self.filter[label] = {
                    id: filter_id,
                    heartbeat: null
                };
                return filter_id;
            }
            this.setup_event_filter(contract, label, function (filter_id) {
                if (!filter_id || filter_id === "0x") {
                    return cb(errors.FILTER_NOT_CREATED);
                }
                if (filter_id.error) return cb(filter_id);
                self.filter[label] = {
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
                async.forEachOf(this.filter, function (filter, label, next) {
                    if (utils.is_function(cb[label])) {
                        self.poll_filter(label, cb[label]);
                        self.filter[label].heartbeat = setInterval(function () {
                            self.poll_filter(label, cb[label]);
                        }, self.PULSE);
                    }
                    next();
                });
            } else {
                async.forEachOf(this.filter, function (filter, label, next) {
                    if (utils.is_function(cb[label])) {
                        var callback;
                        switch (label) {
                        case "block":
                            callback = cb.block;
                            cb.block = function (block) {
                                self.parse_block_message(block, callback);
                            };
                            break;
                        case "contracts":
                            callback = cb.contracts;
                            cb.contracts = function (msg) {
                                self.parse_contracts_message(msg, callback);
                            };
                            break;
                        case "price":
                            callback = cb.price;
                            cb.price = function (msg) {
                                self.parse_price_message(msg, callback);
                            };
                            break;
                        case "marketCreated":
                            callback = cb.marketCreated;
                            cb.marketCreated = function (msg) {
                                self.parse_marketCreated_message(msg, callback);
                            };
                            break;
                        }
                        augur.rpc.registerSubscriptionCallback(self.filter[label].id, cb[label]);
                        next();
                    }
                });
            }
        },

        listen: function (cb, setup_complete) {
            var run, self = this;

            function listenHelper(callback, label, next) {
                switch (label) {
                    case "contracts":
                        self.start_contracts_listener(function () {
                            self.pacemaker({contracts: callback});
                            next(null, [label, self.filter[label].id]);
                        });
                        break;
                    case "block":
                        self.start_block_listener(function () {
                            self.pacemaker({block: callback});
                            next(null, [label, self.filter[label].id]);
                        });
                        break;
                    default:
                        self.start_event_listener(label, function () {
                            var p = {};
                            p[label] = callback;
                            self.pacemaker(p);
                            next(null, [label, self.filter[label].id]);
                        });
                }
            }

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
            async.forEachOfSeries(cb, function (callback, label, next) {
                if (!self.filter[label] || !callback){
                    //skip invalid labels, undefined callbacks
                    next(null, null);
                } else if (self.filter[label].id === null && callback) {
                    listenHelper(callback, label, next);
                } else if (self.filter[label].id && callback){
                    //callback already registered. uninstall, and reinstall new callback.
                    self.clear_filter(label, function () {
                        listenHelper(callback, label, next);
                    });
                }
            }, function (err) {
                if (err) console.error(err);
                if (utils.is_function(setup_complete)) setup_complete(self.filter);
            });
        },
        all_filters_removed: function () {
            var f, isRemoved = true;
            for (var label in this.filter) {
                if (!this.filter.hasOwnProperty(label)) continue;
                f = this.filter[label];
                if (f.heartbeat !== null || f.id !== null) {
                    isRemoved = false;
                    break;
                }
            }
            return isRemoved;
        },

        ignore: function (uninstall, cb, complete) {
            var label, self = this;

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
                for (label in this.filter) {
                    if (!this.filter.hasOwnProperty(label)) continue;
                    if (utils.is_function(uninstall[label])) {
                        cb[label] = uninstall[label];
                    }
                }
                uninstall = false;
            }
            cb = cb || {}; // individual filter removal callbacks
            for (label in this.filter) {
                if (!this.filter.hasOwnProperty(label)) continue;
                cb[label] = utils.is_function(cb[label]) ? cb[label] : utils.noop;
            }
            complete = utils.is_function(complete) ? complete : utils.noop; // after all filters removed
            for (label in this.filter) {
                if (!this.filter.hasOwnProperty(label)) continue;
                if (this.filter[label].heartbeat !== null) {
                    clearInterval(this.filter[label].heartbeat);
                    this.filter[label].heartbeat = null;
                    if (!uninstall && utils.is_function(cb[label])) {
                        cb[label]();
                        if (this.all_filters_removed()) complete();
                    }
                }
            }
            if (uninstall) {
                async.forEachOfSeries(this.filter, function (filter, label, next) {
                    if (filter.id !== null) {
                        self.clear_filter(label, function (uninst) {
                            cleared(uninst, cb[label], complete);
                            next();
                        });
                    } else {
                        next();
                    }
                });
            }
        }
    };
};
