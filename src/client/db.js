/**
 * Database methods
 */

"use strict";

var multihash = require("multi-hash");
var abi = require("augur-abi");
var Firebase = require("firebase");
var ipfs = require("ipfs-api")("localhost", "5001");
var errors = require("../errors");
var constants = require("../constants");
var utils = require("../utilities");

module.exports = function () {

    var augur = this;

    return {

        contract: {

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
                                    privateKey: account[0],
                                    iv: account[1],
                                    salt: account[2],
                                    mac: account[3],
                                    id: account[4]
                                });
                            }
                            callback(errors.DB_READ_FAILED);
                        });
                    }
                    var account = augur.fire(tx);
                    var accountObj = {};
                    if (account && account.length) {
                        account.handle = label;
                        for (var i = 0, len = account.length; i < len; ++i) {
                            if (parseInt(account[i]) === 0) {
                                return callback(errors.DB_READ_FAILED);
                            }
                        }
                        return {
                            handle: label,
                            privateKey: account[0],
                            iv: account[1],
                            salt: account[2],
                            mac: account[3],
                            id: account[4]
                        };
                    }
                    return errors.DB_READ_FAILED;
                }
                if (!utils.is_function(callback)) return errors.DB_READ_FAILED;
                callback(errors.DB_READ_FAILED);
            }

        },

        ipfs: {

            setHash: function (name, hash, onSent, onSuccess, onFailed) {
                if (name.constructor === Object && name.name && name.hash) {
                    hash = name.hash;
                    if (name.onSent) onSent = name.onSent;
                    if (name.onSuccess) onSuccess = name.onSuccess;
                    if (name.onFailed) onFailed = name.onFailed;
                    name = name.name;
                }
                var tx = utils.copy(augur.tx.ipfs.setHash);
                tx.params = [name, abi.hex(multihash.decode(hash))];
                return augur.transact(tx, onSent, onSuccess, onFailed);
            },

            getHash: function (name, callback) {
                var self = this;
                var tx = utils.copy(augur.tx.ipfs.getHash);
                tx.params = name;
                if (!utils.is_function(callback)) {
                    var hash = augur.fire(tx);
                    if (!hash || hash.error || !parseInt(hash)) throw hash;
                    return multihash.encode(abi.unfork(hash));
                }
                augur.fire(tx, function (hash) {
                    if (!hash || hash.error || !parseInt(hash)) {
                        return callback(hash);
                    }
                    callback(multihash.encode(abi.unfork(hash)));
                });
            },

            put: function (label, data, callback) {
                var self = this;
                if (label && label !== '' && data && utils.is_function(callback)) {
                    if (data.constructor === Object) data = JSON.stringify(data);
                    ipfs.add(new Buffer(data, "utf8"), function (err, file) {
                        if (err || !file) return callback(err);
                        if (file.constructor === Array) {
                            file.forEach(function (f) {
                                self.setHash({
                                    name: abi.prefix_hex(utils.sha256(label)),
                                    hash: f.Hash,
                                    onSent: function () {},
                                    onSuccess: function (res) {
                                        callback(f.Hash);
                                    },
                                    onFailed: callback
                                });
                            });
                        } else {
                            self.setHash({
                                name: abi.prefix_hex(utils.sha256(label)),
                                hash: file.Hash,
                                onSent: function () {},
                                onSuccess: function (res) {
                                    callback(file.Hash);
                                },
                                onFailed: callback
                            });
                        }
                    });
                } else {
                    if (!utils.is_function(callback)) return errors.DB_WRITE_FAILED;
                    callback(errors.DB_WRITE_FAILED);                    
                }
            },

            get: function (label, callback) {
                if (label && label !== '' && utils.is_function(callback)) {
                    this.getHash(abi.prefix_hex(utils.sha256(label)), function (ipfsHash) {
                        if (!ipfsHash || ipfsHash.error) {
                            return callback(ipfsHash);
                        } else if (ipfsHash === "0x0") {
                            return callback(null);
                        }
                        var ipfsData = "";
                        ipfs.cat(ipfsHash, function (err, res) {
                            if (err || !res) return callback(err);
                            res.on("data", function (chunk) {
                                ipfsData += chunk.toString();
                            });
                            res.on("end", function () {
                                try {
                                    callback(JSON.parse(ipfsData));
                                } catch (ex) {
                                    if (ipfsData === "") return callback(ex);
                                    callback(ipfsData);
                                }
                            });
                        });
                    });
                } else {
                    if (!utils.is_function(callback)) return errors.DB_READ_FAILED;
                    callback(errors.DB_READ_FAILED);
                }
            }

        },

        // Firebase read and write methods (deprecated)
        firebase: {

            encode: function (str) {
                return encodeURIComponent(encodeURIComponent(str)).replace(/\./g, "%252E").toString();
            },

            put: function (label, data, callback) {
                if (label !== null && label !== undefined && label !== '' && data) {
                    var url = constants.FIREBASE_URL + this.encode(label);
                    try {
                        new Firebase(url).set(data);
                        if (callback) callback(url);
                    } catch (e) {
                        if (!callback) return errors.DB_WRITE_FAILED;
                        callback(errors.DB_WRITE_FAILED);
                    }
                } else {
                    if (!callback) return errors.DB_WRITE_FAILED;
                    callback(errors.DB_WRITE_FAILED);
                }
            },

            get: function (label, callback) {
                try {
                    if (label && label !== '' && utils.is_function(callback)) {
                        var ref = new Firebase(constants.FIREBASE_URL + "/" + this.encode(label));
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
};
