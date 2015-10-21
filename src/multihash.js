/**
 * Multihash methods for augur.js.
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var bs58 = require("bs58");
var abi = require("augur-abi");

module.exports = {

    /**
     * Remove IPFS hash tag (assume sha256, which is the default):
     * 1. Remove leading two characters (Qm)
     * 2. Decode base58 string to 33 byte array
     * 3. Remove the leading byte, which is part of the hash tag
     * Untagged 32 byte hash can now be stored on-contract as a single int256!
     */
    decode: function (ipfsHash) {
        if (ipfsHash && ipfsHash.constructor === String && ipfsHash.slice(0, 2) === "Qm") {
            return abi.hex(new Buffer(bs58.decode(ipfsHash.slice(2)).splice(1)), true);
        }
    },

    /**
     * Add multihash prefix to hex-encoded IPFS hash and convert to base58:
     *  - prefix 1 if leading byte > 60
     *  - prefix 2 otherwise
     */
    encode: function (ipfsHash) {
        if (ipfsHash && ipfsHash.constructor === String) {
            ipfsHash = abi.unfork(ipfsHash);
            if (parseInt(ipfsHash.slice(0, 2), 16) > 60) {
                ipfsHash = "01" + ipfsHash;
            } else {
                ipfsHash = "02" + ipfsHash;
            }
            return "Qm" + bs58.encode(new Buffer(ipfsHash, "hex"));
        }
    }

};
