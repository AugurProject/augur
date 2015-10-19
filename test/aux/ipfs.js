(function () {
/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var join = require("path").join;
var abi = require("augur-abi");
var assert = require("chai").assert;
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));

var DATADIR = join(__dirname, "..", "..", "data");
var b58data = fs.readFileSync(join(DATADIR, "ipfs-hash.dat"));
var hexdata = fs.readFileSync(join(DATADIR, "ipfs-hex.dat"));
var ipfsHashes = b58data.toString().split('\n');
var ipfsHex = hexdata.toString().split('\n');

describe("ipfs.encodeMultihash", function () {

    var test = function (t) {
        it(t.input + " -> " + t.expected, function () {
            assert.strictEqual(augur.encodeMultihash(t.input), t.expected);
        });
    };

    for (var i = 0, len = ipfsHex.length; i < len; ++i) {
        test({
            input: ipfsHex[i],
            expected: ipfsHashes[i]
        });
    }

});

describe("ipfs.decodeMultihash", function () {

    var test = function (t) {
        it(t.input + " -> " + t.expected, function () {
            assert.strictEqual(augur.decodeMultihash(t.input), t.expected);
        });
    };

    for (var i = 0, len = ipfsHashes.length; i < len; ++i) {
        test({
            input: ipfsHashes[i],
            expected: ipfsHex[i]
        });
    }

});

describe("ipfs.set/getMarketsDirectoryHash", function () {

    var test = function (t) {
        it("network " + t.network + ": " + t.hash, function (done) {
            this.timeout(augur.constants.TIMEOUT);
            augur.setMarketsDirectoryHash({
                name: t.network,
                hash: t.hash,
                onSent: function (r) {
                    assert.property(r, "txHash");
                    assert.property(r, "callReturn");
                    assert.strictEqual(r.callReturn, "1");
                },
                onSuccess: function (r) {
                    assert.property(r, "txHash");
                    assert.property(r, "callReturn");
                    assert.property(r, "blockHash");
                    assert.property(r, "blockNumber");
                    assert.isAbove(parseInt(r.blockNumber), 0);
                    assert.strictEqual(r.from, augur.coinbase);
                    assert.strictEqual(r.to, augur.contracts.ipfs);
                    assert.strictEqual(parseInt(r.value), 0);
                    assert.strictEqual(r.callReturn, "1");

                    // asynchronous
                    augur.getMarketsDirectoryHash(t.network, function (dirHash) {
                        if (!dirHash || dirHash.error) return done(dirHash);
                        assert.strictEqual(dirHash, t.hash);

                        // synchronous
                        var syncDirHash = augur.getMarketsDirectoryHash(t.network);
                        if (!syncDirHash || syncDirHash.error) return done(syncDirHash);
                        assert.strictEqual(syncDirHash, t.hash);

                        done();
                    });
                },
                onFailed: done
            });
        });
    };

    test({
        network: "7",
        hash: "QmaUJ4XspR3XhQ4fsjmqHSkkTHYiTJigKZSPa8i4xgVuAt"
    });
    test({
        network: "10101",
        hash: "QmeWQshJxTpnvAq58A51KhBkEi6YGJDKRe7rssPFRnX2EX"
    });
    test({
        network: "7",
        hash: "Qmehkp3udWtoLzJvxNJMtCkPmSExSr7ibHy3fdwJg2Z1Ju"
    });
    test({
        network: "10101",
        hash: "QmQKmU43G12uAF8HfWL7e3gUgxFm1C8F7CzMVm8FiHdW2G"
    });

});

})();
