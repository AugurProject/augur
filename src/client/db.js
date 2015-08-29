/**
 * Database methods
 */

"use strict";

var Firebase = require("firebase");
var errors = require("../errors");
var constants = require("../constants");

module.exports = {

    // Firebase read and write methods
    put: function (handle, data, callback) {
        var url = constants.FIREBASE_URL + "/" + handle;
        try {
            new Firebase(url).set(data);
            if (callback) callback(url);
        } catch (e) {
            if (callback) {
                callback(errors.DB_WRITE_FAILED);
            } else {
                return errors.DB_WRITE_FAILED;
            }
        }
    },

    get: function (handle, callback) {
        try {
            if (handle !== undefined && callback && callback.constructor === Function) {
                var ref = new Firebase(constants.FIREBASE_URL + "/" + handle);
                ref.once("value", function (data) {
                    var account = data.val();
                    if (account && account.handle) {
                        callback(account);
                    } else {
                        callback(errors.DB_READ_FAILED);
                    }
                });
            } else {
                if (callback) {
                    callback(errors.DB_READ_FAILED);
                } else {
                    return errors.DB_READ_FAILED;
                }
            }
        } catch (e) {
            if (callback) {
                callback(errors.DB_READ_FAILED);
            } else {
                return errors.DB_READ_FAILED;
            }
        }
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
                if (f) {
                    f(errors.DB_WRITE_FAILED);
                } else {
                    return errors.DB_WRITE_FAILED;
                }
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
                        if (!record.error) {
                            f(JSON.parse(record));
                        } else {
                            f(errors.BAD_CREDENTIALS);
                        }
                    });
                } else {
                    var record = rpc.broadcast(rpc.marshal(
                        "getString",
                        [label, handle],
                        "db_"
                    ));
                    if (!record.error) {
                        return JSON.parse(record);
                    } else {
                        return errors.BAD_CREDENTIALS;
                    }
                }
            } catch (e) {
                if (f) {
                    f(errors.DB_READ_FAILED);
                } else {
                    return errors.DB_READ_FAILED;
                }
            }
        } // get
    
    } // leveldb
};
