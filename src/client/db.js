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

    put: function (label, keystore, cb) {
        if (label !== null && label !== undefined && label !== '' && keystore) {
            label = encodeURIComponent(label);
            var item = JSON.stringify(keystore);
            localStorage.setItem(label, item);
            if (utils.is_function(cb)) cb(true);
            return true;
        } else {
            var err = errors.DB_WRITE_FAILED;
            err.bubble = {label: label, keystore: keystore};
            if (!utils.is_function(cb)) return err;
            cb(err);
        }
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
            label = encodeURIComponent(label);
            item = localStorage.getItem(label);
            if (item !== null) {
                try {
                    item = JSON.parse(item);
                    if (item && item.constructor === Object && item.crypto) {
                        if (!utils.is_function(cb)) return item;
                        return cb(item);
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

    putPersistent: function (account) {
        if (!account || !account.privateKey) return errors.DB_WRITE_FAILED;
        var persist = abi.copy(account);
        if (Buffer.isBuffer(account.privateKey)) {
            persist.privateKey = abi.hex(account.privateKey, true);
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
            localStorage.removeItem(label);
        }
        return true;
    }

};
