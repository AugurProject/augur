/**
 * Database methods
 */

"use strict";

var abi = require("augur-abi");
var errors = require("../errors");
var constants = require("../constants");
var utils = require("../utilities");

module.exports = function () {

    var augur = this;

    return {

        put: function (label, data, callback) {
            if (label !== null && label !== undefined && label !== '' && data) {
                var noop = function () {};
                var tx = abi.copy(augur.tx.accounts.register);
                tx.params = [
                    abi.prefix_hex(utils.sha256(label)),
                    data.privateKey,
                    data.iv,
                    data.salt,
                    data.mac,
                    data.id
                ];
                return augur.transact(tx, noop, function (res) {
                    if (res && res.callReturn) {
                        return callback(res.callReturn);
                    }
                    return callback(errors.DB_WRITE_FAILED);
                }, callback);
            }
            if (!utils.is_function(callback)) return errors.DB_WRITE_FAILED;
            callback(errors.DB_WRITE_FAILED);
        },

        get: function (label, callback) {
            if (label && label !== '') {
                var tx = abi.copy(augur.tx.accounts.getAccount);
                tx.params = abi.prefix_hex(utils.sha256(label));
                if (utils.is_function(callback)) {
                    return augur.fire(tx, function (account) {
                        if (account && account.length) {
                            for (var i = 0, len = account.length; i < len; ++i) {
                                if (parseInt(account[i]) === 0) {
                                    return callback(errors.DB_READ_FAILED);
                                }
                            }
                            return callback({
                                handle: label,
                                privateKey: new Buffer(abi.unfork(account[0]), "hex"),
                                iv: new Buffer(abi.strip_0x(account[1]), "hex"),
                                salt: new Buffer(abi.unfork(account[2]), "hex"),
                                mac: new Buffer(abi.unfork(account[3]), "hex"),
                                id: new Buffer(abi.strip_0x(account[4]), "hex")
                            });
                        }
                        callback(errors.DB_READ_FAILED);
                    });
                }
                var account = augur.fire(tx);
                if (account && account.length) {
                    account.handle = label;
                    for (var i = 0, len = account.length; i < len; ++i) {
                        if (parseInt(account[i]) === 0) {
                            return callback(errors.DB_READ_FAILED);
                        }
                    }
                    return {
                        handle: label,
                        privateKey: new Buffer(abi.unfork(account[0]), "hex"),
                        iv: new Buffer(abi.strip_0x(account[1]), "hex"),
                        salt: new Buffer(abi.unfork(account[2]), "hex"),
                        mac: new Buffer(abi.unfork(account[3]), "hex"),
                        id: new Buffer(abi.strip_0x(account[4]), "hex")
                    };
                }
                return errors.DB_READ_FAILED;
            }
            if (!utils.is_function(callback)) return errors.DB_READ_FAILED;
            callback(errors.DB_READ_FAILED);
        },

        // Read and write methods for Ethereum's LevelDB (deprecated)
        leveldb: {

            put: function (rpc, handle, data, label, f) {
                try {
                    return rpc.broadcast(rpc.marshal(
                        "putString",
                        [label, handle, JSON.stringify(data)],
                        "db_"
                    ), f);
                } catch (e) {
                    if (!f) return errors.DB_WRITE_FAILED;
                    f(errors.DB_WRITE_FAILED);
                }
            }, // put

            get: function (rpc, handle, label, f) {
                try {
                    if (f) {
                        rpc.broadcast(rpc.marshal(
                            "getString",
                            [label, handle],
                            "db_"
                        ), function (record) {
                            if (record) {
                                if (!record.error) {
                                    return f(JSON.parse(record));
                                } else if (record.error === -32603) {
                                    return f('');
                                } else {
                                    f(record);
                                }
                            }
                        });
                    } else {
                        var record = rpc.broadcast(rpc.marshal(
                            "getString",
                            [label, handle],
                            "db_"
                        ));
                        if (record) {
                            if (!record.error) {
                                return JSON.parse(record);
                            } else if (record.error === -32603) {
                                return '';
                            } else {
                                return record;
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                    if (!f) return errors.DB_READ_FAILED;
                    f(errors.DB_READ_FAILED);
                }
            } // get
        
        } // leveldb
    };
};
