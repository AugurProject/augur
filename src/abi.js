/**
 * Contract ABI serialization
 */

"use strict";

var BigNumber = require("bignumber.js");
var keccak_256 = require("js-sha3").keccak_256;
var constants = require("./constants");
var utils = require("./utilities");
var numeric = require("./numeric");

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

module.exports = {

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

    abi_prefix: function (funcname, signature) {
        signature = signature || "";
        var summary = funcname + "(";
        console.log(signature);
        for (var i = 0, len = signature.length; i < len; ++i) {
            switch (signature[i]) {
                case 's':
                    summary += "bytes";
                    break;
                case 'b':
                    summary += "bytes";
                    var j = 1;
                    while (utils.isNumeric(signature[i+j])) {
                        summary += signature[i+j].toString();
                        j++;
                    }
                    i += j;
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
        console.log(summary);
        var prefix = keccak_256(summary + ")").slice(0, 8);
        while (prefix.slice(0, 1) === '0') {
            prefix = prefix.slice(1);
        }
        return "0x" + prefix;
    },

    parse_signature: function (signature) {
        var types = [];
        for (var i = 0, len = signature.length; i < len; ++i) {
            if (utils.isNumeric(signature[i])) {
                types[types.length - 1] += signature[i].toString();
            } else {
                if (signature[i] === 's') {
                    types.push("bytes");
                } else if (signature[i] === 'b') {
                    types.push("bytes");
                } else if (signature[i] === 'a') {
                    types.push("int256[]");
                } else {
                    types.push("int256");
                }
            }
        }
        return types;
    },

    parse_params: function (params) {
        if (params !== undefined && params !== null &&
            params !== [] && params !== "")
        {
            if (params.constructor === String) {
                if (params.slice(0,1) === "[" &&
                    params.slice(-1) === "]")
                {
                    params = JSON.parse(params);
                }
                if (params.constructor === String) {
                    params = [params];
                }
            } else if (params.constructor === Number) {
                params = [params];
            }
        } else {
            params = [];
        }
        return params;
    },

    encode_int256: function (encoding, param) {
        if (param !== undefined && param !== null && param !== [] && param !== "") {

            // input is a javascript number
            if (param.constructor === Number) {
                param = numeric.bignum(param);
                if (param.lt(new BigNumber(0))) {
                    param = param.add(constants.MOD);
                }
                encoding.statics += this.pad_left(numeric.encode_int(param));

            // input is a string
            } else if (param.constructor === String) {

                // negative hex
                if (param.slice(0,1) === '-') {
                    encoding.statics += this.pad_left(numeric.encode_int(param));

                // positive hex
                } else if (param.slice(0,2) === "0x") {
                    encoding.statics += this.pad_left(param.slice(2), true);

                // decimal (base-10 integer)
                } else {
                    encoding.statics += this.pad_left(numeric.encode_int(param));
                }
            }

            // size in multiples of 32
            encoding.chunks += Math.ceil(encoding.statics.length / 64);
        }
        return encoding;
    },

    encode_bytesN: function (encoding, param, num_bytes) {
        if (param !== undefined && param !== null && param !== [] && param !== "") {
            while (param.length) {
                encoding.statics += this.pad_right(numeric.encode_hex(param.slice(0, 64)));
                param = param.slice(64);
            }
            encoding.chunks += Math.ceil(encoding.statics.length / 64);
        }
        return encoding;
    },

    encode_bytes: function (encoding, param, num_params) {
        // offset (in 32-byte chunks)
        encoding.statics += this.pad_left(numeric.encode_int(32 * (num_params + Math.ceil(encoding.dynamics.length / 64))));
        encoding.dynamics += this.pad_left(numeric.encode_int(param.length));
        encoding.dynamics += this.pad_right(numeric.encode_hex(param));
        return encoding;
    },

    encode_int256a: function (encoding, param, num_params) {
        encoding.statics += this.pad_left(numeric.encode_int(32 * (num_params + Math.ceil(encoding.dynamics.length / 64))));
        var arraylen = param.length;
        encoding.dynamics += this.pad_left(numeric.encode_int(arraylen));
        for (var j = 0; j < arraylen; ++j) {
            if (param[j] !== undefined) {
                if (param[j].constructor === Number) {
                    encoding.dynamics += this.pad_left(numeric.encode_int(numeric.bignum(param[j]).mod(constants.MOD).toFixed()));
                } else if (param[j].constructor === String) {
                    if (param[j].slice(0,1) === '-') {
                        encoding.dynamics += this.pad_left(numeric.encode_int(numeric.bignum(param[j]).mod(constants.MOD).toFixed()));
                    } else if (param[j].slice(0,2) === "0x") {
                        encoding.dynamics += this.pad_left(param[j].slice(2), true);
                    } else {
                        encoding.dynamics += this.pad_left(numeric.encode_int(numeric.bignum(param[j]).mod(constants.MOD).toFixed()));
                    }
                }
            }
        }
        return encoding;
    },

    abi_data: function (itx) {
        var tx, num_params, types, encoding;
        tx = utils.copy(itx);
        
        // parse signature and parameter array
        types = this.parse_signature(tx.signature);
        num_params = tx.signature.replace(/\d+/g, '').length;
        tx.params = this.parse_params(tx.params);

        // chunks: size of the static encoding (in multiples of 32)
        encoding = { chunks: 0, statics: '', dynamics: '' };

        // encode parameters
        if (num_params === tx.params.length) {
            for (var i = 0; i < num_params; ++i) {
                if (types[i] === "int256") {
                    encoding = this.encode_int256(encoding, tx.params[i]);
                } else if (types[i] === "bytes" || types[i] === "string") {
                    encoding = this.encode_bytes(encoding, tx.params[i], num_params);
                } else if (types[i] === "int256[]") {
                    encoding = this.encode_int256a(encoding, tx.params[i], num_params);
                } else {
                    var num_bytes = parseInt(types[i].replace("bytes", ''));
                    encoding = this.encode_bytesN(encoding, tx.params[i], num_bytes);
                }
            }
            return encoding.statics + encoding.dynamics;

        // number of parameters provided didn't match the signature
        } else {
            return new Error("wrong number of parameters");
        }
    },

    // hex-encode a function's ABI data and return it
    encode: function (tx) {
        tx.signature = tx.signature || "";
        return this.abi_prefix(tx.method, tx.signature) + this.abi_data(tx);
    }
};
