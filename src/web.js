/**
 * Centralized/trustless web client
 */

"use strict";

var crypto;
if ((typeof module !== "undefined") && process && !process.browser) {
    crypto = require("crypto");
} else {
    crypto = require("crypto-browserify");
}
var BigNumber = require("bignumber.js");
var EthUtil = require("ethereumjs-util");
var EthTx = require("ethereumjs-tx");
var eccrypto = require("eccrypto");
var errors = require("./errors");
var constants = require("./constants");
var utilities = require("./utilities");
// var numeric = require("./numeric");

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

module.exports = function (augur) {

    return {

        // The account object is set when logged in
        account: {},

        encrypt: function (plaintext, key, iv) {
            var cipher, ciphertext;
            cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
            ciphertext = cipher.update(plaintext, "hex", "base64");
            return ciphertext + cipher.final("base64");
        },

        decrypt: function (ciphertext, key, iv) {
            var decipher, plaintext;
            decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
            plaintext = decipher.update(ciphertext, "base64", "hex");
            return plaintext + decipher.final("hex");
        },

        privateKeyToAddress: function (privateKey) {
            var pubKey = eccrypto.getPublic(privateKey);
            return "0x" + EthUtil.pubToAddress(pubKey).toString("hex");
        },

        register: function (handle, password, callback) {
            var self = this;
            augur.db.get(handle, function (record) {
                if (record.error) {

                    // generate private key, derive public key and address
                    crypto.randomBytes(constants.KEYSIZE, function (ex, privKey) {

                        // generate random initialization vector
                        crypto.randomBytes(constants.IVSIZE, function (ex, iv) {

                            // derive secret key from password using PBKDF2
                            crypto.pbkdf2(password, iv,
                                constants.pbkdf2.ITERATIONS,
                                constants.KEYSIZE,
                                constants.pbkdf2.ALGORITHM,
                                function (ex, derivedKey) {
                                    if (ex) throw ex;

                                    // AES-256 encrypt private key
                                    var encryptedPrivKey = self.encrypt(privKey, derivedKey, iv);

                                    // store encrypted key & IV, indexed by handle
                                    self.db.put(handle, {
                                        handle: handle,
                                        privateKey: encryptedPrivKey,
                                        iv: iv.toString("base64"),
                                        nonce: 0
                                    }, function () {

                                        // while logged in, web.account object is set
                                        self.account = {
                                            handle: handle,
                                            privateKey: privKey,
                                            address: self.privateKeyToAddress(privKey),
                                            nonce: 0
                                        };

                                        if (callback) callback(self.account);
                                    });
                                }
                            );
                        });
                    });
                
                } else {
                    if (callback) callback(errors.HANDLE_TAKEN);
                }
            });
        },

        login: function (handle, password, callback) {
            var self = this;

            // retrieve account info from database
            augur.db.get(handle, function (storedInfo) {
                if (!storedInfo.error) {

                    // use the password to decrypt the private key
                    var iv = new Buffer(storedInfo.iv, "base64");

                    // derive secret key from password using PBKDF2                    
                    crypto.pbkdf2(password, iv,
                        constants.pbkdf2.ITERATIONS,
                        constants.KEYSIZE,
                        constants.pbkdf2.ALGORITHM,
                        function (ex, derivedKey) {
                            if (ex) throw ex;
                            try {

                                // decrypt stored private key using secret key
                                var privateKey = new Buffer(self.decrypt(
                                    storedInfo.privateKey,
                                    derivedKey,
                                    iv
                                ), "hex");

                                // while logged in, web.account object is set
                                self.account = {
                                    handle: handle,
                                    privateKey: privateKey,
                                    address: self.privateKeyToAddress(privateKey),
                                    nonce: storedInfo.nonce
                                };

                                if (callback) callback(self.account);
                            
                            // decryption failure: bad password
                            } catch (e) {
                                if (callback) callback(errors.BAD_CREDENTIALS);
                            }
                        }
                    );

                // handle not found
                } else {
                    if (callback) callback(errors.BAD_CREDENTIALS);
                }
            });
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
        //                 var tx = utilities.copy(augur.tx.sendCash);
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
        //                 var tx = utilities.copy(augur.tx.sendReputation);
        //                 tx.params = [toAccount.address, numeric.fix(value)];
        //                 return self.transact(tx, onSent, onSuccess, onFailed);
        //             } else {
        //                 if (onFailed) onFailed(errors.TRANSACTION_FAILED);
        //             }
        //         });
        //     }
        // },

        invoke: function (itx, callback) {
            var tx, data_abi, packaged;
            if (this.account.address) {

                // client-side transactions only needed for sendTransactions
                if (itx.send) {
                    if (this.account.privateKey && itx && itx.constructor === Object) {

                        // parse and serialize transaction parameters
                        tx = utilities.copy(itx);
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
                            data_abi = augur.abi.encode(tx);
                        }

                        // package up the transaction and submit it to the network
                        packaged = new EthTx({
                            to: tx.to,
                            from: this.account.address,
                            gasPrice: "0xda475abf000", // 0.000015 ether
                            gasLimit: (tx.gas) ? tx.gas : constants.DEFAULT_GAS,
                            nonce: this.account.nonce++,
                            value: tx.value || "0x0",
                            data: data_abi
                        });

                        // write the incremented nonce to the database
                        augur.db.get(this.account.handle, function (stored) {
                            stored.nonce = this.account.nonce;
                            augur.db.put(this.account.handle, stored);
                        }.bind(this));

                        // sign, validate, and send the transaction
                        packaged.sign(this.account.privateKey);
                        if (packaged.validate()) {

                            return augur.sendRawTx(
                                packaged.serialize().toString("hex"),
                                callback
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
        },

        transact: function (tx, onSent, onSuccess, onFailed) {
            var returns = tx.returns;

            delete tx.returns;
            tx.send = true;

            this.invoke(tx, function (txhash) {
                augur.confirmTx(tx, txhash, returns, onSent, onSuccess, onFailed);
            });
        }

    };
};
