/**
 * Contract ABI serialization
 */

"use strict";

var BigNumber = require("bignumber.js");
var keccak_256 = require("js-sha3").keccak_256;
var constants = require("./constants");
var utilities = require("./utilities");
var numeric = require("./numeric");

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

module.exports = {

    abi_prefix: function (funcname, signature) {
        signature = signature || "";
        var summary = funcname + "(";
        for (var i = 0, len = signature.length; i < len; ++i) {
            switch (signature[i]) {
                case 's':
                    summary += "bytes";
                    break;
                case 'i':
                    summary += "int256";
                    break;
                case 'a':
                    summary += "int256[]";
                    break;
                default:
                    summary += "weird";
            }
            if (i !== len - 1) summary += ",";
        }
        var prefix = keccak_256(summary + ")").slice(0, 8);
        while (prefix.slice(0, 1) === '0') {
            prefix = prefix.slice(1);
        }
        return "0x" + prefix;
    },

    pad_right: function (s) {
        var output = s;
        while (output.length < 64) {
            output += '0';
        }
        return output;
    },

    pad_left: function (r, ishex) {
        var output = r;
        if (!ishex) output = numeric.encode_hex(output);
        while (output.length < 64) {
            output = '0' + output;
        }
        return output;
    },

    // hex-encode a function's ABI data and return it
    encode: function (itx) {
        var tx = utilities.copy(itx);
        tx.signature = tx.signature || "";
        var stat, statics = '';
        var dynamic, dynamics = '';
        var num_params = tx.signature.length;
        var data_abi = this.abi_prefix(tx.method, tx.signature);
        var types = [];
        for (var i = 0, len = tx.signature.length; i < len; ++i) {
            if (tx.signature[i] === 's') {
                types.push("bytes");
            } else if (tx.signature[i] === 'a') {
                types.push("int256[]");
            } else {
                types.push("int256");
            }
        }
        if (tx.params !== undefined && tx.params !== null && tx.params !== [] && tx.params !== "") {
            if (tx.params.constructor === String) {
                if (tx.params.slice(0,1) === "[" && tx.params.slice(-1) === "]") {
                    tx.params = JSON.parse(tx.params);
                }
                if (tx.params.constructor === String) {
                    tx.params = [tx.params];
                }
            } else if (tx.params.constructor === Number) {
                tx.params = [tx.params];
            }
        } else {
            tx.params = [];
        }
        if (num_params === tx.params.length) {
            for (i = 0, len = types.length; i < len; ++i) {
                if (types[i] === "int256") {
                    if (tx.params[i] !== undefined && tx.params[i] !== null && tx.params[i] !== [] && tx.params[i] !== "") {
                        if (tx.params[i].constructor === Number) {
                            stat = numeric.bignum(tx.params[i]);
                            if (stat !== 0) {
                                stat = stat.mod(constants.MAXBITS).toFixed();
                            } else {
                                stat = stat.toFixed();
                            }
                            statics += this.pad_left(numeric.encode_int(stat));
                        } else if (tx.params[i].constructor === String) {
                            if (tx.params[i].slice(0,1) === '-') {
                                stat = numeric.bignum(tx.params[i]).mod(constants.MAXBITS).toFixed();
                                statics += this.pad_left(numeric.encode_int(stat));
                            } else if (tx.params[i].slice(0,2) === "0x") {
                                statics += this.pad_left(tx.params[i].slice(2), true);
                            } else {
                                stat = numeric.bignum(tx.params[i]).mod(constants.MAXBITS);
                                statics += this.pad_left(numeric.encode_int(stat));
                            }
                        }
                    }
                } else if (types[i] === "bytes" || types[i] === "string") {
                    // offset (in 32-byte chunks)
                    stat = 32*num_params + 0.5*dynamics.length;
                    stat = numeric.bignum(stat).mod(constants.MAXBITS).toFixed();
                    statics += this.pad_left(numeric.encode_int(stat));
                    dynamics += this.pad_left(numeric.encode_int(tx.params[i].length));
                    dynamics += this.pad_right(numeric.encode_hex(tx.params[i]));
                } else if (types[i] === "int256[]") {
                    stat = 32*num_params + 0.5*dynamics.length;
                    stat = numeric.bignum(stat).mod(constants.MAXBITS).toFixed();
                    statics += this.pad_left(numeric.encode_int(stat));
                    var arraylen = tx.params[i].length;
                    dynamics += this.pad_left(numeric.encode_int(arraylen));
                    for (var j = 0; j < arraylen; ++j) {
                        if (tx.params[i][j] !== undefined) {
                            if (tx.params[i][j].constructor === Number) {
                                dynamic = numeric.bignum(tx.params[i][j]).mod(constants.MAXBITS).toFixed();
                                dynamics += this.pad_left(numeric.encode_int(dynamic));
                            } else if (tx.params[i][j].constructor === String) {
                                if (tx.params[i][j].slice(0,1) === '-') {
                                    dynamic = numeric.bignum(tx.params[i][j]).mod(constants.MAXBITS).toFixed();
                                    dynamics += this.pad_left(numeric.encode_int(dynamic));
                                } else if (tx.params[i][j].slice(0,2) === "0x") {
                                    dynamics += this.pad_left(tx.params[i][j].slice(2), true);
                                } else {
                                    dynamic = numeric.bignum(tx.params[i][j]).mod(constants.MAXBITS);
                                    dynamics += this.pad_left(numeric.encode_int(dynamic));
                                }
                            }
                        }
                    }
                }
            }
            return data_abi + statics + dynamics;
        } else {
            return new Error("wrong number of parameters");
        }
    }
};
