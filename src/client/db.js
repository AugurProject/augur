/**
 * Database methods
 */

"use strict";

var Firebase = require("firebase");
var errors = require("../errors");
var constants = require("../constants");

module.exports = {

    encode: function (str) {
        return encodeURIComponent(encodeURIComponent(str)).replace(/\./g, "%252E").toString();
    },

    // Firebase read and write methods
    put: function (handle, data, callback) {
        var url = constants.FIREBASE_URL + this.encode(handle);
        try {
            new Firebase(url).set(data);
            if (callback) callback(url);
        } catch (e) {
            if (!callback) return errors.DB_WRITE_FAILED;
            callback(errors.DB_WRITE_FAILED);
        }
    },

    get: function (handle, callback) {
        try {
            if (handle !== undefined && callback && callback.constructor === Function) {
                var ref = new Firebase(constants.FIREBASE_URL + "/" + this.encode(handle));
                ref.once("value", function (data) {
                    callback(data.val());
                });
            } else {
                if (!callback) return errors.DB_READ_FAILED;
                callback(errors.DB_READ_FAILED);
            }
        } catch (e) {
            if (!callback) return errors.DB_READ_FAILED;
            callback(errors.DB_READ_FAILED);
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
