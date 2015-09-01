/**
 * Client-side accounts
 */

"use strict";

var BigNumber = require("bignumber.js");
var ethTx = require("ethereumjs-tx");
var keythereum = require("keythereum");
var uuid = require("node-uuid");
var abi = require("augur-abi");
var db = require("./db");
var errors = require("../errors");
var constants = require("../constants");
var utils = require("../utilities");
var log = console.log;

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

keythereum.constants.pbkdf2.c = 10000;
keythereum.constants.scrypt.n = 10000;

module.exports = function (augur) {

    return {

        // The account object is set when logged in
        account: {},

        // free (testnet) ether for new accounts on registration
        fund: function (account, callback, onConfirm) {
            var count = 0;
            augur.rpc.sendEther(
                account.address,
                constants.FREEBIE / 2,
                augur.coinbase,
                function (r) {
                    // sent
                    // log("sent:", r);
                    if (callback) callback(account);
                    augur.rpc.sendEther(
                        account.address,
                        constants.FREEBIE / 2,
                        augur.coinbase,
                        function (r) {
                            // sent
                        },
                        function (r) {
                            // success
                            if (onConfirm && !(count++)) onConfirm(account);
                        },
                        function (r) {
                            // failed
                            r.which = 2;
                            if (onConfirm && !(count++)) {
                                onConfirm(r);
                            } else {
                                log("account.fund failed:", r);
                            }
                        }
                    );
                },
                function (r) {
                    // success
                    if (onConfirm && !(count++)) onConfirm(account);
                },
                function (r) {
                    // failed
                    r.which = 1;
                    if (onConfirm && !(count++)) {
                        onConfirm(r);
                    } else {
                        log("account.fund failed:", r);
                    }
                }
            );
        },

        register: function (handle, password, callback) {
            var self = this;
            db.get(handle, function (record) {
                if (record.error) {

                    // generate ECDSA private key and initialization vector
                    keythereum.create(null, function (plain) {

                        // derive secret key from password
                        keythereum.deriveKey(password, plain.salt, null, function (derivedKey) {
                            if (derivedKey.error) {
                                if (callback) callback(derivedKey);
                            } else {
                                var encryptedPrivateKey = keythereum.encrypt(
                                    plain.privateKey,
                                    derivedKey.slice(0, 16),
                                    plain.iv
                                );
                                var mac = new Buffer(
                                    keythereum.getMAC(
                                        derivedKey,
                                        new Buffer(encryptedPrivateKey, "base64")
                                    ),
                                    "hex"
                                ).toString("base64");

                                // encrypt private key using derived key and IV, then
                                // store encrypted key & IV, indexed by handle
                                db.put(handle, {
                                    handle: handle,
                                    privateKey: encryptedPrivateKey,
                                    iv: plain.iv.toString("base64"),
                                    salt: plain.salt.toString("base64"),
                                    mac: mac,
                                    id: uuid.v4(),
                                    nonce: 0
                                }, function () {

                                    // set web.account object
                                    self.account = {
                                        handle: handle,
                                        privateKey: plain.privateKey,
                                        address: keythereum.privateKeyToAddress(plain.privateKey),
                                        nonce: 0
                                    };

                                    self.fund(self.account, callback);

                                }); // db.put

                            }

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
            db.get(handle, function (storedInfo) {
                if (!storedInfo.error) {

                    var iv = new Buffer(storedInfo.iv, "base64");
                    var salt = new Buffer(storedInfo.salt, "base64");

                    // derive secret key from password
                    keythereum.deriveKey(password, salt, null, function (derivedKey) {
                        if (derivedKey) {

                            // verify that message authentication codes match
                            var mac = new Buffer(keythereum.getMAC(
                                derivedKey,
                                new Buffer(storedInfo.privateKey, "base64")
                            ), "hex").toString("base64");
                            
                            if (mac === storedInfo.mac) {
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

                            // message authentication code mismatch
                            } else {
                                if (callback) callback(errors.BAD_CREDENTIALS);
                            }
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

        invoke: function (itx, callback) {
            var self = this;
            var tx, data_abi, packaged;
            if (this.account.address) {

                // client-side transactions only needed for sendTransactions
                if (itx.send) {
                    if (this.account.privateKey && itx && itx.constructor === Object) {

                        // parse and serialize transaction parameters
                        tx = abi.copy(itx);
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
                        if (tx.to) tx.to = abi.prefix_hex(tx.to);
                        data_abi = abi.encode(tx);

                        // package up the transaction and submit it to the network
                        packaged = new ethTx({
                            to: tx.to,
                            from: this.account.address,
                            gasPrice: (tx.gasPrice) ? tx.gasPrice : augur.rpc.gasPrice(),
                            gasLimit: (tx.gas) ? tx.gas : constants.DEFAULT_GAS,
                            nonce: this.account.nonce,
                            value: tx.value || "0x0",
                            data: data_abi
                        });

                        // sign, validate, and send the transaction
                        packaged.sign(this.account.privateKey);
                        if (packaged.validate()) {

                            return augur.rpc.sendRawTx(
                                packaged.serialize().toString("hex"),
                                function (r) {

                                    // increment nonce and write to database
                                    db.get(self.account.handle, function (stored) {
                                        stored.nonce = ++self.account.nonce;
                                        db.put(self.account.handle, stored);
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
                    return augur.rpc.invoke(itx, callback);
                }
            
            // not logged in
            } else {
                if (itx.send) {
                    return errors.NOT_LOGGED_IN;
                } else {
                    return augur.rpc.invoke(itx, callback);
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
        // },

        // Handle-to-handle payment methods (send ether/cash/rep without needing address)

        // sendEther: function (toHandle, value, onSent, onSuccess, onFailed) {
        //     var self = this;
        //     if (this.account.address) {
        //         db.get(toHandle, function (toAccount) {
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
        //         db.get(toHandle, function (toAccount) {
        //             if (!toAccount.error) {
        //                 var tx = abi.copy(augur.tx.sendCash);
        //                 tx.params = [toAccount.address, abi.fix(value)];
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
        //         db.get(toHandle, function (toAccount) {
        //             if (!toAccount.error) {
        //                 var tx = abi.copy(augur.tx.sendReputation);
        //                 tx.params = [toAccount.address, abi.fix(value)];
        //                 return self.transact(tx, onSent, onSuccess, onFailed);
        //             } else {
        //                 if (onFailed) onFailed(errors.TRANSACTION_FAILED);
        //             }
        //         });
        //     }
        // }

    };
};
