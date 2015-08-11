/**
 * Client-side accounts / transactions
 */

"use strict";

var BigNumber = require("bignumber.js");
var ethTx = require("ethereumjs-tx");
var keythereum = require("keythereum");
var errors = require("../errors");
var constants = require("../constants");
var utils = require("../utilities");
var numeric = require("../core/numeric");
var log = console.log;

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

module.exports = function (augur) {

    return {

        // The account object is set when logged in
        account: {},

        register: function (handle, password, callback) {
            var self = this;
            augur.db.get(handle, function (record) {
                if (record.error) {

                    // generate ECDSA private key and initialization vector
                    keythereum.create(function (plain) {

                        // derive secret key from password
                        keythereum.deriveKey(password, plain.salt, function (derivedKey) {

                            // encrypt private key using derived key and IV, then
                            // store encrypted key & IV, indexed by handle
                            // TODO store mac + uuid
                            augur.db.put(handle, {
                                handle: handle,
                                privateKey: keythereum.encrypt(
                                    plain.privateKey,
                                    derivedKey.slice(0, 16),
                                    plain.iv
                                ),
                                iv: plain.iv.toString("base64"),
                                salt: plain.salt.toString("base64"),
                                nonce: 0
                            }, function () {

                                // set web.account object
                                self.account = {
                                    handle: handle,
                                    privateKey: plain.privateKey,
                                    address: keythereum.privateKeyToAddress(plain.privateKey),
                                    nonce: 0
                                };

                                if (callback) callback(self.account);

                            }); // db.put

                        }); // deriveKey

                    }); // create

                } else {
                    if (callback) callback(errors.HANDLE_TAKEN);
                }

            }); // db.get
        },

        login: function (handle, password, callback) {
            var self = this;

            // retrieve account info from database
            augur.db.get(handle, function (storedInfo) {

                if (!storedInfo.error) {

                    var iv = new Buffer(storedInfo.iv, "base64");
                    var salt = new Buffer(storedInfo.salt, "base64");

                    // derive secret key from password
                    keythereum.deriveKey(password, salt, function (derivedKey) {
                        try {

                            // decrypt stored private key using secret key
                            var privateKey = new Buffer(keythereum.decrypt(
                                storedInfo.privateKey,
                                derivedKey.slice(0, 16),
                                iv
                            ), "hex");

                            // while logged in, web.account object is set
                            self.account = {
                                handle: handle,
                                privateKey: privateKey,
                                address: keythereum.privateKeyToAddress(privateKey),
                                nonce: storedInfo.nonce
                            };

                            if (callback) callback(self.account);
                        
                        // decryption failure: bad password
                        } catch (e) {
                            if (callback) callback(errors.BAD_CREDENTIALS);
                        }
                    
                    }); // deriveKey

                // handle not found
                } else {
                    if (callback) callback(errors.BAD_CREDENTIALS);
                }

            }); // db.get
        },

        logout: function () {
            this.account = {};
        },

        // Handle-to-handle payment methods (send ether/cash/rep without needing address)
        // TODO decide if we should store addresses for users
        // (maybe an opt-in system is best?)

        // sendEther: function (toHandle, value, onSent, onSuccess, onFailed) {
        //     var self = this;
        //     if (this.account.address) {
        //         augur.db.get(toHandle, function (toAccount) {
        //             if (toAccount && toAccount.address) {
        //                 self.transact({
        //                     value: value,
        //                     from: self.account.address,
        //                     to: toAccount.address
        //                 }, onSent, onSuccess, onFailed);
        //             } else {
        //                 if (onFailed) onFailed(errors.TRANSACTION_FAILED);
        //             }
        //         });
        //     }
        // },

        // sendCash: function (toHandle, value, onSent, onSuccess, onFailed) {
        //     var self = this;
        //     if (this.account.address) {
        //         augur.db.get(toHandle, function (toAccount) {
        //             if (!toAccount.error) {
        //                 var tx = utils.copy(augur.tx.sendCash);
        //                 tx.params = [toAccount.address, numeric.fix(value)];
        //                 log(tx);
        //                 return self.transact(tx, onSent, onSuccess, onFailed);
        //             } else {
        //                 if (onFailed) onFailed(errors.TRANSACTION_FAILED);
        //             }
        //         });
        //     }
        // },

        // sendReputation: function (toHandle, value, onSent, onSuccess, onFailed) {
        //     var self = this;
        //     if (this.account.address) {
        //         augur.db.get(toHandle, function (toAccount) {
        //             if (!toAccount.error) {
        //                 var tx = utils.copy(augur.tx.sendReputation);
        //                 tx.params = [toAccount.address, numeric.fix(value)];
        //                 return self.transact(tx, onSent, onSuccess, onFailed);
        //             } else {
        //                 if (onFailed) onFailed(errors.TRANSACTION_FAILED);
        //             }
        //         });
        //     }
        // },

        invoke: function (itx, callback) {
            var self = this;
            var tx, data_abi, packaged;
            if (this.account.address) {

                // client-side transactions only needed for sendTransactions
                if (itx.send) {
                    if (this.account.privateKey && itx && itx.constructor === Object) {

                        // parse and serialize transaction parameters
                        tx = utils.copy(itx);
                        if (tx.params !== undefined) {
                            if (tx.params.constructor === Array) {
                                for (var i = 0, len = tx.params.length; i < len; ++i) {
                                    if (tx.params[i] !== undefined &&
                                        tx.params[i].constructor === BigNumber) {
                                        tx.params[i] = tx.params[i].toFixed();
                                    }
                                }
                            } else if (tx.params.constructor === BigNumber) {
                                tx.params = tx.params.toFixed();
                            }
                        }
                        if (tx.to) tx.to = numeric.prefix_hex(tx.to);
                        data_abi = augur.abi.encode(tx);

                        // package up the transaction and submit it to the network
                        packaged = new ethTx({
                            to: tx.to,
                            from: this.account.address,
                            gasPrice: (tx.gasPrice) ? tx.gasPrice : augur.gasPrice(),
                            gasLimit: (tx.gas) ? tx.gas : constants.DEFAULT_GAS,
                            nonce: this.account.nonce,
                            value: tx.value || "0x0",
                            data: data_abi
                        });

                        // sign, validate, and send the transaction
                        packaged.sign(this.account.privateKey);
                        if (packaged.validate()) {

                            return augur.sendRawTx(
                                packaged.serialize().toString("hex"),
                                function (r) {

                                    // increment nonce and write to database
                                    augur.db.get(self.account.handle, function (stored) {
                                        stored.nonce = ++self.account.nonce;
                                        augur.db.put(self.account.handle, stored);
                                    });

                                    if (callback) callback(r);
                                }
                            );

                        // transaction validation failed
                        } else {
                            return errors.TRANSACTION_INVALID;
                        }
                    } else {
                        return errors.TRANSACTION_FAILED;
                    }

                // if this is just a call, use the regular invoke method
                } else {
                    return augur.invoke(itx, callback);
                }
            
            // not logged in
            } else {
                if (itx.send) {
                    return errors.NOT_LOGGED_IN;
                } else {
                    return augur.invoke(itx, callback);
                }
            }
        }

        // transact: function (tx, onSent, onSuccess, onFailed) {
        //     var returns = tx.returns;
        //     delete tx.returns;
        //     tx.send = true;
        //     this.invoke(tx, function (txhash) {
        //         augur.confirmTx(tx, txhash, returns, onSent, onSuccess, onFailed);
        //     });
        // }
    };
};
