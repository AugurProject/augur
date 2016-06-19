/**
 * Ethereum network connection / contract lookup
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var connector = require("ethereumjs-connect");
var constants = require("../constants");
var utils = require("../utilities");

module.exports = {

    sync: function (connector) {
        if (connector && connector.constructor === Object) {
            this.network_id = connector.network_id;
            this.from = connector.from;
            this.coinbase = connector.coinbase;
            this.tx = connector.tx;
            this.contracts = connector.contracts;
            this.init_contracts = connector.init_contracts;
            return true;
        }
        return false;
    },

    updateContracts: function (newContracts) {
        if (connector && connector.constructor === Object) {
            connector.contracts = clone(newContracts);
            connector.update_contracts();
            return this.sync(connector);
        }
        return false;
    },

    /** 
     * @param rpcinfo {Object|string=} Two forms accepted:
     *    1. Object with connection info fields:
     *       { http: "https://eth3.augur.net",
     *         ipc: "/path/to/geth.ipc",
     *         ws: "wss://ws.augur.net" }
     *    2. URL string for HTTP RPC: "https://eth3.augur.net"
     * @param ipcpath {string=} Local IPC path, if not provided in rpcinfo object.
     * @param cb {function=} Callback function.
     */
    connect: function (rpcinfo, ipcpath, cb) {
        var options = {};
        if (rpcinfo) {
            switch (rpcinfo.constructor) {
            case String:
                options.http = rpcinfo;
                break;
            case Function:
                cb = rpcinfo;
                options.http = null;
                break;
            case Object:
                options = rpcinfo;
                break;
            default:
                options.http = null;
            }
        }
        if (ipcpath) {
            switch (ipcpath.constructor) {
            case String:
                options.ipc = ipcpath;
                break;
            case Function:
                if (!cb) {
                    cb = ipcpath;
                    options.ipc = null;
                }
                break;
            default:
                options.ipc = null;
            }
        }
        if (!utils.is_function(cb)) {
            var connection = connector.connect(options);
            this.sync(connector);
            return connection;
        }
        var self = this;
        connector.connect(options, function (connection) {
            self.sync(connector);
            cb(connection);
        });
    }
};
