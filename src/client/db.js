/**
 * Database methods
 */

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var abi = require("augur-abi");
var keys = require("keythereum");
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
}
var errors = require("augur-contracts").errors;
var constants = require("../constants");
var utils = require("../utilities");

var PERSISTENT_LOGIN = (NODE_JS) ? " " : "";

module.exports = {

    put: function (label, data, cb) {
        if (label !== null && label !== undefined && label !== '' && data) {
            var account = {
                label: abi.prefix_hex(utils.sha256(label)),
                privateKey: data.encryptedPrivateKey,
                iv: abi.pad_left(data.iv, 32, true),
                salt: data.salt,
                mac: data.mac,
                id: abi.pad_left(data.id, 32, true)
            };
            localStorage.setItem(account.label, JSON.stringify(account));
            if (data.persist) {
                this.putPersistent({
                    handle: label,
                    privateKey: data.privateKey,
                    address: data.address
                });
            }
            if (!utils.is_function(cb)) return true;
            return cb(true);
        }
        var err = errors.DB_WRITE_FAILED;
        err.bubble = {label: label, data: data};
        if (!utils.is_function(cb)) return err;
        cb(err);
    },

    get: function (label, cb) {
        var account, item, err = errors.DB_READ_FAILED;
        if (label !== null && label !== undefined) {
            if (label === PERSISTENT_LOGIN) {
                account = localStorage.getItem(PERSISTENT_LOGIN);
                if (account === null) {
                    if (!utils.is_function(cb)) return err;
                    return cb(err);
                }
                try {
                    account = JSON.parse(account);
                    account.privateKey = new Buffer(abi.unfork(account.privateKey), "hex");
                    if (!utils.is_function(cb)) return account;
                    return cb(account);
                } catch (exc) {
                    err.bubble = {exception: exc, label: label};
                    if (!utils.is_function(cb)) return err;
                    return cb(err);
                }
            }
            item = localStorage.getItem(abi.prefix_hex(utils.sha256(label)));
            if (item !== null) {
                try {
                    item = JSON.parse(item);
                    if (item && item.constructor === Object && item.privateKey) {
                        account = {
                            handle: label,
                            privateKey: new Buffer(abi.unfork(item.privateKey), "hex"),
                            iv: new Buffer(abi.pad_left(item.iv, 32), "hex"),
                            salt: new Buffer(abi.unfork(item.salt), "hex"),
                            mac: new Buffer(abi.unfork(item.mac), "hex"),
                            id: new Buffer(abi.pad_left(item.id, 32), "hex")
                        };
                        if (!utils.is_function(cb)) return account;
                        return cb(account);
                    }
                    err.bubble = {item: item, label: label};
                    if (!utils.is_function(cb)) return err;
                    return cb(err);
                } catch (exc) {
                    err.bubble = {exception: exc, label: label};
                    if (!utils.is_function(cb)) return err;
                    return cb(err);
                }
            }
            err.bubble = {label: label};
            if (!utils.is_function(cb)) return err;
            return cb(err);
        }
        err.bubble = {label: label};
        if (!utils.is_function(cb)) return err;
        cb(err);
    },

    putPersistent: function (data) {
        if (!data || !data.privateKey) return error.DB_WRITE_FAILED;
        if (Buffer.isBuffer(data.privateKey)) {
            data.privateKey = abi.hex(data.privateKey, true);
        }
        localStorage.setItem(PERSISTENT_LOGIN, JSON.stringify(data));
        return true;
    },

    getPersistent: function () {
        var account = localStorage.getItem(PERSISTENT_LOGIN);
        if (account === null) return null;
        account = JSON.parse(account);
        account.privateKey = new Buffer(abi.unfork(account.privateKey), "hex");
        return account;
    },

    removePersistent: function () {
        return this.remove(PERSISTENT_LOGIN);
    },

    remove: function (label) {
        if (label === PERSISTENT_LOGIN) {
            localStorage.removeItem(PERSISTENT_LOGIN);
        } else {
            localStorage.removeItem(abi.prefix_hex(utils.sha256(label)));
        }
        return true;
    }

};
