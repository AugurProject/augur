/**
 * Client-side accounts / transactions
 */

"use strict";

var crypto;
if ((typeof module !== "undefined") && process && !process.browser) {
    crypto = require("crypto");
} else {
    crypto = require("crypto-browserify");
}
var BigNumber = require("bignumber.js");
var scrypt = require("scryptsy");
var uuid = require("node-uuid");
var EthUtil = require("ethereumjs-util");
var EthTx = require("ethereumjs-tx");
var EC = require("elliptic").ec;
var errors = require("./errors");
var constants = require("./constants");
var utilities = require("./utilities");
var numeric = require("./numeric");

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

module.exports = function (augur) {

    return {

        // The account object is set when logged in
        account: {},

        // Option to use scrypt key derivation function
        scrypt: augur.options.scrypt,

        ecdsa: new EC("secp256k1"),

        // export private key to geth-readable json
        dumpPrivateKey: function (password, privateKey, iv, callback) {
            var self = this;
            var hmac = crypto.createHmac("sha256", privateKey);
            self.deriveKey(password, iv, function (derivedKey) {
                var json = {
                    address: this.privateKeyToAddress(privateKey),
                    Crypto: {
                        cipher: constants.CIPHER,
                        ciphertext: self.encrypt(privateKey, derivedKey, iv).toString("hex"),
                        cipherparams: { iv: iv },
                        mac: ""
                    },
                    id: uuid.v4(),
                    version: 3
                };
                if (this.scrypt) {
                    json.Crypto.kdf = "scrypt";
                    json.Crypto.kdfparams = {
                        dklen: constants.KEYSIZE,
                        n: constants.scrypt.n,
                        r: constants.scrypt.r,
                        p: constants.scrypt.p,
                        salt: iv
                    };
                } else {
                    json.Crypto.kdf = "pbkdf2";
                    json.Crypto.kdfparams = {
                        c: constants.pbkdf2.ITERATIONS,
                        dklen: constants.KEYSIZE,
                        pdf: "hmac-sha256",
                        salt: iv
                    };
                }
                console.log(json);
                if (callback) callback(json);
            });
        },

        // import private key from geth json
        loadPrivateKey: function (json) {

        },

        encrypt: function (plaintext, key, iv) {
            var cipher, ciphertext;
            cipher = crypto.createCipheriv(constants.CIPHER, key, iv);
            ciphertext = cipher.update(plaintext, "hex", "base64");
            return ciphertext + cipher.final("base64");
        },

        decrypt: function (ciphertext, key, iv) {
            var decipher, plaintext;
            decipher = crypto.createDecipheriv(constants.CIPHER, key, iv);
            plaintext = decipher.update(ciphertext, "base64", "hex");
            return plaintext + decipher.final("hex");
        },

        // derive public key and address from private key
        privateKeyToAddress: function (privateKey) {
            var pubKey = new Buffer(this.ecdsa.keyFromPrivate(privateKey).getPublic("arr"));
            return "0x" + EthUtil.pubToAddress(pubKey).toString("hex");
        },

        // derive secret key from password
        deriveKey: function (password, iv, callback) {

            // use scrypt if augur.options.scrypt = true
            if (this.scrypt) {
                var derivedKey = scrypt(
                    password,
                    iv,
                    constants.scrypt.n,
                    constants.scrypt.r,
                    constants.scrypt.p,
                    constants.KEYSIZE
                );
                if (callback) {
                    callback(derivedKey);
                } else {
                    return derivedKey;
                }                

            // default key derivation function is PBKDF2
            } else {
                crypto.pbkdf2(password, iv,
                    constants.pbkdf2.ITERATIONS,
                    constants.KEYSIZE,
                    constants.pbkdf2.ALGORITHM,
                    function (ex, derivedKey) {
                        if (ex) throw ex;
                        if (callback) callback(derivedKey);
                    }
                );
            }
        },

        generateKey: function (callback) {

            // generate ECDSA private key
            crypto.randomBytes(constants.KEYSIZE, function (ex, privateKey) {
                if (ex) throw ex;

                // generate random initialization vector
                crypto.randomBytes(constants.IVSIZE, function (ex, iv) {
                    if (ex) throw ex;

                    if (callback) callback({ privateKey: privateKey, iv: iv });

                }); // crypto.randomBytes

            }); // crypto.randomBytes
        },

        register: function (handle, password, callback) {
            var self = this;
            augur.db.get(handle, function (record) {
                if (record.error) {

                    // generate ECDSA private key and initialization vector
                    self.generateKey(function (plain) {

                        // derive secret key from password
                        self.deriveKey(password, plain.iv, function (derivedKey) {

                            // encrypt private key using derived key and IV, then
                            // store encrypted key & IV, indexed by handle
                            augur.db.put(handle, {
                                handle: handle,
                                privateKey: self.encrypt(plain.privateKey, derivedKey, plain.iv),
                                iv: plain.iv.toString("base64"),
                                nonce: 0
                            }, function () {

                                // set web.account object
                                self.account = {
                                    handle: handle,
                                    privateKey: plain.privateKey,
                                    address: self.privateKeyToAddress(plain.privateKey),
                                    nonce: 0
                                };

                                if (callback) callback(self.account);

                            }); // db.put

                        }); // deriveKey
                    
                    }); // generateKey
                
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

                    // use the password to decrypt the private key
                    var iv = new Buffer(storedInfo.iv, "base64");

                    // derive secret key from password
                    self.deriveKey(password, iv, function (derivedKey) {
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
            var self = this;
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
                        }
                        if (tx.to) tx.to = numeric.prefix_hex(tx.to);
                        data_abi = augur.abi.encode(tx);

                        // package up the transaction and submit it to the network
                        packaged = new EthTx({
                            to: tx.to,
                            from: this.account.address,
                            gasPrice: "0xda475abf000", // 0.000015 ether
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

                                    // increment nonce, write to database
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
