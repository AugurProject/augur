/**
 * Connect to the Ethereum network.
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var async = require("async");
var rpc = require("ethrpc");
var contracts = require("augur-contracts");
var Tx = require("./tx");

var network_id = "7";
var init_contracts = contracts[network_id];

function is_function(f) {
    return Object.prototype.toString.call(f) === "[object Function]";
}

function clone(obj) {
    if (null === obj || "object" !== typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

module.exports = {

    debug: false,

    from: null,

    coinbase: null,

    connection: null,

    rpc: rpc,

    network_id: network_id,

    contracts: contracts[network_id],

    init_contracts: contracts[network_id],

    tx: new Tx(network_id),

    urlstring: function (obj) {
        var port = (obj.port) ? ":" + obj.port : "";
        return (obj.protocol || "http") + "://" + (obj.host || "127.0.0.1") + port;
    },

    has_value: function (o, v) {
        for (var p in o) {
            if (o.hasOwnProperty(p)) {
                if (o[p] === v) return p;
            }
        }
    },

    default_rpc: function () {
        this.rpc.reset();
        this.rpc.useHostedNode();
        return false;
    },

    detect_network: function (callback) {
        var self = this;
        if (this.connection === null &&
            JSON.stringify(this.init_contracts) === JSON.stringify(this.contracts))
        {
            if (is_function(callback)) {
                this.rpc.version(function (version) {
                    var key;
                    if (version !== null && version !== undefined && !version.error) {
                        self.network_id = version;
                        self.tx = new Tx(version);
                        self.contracts = clone(contracts[self.network_id]);
                        for (var method in self.tx) {
                            if (!self.tx.hasOwnProperty(method)) continue;
                            key = self.has_value(self.init_contracts, self.tx[method].to);
                            if (key) self.tx[method].to = self.contracts[key];
                        }
                    }
                    if (is_function(callback)) callback(null, version);
                });
            } else {
                var key, method;
                this.network_id = this.rpc.version() || "7";
                this.tx = new Tx(this.network_id);
                this.contracts = clone(contracts[this.network_id]);
                for (method in this.tx) {
                    if (!this.tx.hasOwnProperty(method)) continue;
                    key = this.has_value(this.init_contracts, this.tx[method].to);
                    if (key) this.tx[method].to = this.contracts[key];
                }
                return this.network_id;
            }
        } else {
            if (is_function(callback)) callback();
        }
    },

    from_field_tx: function (account) {
        if (account && account !== "0x") {
            for (var method in this.tx) {
                if (!this.tx.hasOwnProperty(method)) continue;
                this.tx[method].from = account;
            }
        }
    },

    get_coinbase: function (callback) {
        var self = this;
        if (is_function(callback)) {
            this.rpc.coinbase(function (coinbase) {
                if (coinbase && !coinbase.error) {
                    self.coinbase = coinbase;
                    self.from = self.from || coinbase;
                    self.from_field_tx(self.from);
                    if (callback) return callback(null, coinbase);
                }
                if (!self.coinbase && (self.rpc.nodes.local || self.rpc.ipcpath)) {
                    self.rpc.accounts(function (accounts) {
                        if (accounts && accounts.constructor === Array && accounts.length) {
                            async.eachSeries(accounts, function (account, nextAccount) {
                                if (self.unlocked(account)) {
                                    return nextAccount(account);
                                }
                                nextAccount();
                            }, function (account) {
                                if (account) {
                                    self.coinbase = account;
                                    self.from = self.from || account;
                                    self.from_field_tx(self.from);
                                    if (callback) callback(null, account);
                                }
                            });
                        }
                    });
                }
            });
        } else {
            var accounts, num_accounts, i, method, m;
            this.coinbase = this.rpc.coinbase();
            if (!this.coinbase && this.rpc.nodes.local) {
                accounts = this.rpc.accounts();
                if (accounts && accounts.constructor === Array) {
                    num_accounts = accounts.length;
                    if (num_accounts === 1) {
                        if (this.unlocked(accounts[0])) {
                            this.coinbase = accounts[0];
                        }
                    } else {
                        for (i = 0; i < num_accounts; ++i) {
                            if (this.unlocked(accounts[i])) {
                                this.coinbase = accounts[i];
                                break;
                            }
                        }
                    }
                }
            }
            if (this.coinbase && this.coinbase !== "0x") {
                this.from = this.from || this.coinbase;
                for (method in this.tx) {
                    if (!this.tx.hasOwnProperty(method)) continue;
                    if (!this.tx[method].method) {
                        for (m in this.tx[method]) {
                            if (!this.tx[method].hasOwnProperty(m)) continue;
                            this.tx[method][m].from = this.from;
                        }
                    } else {
                        this.tx[method].from = this.from;
                    }
                }
            } else {
                return this.default_rpc();
            }
        }
    },

    update_contracts: function () {
        var key;
        if (JSON.stringify(this.init_contracts) !== JSON.stringify(this.contracts)) {
            for (var method in this.tx) {
                if (!this.tx.hasOwnProperty(method)) continue;
                if (!this.tx[method].method) {
                    for (var m in this.tx[method]) {
                        if (!this.tx[method].hasOwnProperty(m)) continue;
                        key = this.has_value(this.init_contracts, this.tx[method][m].to);
                        if (key) {
                            this.tx[method][m].to = this.contracts[key];
                        }
                    }
                } else {
                    key = this.has_value(this.init_contracts, this.tx[method].to);
                    if (key) {
                        this.tx[method].to = this.contracts[key];
                    }
                }
            }
        }
        this.init_contracts = clone(this.contracts);
    },

    parse_rpcinfo: function (rpcinfo) {
        var rpcstr, rpc_obj = {};
        if (rpcinfo.constructor === Object) {
            if (rpcinfo.protocol) rpc_obj.protocol = rpcinfo.protocol;
            if (rpcinfo.host) rpc_obj.host = rpcinfo.host;
            if (rpcinfo.port) {
                rpc_obj.port = rpcinfo.port;
            } else {
                if (rpcinfo.host) {
                    rpcstr = rpcinfo.host.split(":");
                    if (rpcstr.length === 2) {
                        rpc_obj.host = rpcstr[0];
                        rpc_obj.port = rpcstr[1];
                    }
                }
            }
        } else if (rpcinfo.constructor === String) {
            if (rpcinfo.indexOf("://") === -1 && rpcinfo.indexOf(':') === -1) {
                rpc_obj.host = rpcinfo;
            } else if (rpcinfo.indexOf("://") > -1) {
                rpcstr = rpcinfo.split("://");
                rpc_obj.protocol = rpcstr[0];
                rpcstr = rpcstr[1].split(':');
                if (rpcstr.length === 2) {
                    rpc_obj.host = rpcstr[0];
                    rpc_obj.port = rpcstr[1];
                } else {
                    rpc_obj.host = rpcstr;
                }
            } else if (rpcinfo.indexOf(':') > -1) {
                rpcstr = rpcinfo.split(':');
                if (rpcstr.length === 2) {
                    rpc_obj.host = rpcstr[0];
                    rpc_obj.port = rpcstr[1];
                } else {
                    rpc_obj.host = rpcstr;
                }
            } else {
                return this.default_rpc();
            }
        }
        return this.urlstring(rpc_obj);
    },

    connect: function (rpcinfo, ipcpath, callback) {
        var localnode, self = this;
        if (rpcinfo) {
            localnode = this.parse_rpcinfo(rpcinfo);
            if (localnode) {
                this.rpc.setLocalNode(localnode);
                this.rpc.balancer = false;
            } else {
                this.rpc.useHostedNode();
                this.rpc.balancer = true;
            }
        } else {
            this.rpc.useHostedNode();
            this.rpc.balancer = true;
        }
        if (ipcpath) {
            this.rpc.balancer = false;
            this.rpc.ipcpath = ipcpath;
            if (rpcinfo) {
                localnode = this.parse_rpcinfo(rpcinfo);
                if (localnode) this.rpc.nodes.local = localnode;
            } else {
                this.rpc.nodes.local = "http://127.0.0.1:8545";
            }
        } else {
            this.rpc.ipcpath = null;
        }
        if (is_function(callback)) {
            async.series([
                this.detect_network.bind(this),
                this.get_coinbase.bind(this)
            ], function (err) {
                if (err && self.debug) console.error("connect error:", err);
                self.update_contracts();
                self.connection = true;
                callback(true);
            });
        } else {
            try {
                this.detect_network();
                this.get_coinbase();
                this.update_contracts();
                this.connection = true;
                return true;
            } catch (exc) {
                if (this.debug) console.error(exc);
                this.default_rpc();
                return this.connect();
            }
        }
    },

    connected: function (f) {
        if (is_function(f)) {
            return this.rpc.coinbase(function (coinbase) {
                f(coinbase && !coinbase.error);
            });
        }
        try {
            this.rpc.coinbase();
            return true;
        } catch (e) {
            return false;
        }
    }

};
