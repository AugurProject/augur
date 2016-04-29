/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var clone = require("clone");
var keys = require("keythereum");
var uuid = require("node-uuid");
var errors = require("augur-contracts").errors;
var constants = require("../../src/constants");
var utils = require("../../src/utilities");
var augurpath = "../../src/index";
var augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));

describe("Accounts", function () {

    var kdf = "pbkdf2";
    var userHandle = utils.sha256(new Date().toString()).slice(0, 10);
    var userHandle2 = utils.sha256(Math.random().toString(36).substring(4)).slice(0, 7);
    var address = "26bdb0438855e017fcfeac334496569567ea57b6";
    var account = {
        handle: userHandle,
        address: address,
        privateKey: "3e339cbafa93d48c0b6a27678ad994ebf7caebb067f4da7e9ac88fe552003ddb",
        keystore: {
            address: address,
            crypto: {
                cipher: keys.constants.cipher,
                ciphertext: "76ea41f201cb8f28560adcf00d78fe3119efee03709b6c0102fb08e48ee101cf",
                cipherparams: {iv: "5b2e1ea324f8b450b9b95db1af11c0e9"},
                mac: "9438f894573a68739bf92d28a868fb18a2caea4c89bbeecf4c9c6c18291796ba",
                kdf: kdf,
                id: "22790b9113f94c7783c15701e4b73633",
                kdfparams: {
                    c: keys.constants[kdf].c,
                    dklen: keys.constants[kdf].dklen,
                    prf: keys.constants[kdf].prf,
                    salt: "12eed439bc9a90531b71819e4540c71c36ff99f6f04c572e2dad0581a79aba62",
                }
            },
            id: uuid.v4()
        }
    };
    var persistent = clone(account);
    persistent.handle = userHandle2;
    persistent.persist = true;
    var persistentAccount = {
        handle: "d9a23ab",
        privateKey: "0x3e339cbafa93d48c0b6a27678ad994ebf7caebb067f4da7e9ac88fe552003ddb",
        address: "26bdb0438855e017fcfeac334496569567ea57b6"
    };

    beforeEach(function () {
        augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));
    });

    it("save account", function (done) {
        this.timeout(augur.constants.TIMEOUT);
        augur.db.put(userHandle, account.keystore, function (res) {
            if (res && res.error) return done(res);
            assert.isTrue(res);
            done();
        });
    });

    it("retrieve account", function (done) {

        // should return DB_READ_FAILED error
        var badhandle = new Date().toString();
        var response = augur.db.get(badhandle);
        if (!response.error) return done(response);
        assert.strictEqual(response.error, errors.DB_READ_FAILED.error);
        augur.db.get(badhandle, function (response) {
            if (!response.error) return done(response);
            assert.strictEqual(response.error, errors.DB_READ_FAILED.error);

            // synchronous
            var stored = augur.db.get(userHandle);
            if (stored && stored.error) return done(stored);
            assert.strictEqual(account.keystore.crypto.ciphertext, stored.crypto.ciphertext);
            assert.strictEqual(account.keystore.crypto.cipherparams.iv, stored.crypto.cipherparams.iv);
            assert.strictEqual(account.keystore.crypto.salt, stored.crypto.salt);
            assert.strictEqual(account.keystore.crypto.mac, stored.crypto.mac);
            assert.strictEqual(account.keystore.id, stored.id);

            // // asynchronous
            augur.db.get(userHandle, function (storedAccount) {
                if (storedAccount && storedAccount.error) return done(storedAccount);
                assert.strictEqual(account.keystore.crypto.ciphertext, storedAccount.crypto.ciphertext);
                assert.strictEqual(account.keystore.crypto.cipherparams.iv, storedAccount.crypto.cipherparams.iv);
                assert.strictEqual(account.keystore.crypto.salt, storedAccount.crypto.salt);
                assert.strictEqual(account.keystore.crypto.mac, storedAccount.crypto.mac);
                assert.strictEqual(account.keystore.id, storedAccount.id);
                done();
            });
        });
    });

    it("remove account", function (done) {
        this.timeout(augur.constants.TIMEOUT);
        var stored = augur.db.get(userHandle);
        if (stored && stored.error) return done(stored);
        assert.strictEqual(account.keystore.crypto.ciphertext, stored.crypto.ciphertext);
        assert.strictEqual(account.keystore.crypto.cipherparams.iv, stored.crypto.cipherparams.iv);
        assert.strictEqual(account.keystore.crypto.salt, stored.crypto.salt);
        assert.strictEqual(account.keystore.crypto.mac, stored.crypto.mac);
        assert.strictEqual(account.keystore.id, stored.id);
        augur.db.remove(userHandle);
        assert.strictEqual(augur.db.get(userHandle).error, 99);
        done();
    });

    describe("Persistent login", function () {

        it("putPersistent", function () {
            this.timeout(augur.constants.TIMEOUT);
            assert.isTrue(augur.db.putPersistent(persistentAccount));
        });

        it("getPersistent", function () {
            this.timeout(augur.constants.TIMEOUT);
            assert.isTrue(augur.db.putPersistent(persistentAccount));
            var storedPersistentAccount = augur.db.getPersistent();
            storedPersistentAccount.privateKey = abi.hex(storedPersistentAccount.privateKey, true);
            assert.deepEqual(storedPersistentAccount, persistentAccount);
        });

        it("removePersistent", function () {
            this.timeout(augur.constants.TIMEOUT);
            assert.isTrue(augur.db.putPersistent(persistentAccount));
            var storedPersistentAccount = augur.db.getPersistent();
            storedPersistentAccount.privateKey = abi.hex(storedPersistentAccount.privateKey, true);
            assert.deepEqual(storedPersistentAccount, persistentAccount);
            assert.isTrue(augur.db.remove(''));
            assert.strictEqual(augur.db.get('').error, 99);
            assert.isNull(augur.db.getPersistent());
            assert.isTrue(augur.db.putPersistent(persistentAccount));
            var storedPersistentAccount = augur.db.getPersistent();
            storedPersistentAccount.privateKey = abi.hex(storedPersistentAccount.privateKey, true);
            assert.deepEqual(storedPersistentAccount, persistentAccount);
            assert.isTrue(augur.db.removePersistent());
            assert.strictEqual(augur.db.get('').error, 99);
            assert.isNull(augur.db.getPersistent());
        });
    });
});
