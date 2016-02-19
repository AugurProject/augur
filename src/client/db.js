/* global localStorage:true */
/**
 * Locally stored account info.
 */

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var clone = require("clone");
var abi = require("augur-abi");
var keys = require("keythereum");
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
}
var errors = require("augur-contracts").errors;
var constants = require("../constants");
var utils = require("../utilities");

module.exports = {

    put: function (label, data, cb) {
        if (label !== null && label !== undefined && label !== '' && data) {
            var account = {
                label: abi.prefix_hex(utils.sha256(label)),
                ciphertext: data.ciphertext,
                iv: abi.pad_left(data.iv, 32, true),
                mac: data.mac,
                cipher: data.cipher,
                kdf: data.kdf,
                kdfparams: data.kdfparams,
                id: abi.pad_left(data.id, 32, true)
            };
            localStorage.setItem(account.label, JSON.stringify(account));
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
            if (label === '') {
                account = localStorage.getItem('');
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
                    if (item && item.constructor === Object && item.ciphertext) {
                        account = {
                            handle: label,
                            cipher: item.cipher,
                            ciphertext: new Buffer(abi.unfork(item.ciphertext), "hex"),
                            iv: new Buffer(abi.pad_left(item.iv, 32), "hex"),
                            kdf: item.kdf,
                            kdfparams: {
                                c: parseInt(item.kdfparams.c),
                                dklen: parseInt(item.kdfparams.dklen),
                                salt: new Buffer(abi.unfork(item.kdfparams.salt), "hex"),
                                prf: item.kdfparams.prf
                            },
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
        if (!data || !data.privateKey) return errors.DB_WRITE_FAILED;
        var persist = abi.copy(data);
        if (Buffer.isBuffer(data.privateKey)) {
            persist.privateKey = abi.hex(data.privateKey, true);
        }
        localStorage.setItem('', JSON.stringify(persist));
        return true;
    },

    getPersistent: function () {
        var account = localStorage.getItem('');
        if (account === null) return null;
        account = JSON.parse(account);
        account.privateKey = new Buffer(abi.unfork(account.privateKey), "hex");
        return account;
    },

    removePersistent: function () {
        return this.remove('');
    },

    remove: function (label) {
        if (label === '') {
            localStorage.removeItem('');
        } else {
            localStorage.removeItem(abi.prefix_hex(utils.sha256(label)));
        }
        return true;
    }

};
