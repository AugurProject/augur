/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var keys = require("keythereum");
var errors = require("augur-contracts").errors;
var constants = require("../../src/constants");
var utils = require("../../src/utilities");
var augurpath = "../../src/index";
var augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));

var PERSISTENT_LOGIN = " ";

describe("Database", function () {

    var handle = utils.sha256(new Date().toString()).slice(0, 10);
    var handle2 = utils.sha256(Math.random().toString(36).substring(4)).slice(0, 7);
    var account = {
        handle: abi.prefix_hex(utils.sha256(handle)),
        encryptedPrivateKey: "0x76ea41f201cb8f28560adcf00d78fe3119efee03709b6c0102fb08e48ee101cf",
        iv: "0x5b2e1ea324f8b450b9b95db1af11c0e9",
        salt: "0x12eed439bc9a90531b71819e4540c71c36ff99f6f04c572e2dad0581a79aba62",
        mac: "0x9438f894573a68739bf92d28a868fb18a2caea4c89bbeecf4c9c6c18291796ba",
        id: "0x22790b9113f94c7783c15701e4b73633",
        privateKey: "0x3e339cbafa93d48c0b6a27678ad994ebf7caebb067f4da7e9ac88fe552003ddb",
        address: "0x26bdb0438855e017fcfeac334496569567ea57b6"
    };
    var persistent = abi.copy(account);
    persistent.handle = abi.prefix_hex(utils.sha256(handle2));
    persistent.persist = true;
    var persistentAccount = {
        handle: "d9a23ab",
        privateKey: "0x3e339cbafa93d48c0b6a27678ad994ebf7caebb067f4da7e9ac88fe552003ddb",
        address: "0x26bdb0438855e017fcfeac334496569567ea57b6"
    };

    beforeEach(function () {
        augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));
    });

    it("save account", function (done) {
        this.timeout(augur.constants.TIMEOUT);
        augur.db.put(handle, account, function (res) {
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
            var stored = augur.db.get(handle);
            if (stored && stored.error) return done(stored);
            assert.strictEqual(handle, stored.handle);
            assert.strictEqual(account.encryptedPrivateKey, abi.hex(stored.privateKey, true));
            assert.strictEqual(account.iv, abi.hex(stored.iv, true));
            assert.strictEqual(account.salt, abi.hex(stored.salt, true));
            assert.strictEqual(account.mac, abi.hex(stored.mac, true));
            assert.strictEqual(account.id, abi.hex(stored.id, true));

            // asynchronous
            augur.db.get(handle, function (storedAccount) {
                if (storedAccount && storedAccount.error) return done(storedAccount);
                assert.strictEqual(handle, storedAccount.handle);
                assert.strictEqual(account.encryptedPrivateKey, abi.hex(storedAccount.privateKey, true));
                assert.strictEqual(account.iv, abi.hex(storedAccount.iv, true));
                assert.strictEqual(account.salt, abi.hex(storedAccount.salt, true));
                assert.strictEqual(account.mac, abi.hex(storedAccount.mac, true));
                assert.strictEqual(account.id, abi.hex(storedAccount.id, true));
                done();
            });
        });
    });

    it("remove account", function (done) {
        this.timeout(augur.constants.TIMEOUT);
        var stored = augur.db.get(handle);
        if (stored && stored.error) return done(stored);
        assert.strictEqual(handle, stored.handle);
        assert.strictEqual(account.encryptedPrivateKey, abi.hex(stored.privateKey, true));
        assert.strictEqual(account.iv, abi.hex(stored.iv, true));
        assert.strictEqual(account.salt, abi.hex(stored.salt, true));
        assert.strictEqual(account.mac, abi.hex(stored.mac, true));
        assert.strictEqual(account.id, abi.hex(stored.id, true));
        augur.db.remove(handle);
        assert.strictEqual(augur.db.get(handle).error, 99);
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
            assert.isTrue(augur.db.remove(PERSISTENT_LOGIN));
            assert.strictEqual(augur.db.get(PERSISTENT_LOGIN).error, 99);
            assert.isNull(augur.db.getPersistent());
            assert.isTrue(augur.db.putPersistent(persistentAccount));
            var storedPersistentAccount = augur.db.getPersistent();
            storedPersistentAccount.privateKey = abi.hex(storedPersistentAccount.privateKey, true);
            assert.deepEqual(storedPersistentAccount, persistentAccount);
            assert.isTrue(augur.db.removePersistent());
            assert.strictEqual(augur.db.get(PERSISTENT_LOGIN).error, 99);
            assert.isNull(augur.db.getPersistent());
        });

        it("persistent save", function (done) {
            this.timeout(augur.constants.TIMEOUT);
            augur.db.put(handle2, persistent, function (res) {
                if (res && res.error) return done(res);
                assert.isTrue(res);
                var stored = augur.db.get(PERSISTENT_LOGIN);
                assert.strictEqual(stored.handle, handle2);
                assert.strictEqual(abi.hex(stored.privateKey), persistent.privateKey);
                assert.strictEqual(stored.address, persistent.address);
                augur.db.remove(PERSISTENT_LOGIN);
                assert.strictEqual(augur.db.get(PERSISTENT_LOGIN).error, 99);
                assert.isNull(augur.db.getPersistent());
                done();
            });
        });
    });
});
