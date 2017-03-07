/**
 * Client-side accounts
 */

"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var async = require("async");
var keys = require("keythereum");
var uuid = require("uuid");
var clone = require("clone");
var request = (NODE_JS) ? require("request") : require("browser-request");
var abi = require("augur-abi");
var errors = require("ethrpc").errors;
var constants = require("./constants");
var utils = require("./utilities");

request = request.defaults({timeout: 999999});

keys.constants.pbkdf2.c = constants.ROUNDS;
keys.constants.scrypt.n = constants.ROUNDS;

module.exports = function () {

  var augur = this;
  return {

    // The account object is set when logged in
    account: {},

    // free (testnet) ether for new accounts on registration
    fundNewAccountFromFaucet: function (registeredAddress, branch, onSent, onSuccess, onFailed) {
      onSent = onSent || utils.noop;
      onSuccess = onSuccess || utils.noop;
      onFailed = onFailed || utils.noop;
      if (registeredAddress === undefined || registeredAddress === null || registeredAddress.constructor !== String) {
        return onFailed(registeredAddress);
      }
      var url = constants.FAUCET + abi.format_address(registeredAddress);
      if (augur.options.debug.accounts) console.debug("fundNewAccountFromFaucet:", url);
      request(url, function (err, response, body) {
        if (augur.options.debug.accounts) {
          console.log("faucet err:", err);
          console.log("faucet response:", response);
          console.log("faucet body:", body);
        }
        if (err) return onFailed(err);
        if (response.statusCode !== 200) {
          return onFailed(response.statusCode);
        }
        if (augur.options.debug.accounts) console.debug("Sent ether to:", registeredAddress);
        augur.rpc.balance(registeredAddress, function (ethBalance) {
          if (augur.options.debug.accounts) console.debug("Balance:", ethBalance);
          var balance = parseInt(ethBalance, 16);
          if (balance > 0) {
            augur.fundNewAccount({
              branch: branch || constants.DEFAULT_BRANCH_ID,
              onSent: onSent,
              onSuccess: onSuccess,
              onFailed: onFailed
            });
          } else {
            async.until(function () {
              return balance > 0;
            }, function (callback) {
              augur.rpc.fastforward(1, function (nextBlock) {
                if (augur.options.debug.accounts) console.log("Block:", nextBlock);
                augur.rpc.balance(registeredAddress, function (ethBalance) {
                  if (augur.options.debug.accounts) console.debug("Balance:", ethBalance);
                  balance = parseInt(ethBalance, 16);
                  callback(null, balance);
                });
              });
            }, function (e, balance) {
              if (e) console.error(e);
              augur.fundNewAccount({
                branch: branch || constants.DEFAULT_BRANCH_ID,
                onSent: onSent,
                onSuccess: onSuccess,
                onFailed: onFailed
              });
            });
          }
        });
      });
    },

    fundNewAccountFromAddress: function (fromAddress, amount, registeredAddress, branch, onSent, onSuccess, onFailed) {
      onSent = onSent || utils.noop;
      onSuccess = onSuccess || utils.noop;
      onFailed = onFailed || utils.noop;
      augur.rpc.sendEther({
        to: registeredAddress,
        value: amount,
        from: fromAddress,
        onSent: utils.noop,
        onSuccess: function (res) {
          augur.fundNewAccount({
            branch: branch || constants.DEFAULT_BRANCH_ID,
            onSent: onSent,
            onSuccess: onSuccess,
            onFailed: onFailed
          });
        },
        onFailed: onFailed
      });
    },

    register: function (password, cb) {
      var self = this;
      cb = (utils.is_function(cb)) ? cb : utils.pass;
      if (!password || password.length < 6) return cb(errors.PASSWORD_TOO_SHORT);

      // generate ECDSA private key and initialization vector
      keys.create(null, function (plain) {
        if (plain.error) return cb(plain);

        // derive secret key from password
        keys.deriveKey(password, plain.salt, {kdf: constants.KDF}, function (derivedKey) {
          if (derivedKey.error) return cb(derivedKey);
          if (!Buffer.isBuffer(derivedKey)) {
            derivedKey = new Buffer(derivedKey, "hex");
          }
          var encryptedPrivateKey = new Buffer(keys.encrypt(
            plain.privateKey,
            derivedKey.slice(0, 16),
            plain.iv
          ), "base64").toString("hex");

          // encrypt private key using derived key and IV, then
          // store encrypted key & IV, indexed by handle
          var address = abi.format_address(keys.privateKeyToAddress(plain.privateKey));
          var kdfparams = {
            dklen: keys.constants[constants.KDF].dklen,
            salt: plain.salt.toString("hex")
          };
          if (constants.KDF === "scrypt") {
            kdfparams.n = keys.constants.scrypt.n;
            kdfparams.r = keys.constants.scrypt.r;
            kdfparams.p = keys.constants.scrypt.p;
          } else {
            kdfparams.c = keys.constants.pbkdf2.c;
            kdfparams.prf = keys.constants.pbkdf2.prf;
          }
          var keystore = {
            address: address,
            crypto: {
              cipher: keys.constants.cipher,
              ciphertext: encryptedPrivateKey,
              cipherparams: {iv: plain.iv.toString("hex")},
              kdf: constants.KDF,
              kdfparams: kdfparams,
              mac: keys.getMAC(derivedKey, encryptedPrivateKey)
            },
            version: 3,
            id: uuid.v4()
          };

          // while logged in, account object is set
          self.account = {
            privateKey: plain.privateKey,
            address: address,
            keystore: keystore,
            derivedKey: derivedKey
          };

          return cb(clone(self.account));
        }); // deriveKey
      }); // create
    },

    importAccount: function (password, keystore, cb) {
      var self = this;
      cb = (utils.is_function(cb)) ? cb : utils.pass;
      if (!password || password === "") return cb(errors.BAD_CREDENTIALS);
      keys.recover(password, keystore, function (privateKey) {
        if (!privateKey || privateKey.error) return cb(errors.BAD_CREDENTIALS);

        var keystoreCrypto = keystore.crypto || keystore.Crypto;

        keys.deriveKey(password, keystoreCrypto.kdfparams.salt, {kdf: constants.KDF}, function (derivedKey) {
          self.account = {
            privateKey: privateKey,
            address: abi.format_address(keystore.address),
            keystore: keystore,
            derivedKey: derivedKey
          };

          return cb(clone(self.account));
        });
      });
    },

    setAccountObject: function (account, cb) {
      var privateKey = account.privateKey;
      var derivedKey = account.derivedKey;
      if (privateKey && !Buffer.isBuffer(privateKey)) {
        privateKey = new Buffer(privateKey, "hex");
      }
      if (derivedKey && !Buffer.isBuffer(derivedKey)) {
        derivedKey = new Buffer(derivedKey, "hex");
      }
      this.account = {
        privateKey: privateKey,
        address: abi.format_address(account.keystore.address),
        keystore: account.keystore,
        derivedKey: derivedKey
      };
    },

    login: function (keystore, password, cb) {
      var self = this;
      cb = (utils.is_function(cb)) ? cb : utils.pass;
      if (!keystore || !password || password === "") return cb(errors.BAD_CREDENTIALS);
      var keystoreCrypto = keystore.crypto || keystore.Crypto;

      // derive secret key from password
      keys.deriveKey(password, keystoreCrypto.kdfparams.salt, {
        kdf: keystoreCrypto.kdf,
        kdfparams: keystoreCrypto.kdfparams,
        cipher: keystoreCrypto.kdf
      }, function (derivedKey) {
        if (!derivedKey || derivedKey.error) return cb(errors.BAD_CREDENTIALS);

        // verify that message authentication codes match
        var storedKey = keystoreCrypto.ciphertext;
        if (keys.getMAC(derivedKey, storedKey) !== keystoreCrypto.mac.toString("hex")) {
          return cb(errors.BAD_CREDENTIALS);
        }

        if (!Buffer.isBuffer(derivedKey)) {
          derivedKey = new Buffer(derivedKey, "hex");
        }

        // decrypt stored private key using secret key
        try {
          var privateKey = new Buffer(keys.decrypt(
            storedKey,
            derivedKey.slice(0, 16),
            keystoreCrypto.cipherparams.iv
          ), "hex");

          // while logged in, account object is set
          self.account = {
            privateKey: privateKey,
            address: abi.format_address(keystore.address),
            keystore: keystore,
            derivedKey: derivedKey
          };
          return cb(clone(self.account));

          // decryption failure: bad password
        } catch (exc) {
          var e = clone(errors.BAD_CREDENTIALS);
          e.bubble = exc;
          return cb(e);
        }
      }); // deriveKey
    },

    // user-supplied plaintext private key
    loginWithMasterKey: function (privateKey, cb) {
      if (!Buffer.isBuffer(privateKey)) privateKey = new Buffer(privateKey, "hex");
      this.account = {
        address: abi.format_address(keys.privateKeyToAddress(privateKey)),
        privateKey: privateKey,
        derivedKey: new Buffer(abi.unfork(utils.sha256(privateKey)), "hex")
      };
      return cb(clone(this.account));
    },

    logout: function () {
      this.account = {};
      augur.rpc.clear();
    }
  };
};
