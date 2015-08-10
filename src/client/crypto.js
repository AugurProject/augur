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
var uuid = require("node-uuid");
var EthUtil = require("ethereumjs-util");
var EC = require("elliptic").ec;
var errors = require("../errors");
var constants = require("../constants");
var utils = require("../utilities");
var numeric = require("../core/numeric");
var keccak = require("../../lib/keccak");
var scrypt = require("../../lib/scrypt")(constants.scrypt.maxmem);
var log = console.log;

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

module.exports = function (kdf) {

    return {

        // Option to use scrypt key derivation function
        scrypt: kdf,

        ecdsa: new EC("secp256k1"),

        getMAC: function (derivedKey, ciphertext) {
            return keccak(utils.hex2utf16le(derivedKey.slice(32, 64) + ciphertext));
        },

        // export private key to secret-storage format specified by:
        // https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
        dumpPrivateKey: function (password, privateKey, iv, callback) {
            var self = this;
            self.deriveKey(password, iv, function (derivedKey) {

                // encryption key: first 16 bytes of derived key
                var ciphertext = self.encrypt(
                    privateKey,
                    derivedKey.slice(0, 16),
                    iv
                ).toString("hex");

                // MAC: Keccak hash of the byte array formed by concatenating
                // the second 16 bytes of the derived key with the ciphertext
                // key's contents
                var mac = self.getMAC(derivedKey, ciphertext);

                // ID: random 128-bit UUID given to the secret key (a
                // privacy-preserving proxy for the secret key's address)
                var id = uuid.v4();

                // ethereum address
                var address = self.privateKeyToAddress(privateKey);

                // random 128-bit salt
                var salt = crypto.randomBytes(constants.KEYSIZE);

                var json = {
                    address: address,
                    Crypto: {
                        cipher: constants.CIPHER,
                        ciphertext: ciphertext,
                        cipherparams: { iv: iv },
                        mac: mac
                    },
                    id: id,
                    version: 3
                };
                if (self.scrypt) {
                    json.Crypto.kdf = "scrypt";
                    json.Crypto.kdfparams = {
                        dklen: constants.scrypt.dklen,
                        n: constants.scrypt.n,
                        r: constants.scrypt.r,
                        p: constants.scrypt.p,
                        salt: salt
                    };
                } else {
                    json.Crypto.kdf = "pbkdf2";
                    json.Crypto.kdfparams = {
                        c: constants.pbkdf2.c,
                        dklen: constants.pbkdf2.dklen,
                        prf: constants.pbkdf2.prf,
                        salt: salt
                    };
                }
                console.log(json);
                if (callback && callback.constructor === Function) {
                    callback(json);
                }
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
        deriveKey: function (password, salt, callback) {

            // use scrypt kdf if augur.options.scrypt = true
            if (this.scrypt) {

                try {
                    return scrypt.to_hex(scrypt.crypto_scrypt(
                        new Buffer(password, "utf8"),
                        new Buffer(salt, "hex"),
                        constants.scrypt.n,
                        constants.scrypt.r,
                        constants.scrypt.p,
                        constants.scrypt.dklen
                    ));

                } catch (ex) {
                    return ex;
                }

            // use default key derivation function (PBKDF2)
            } else {
                if (callback && callback.constructor === Function) {
                    crypto.pbkdf2(
                        password,
                        new Buffer(salt, "hex"),
                        constants.pbkdf2.c,
                        constants.pbkdf2.dklen,
                        constants.pbkdf2.hash,
                        function (ex, derivedKey) {
                            if (ex) return ex;
                            callback(derivedKey);
                        }
                    );
                } else {
                    
                    try {
                        return crypto.pbkdf2Sync(
                            password,
                            new Buffer(salt, "hex"),
                            constants.pbkdf2.c,
                            constants.pbkdf2.dklen,
                            constants.pbkdf2.hash
                        );

                    } catch (ex) {
                        return ex;
                    }
                }
            }
        },

        generateKey: function (callback) {

            // asynchronous key generation if callback provided
            if (callback && callback.constructor === Function) {

                // generate ECDSA private key
                crypto.randomBytes(constants.KEYSIZE, function (ex, privateKey) {
                    if (ex) callback(ex);

                    // generate random initialization vector
                    crypto.randomBytes(constants.IVSIZE, function (ex, iv) {
                        if (ex) callback(ex);

                        // generate random salt
                        crypto.randomBytes(constants.KEYSIZE, function (ex, salt) {
                            if (ex) callback(ex);

                            callback({
                                privateKey: privateKey,
                                iv: iv,
                                salt: salt
                            });
                        });

                    }); // crypto.randomBytes

                }); // crypto.randomBytes

            // synchronous key generation
            } else {

                try {
                    return {
                        privateKey: crypto.randomBytes(constants.KEYSIZE),
                        iv: crypto.randomBytes(constants.IVSIZE),
                        salt: crypto.randomBytes(constants.KEYSIZE)
                    };

                // couldn't generate key: not enough entropy?
                } catch (ex) {
                    return ex;
                }
            }
        }

    };
};
