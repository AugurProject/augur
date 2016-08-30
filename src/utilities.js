"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var crypto = require("crypto");
var BigNumber = require("bignumber.js");
var clone = require("clone");
var abi = require("augur-abi");
var constants = require("./constants");

BigNumber.config({
    MODULO_MODE: BigNumber.EUCLID,
    ROUNDING_MODE: BigNumber.ROUND_HALF_EVEN
});

module.exports = {

    noop: function () {},

    pass: function (o) { return o; },

    is_function: function (f) {
        return Object.prototype.toString.call(f) === "[object Function]";
    },

    STRIP_COMMENTS: /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,

    ARGUMENT_NAMES: /([^\s,]+)/g,

    compose: function (prepare, callback) {
        if (!this.is_function(callback)) return null;
        if (!this.is_function(prepare)) return callback;
        return function (result) { return prepare(result, callback); };
    },

    labels: function (func) {
        var fnStr = func.toString().replace(this.STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(this.ARGUMENT_NAMES);
        if (result === null) result = [];
        return result;
    },

    unpack: function (o, labels, args) {
        var params = [], cb = [];

        // unpack object argument
        if (o !== undefined && o !== null && o.constructor === Object &&
            labels && labels.constructor === Array && labels.length) {
            for (var i = 0, len = labels.length; i < len; ++i) {
                if (o[labels[i]] !== undefined) {
                    if (o[labels[i]].constructor === Function) {
                        cb.push(o[labels[i]]);
                    } else {
                        params.push(o[labels[i]]);
                    }
                }
            }

        // unpack positional arguments
        } else {
            for (var j = 0, arglen = args.length; j < arglen; ++j) {
                if (args[j] !== undefined) {
                    if (args[j] && args[j].constructor === Function) {
                        cb.push(args[j]);
                    } else {
                        params.push(args[j]);
                    }
                }
            }
        }

        return { params: params, cb: cb };
    },

    sha256: function (hashable) {
        var x = clone(hashable);
        if (x && x.constructor === Array) {
            var digest, cat = "";
            for (var i = 0, n = x.length; i < n; ++i) {
                if (x[i] !== null && x[i] !== undefined) {

                    // array element is a javascript number
                    // (base-10 numbers)
                    if (x[i].constructor === Number) {
                        x[i] = abi.bignum(x[i]);
                        if (x[i].lt(constants.ZERO)) {
                            x[i] = x[i].add(abi.constants.MOD);
                        }
                        cat += abi.encode_int(x[i]);

                    // array element is a string: text or hex
                    } else if (x[i].constructor === String) {

                        // negative hex
                        if (x[i].slice(0,1) === '-') {
                            x[i] = abi.bignum(x[i]).add(abi.constants.MOD).toFixed();
                            cat += abi.encode_int(x[i]);

                        // positive hex
                        } else if (x[i].slice(0,2) === "0x") {
                            cat += abi.pad_left(x[i].slice(2));

                        // text string
                        } else {
                            cat += new Buffer(x[i], "utf8").toString("hex");
                        }
                    }
                }
            }
            digest = new BigNumber(this.sha256(new Buffer(cat, "hex")), 16);
            if (digest.gt(new BigNumber(2).toPower(255))) {
                return abi.hex(digest.sub(abi.constants.MOD));
            }
            return abi.hex(digest);
        }
        return crypto.createHash("sha256").update(x).digest("hex");
    },

    serialize: function (x) {
        var serialized;
        if (x !== null && x !== undefined) {

            // array element is a javascript number
            // (base-10 numbers)
            if (x.constructor === Number) {
                x = abi.bignum(x);
                if (x.lt(constants.ZERO)) {
                    x = x.add(abi.constants.MOD);
                }
                serialized = abi.encode_int(x);

            // array element is a string: text or hex
            } else if (x.constructor === String) {

                // negative hex
                if (x.slice(0,1) === '-') {
                    x = abi.bignum(x).add(abi.constants.MOD).toFixed();
                    serialized = abi.encode_int(x);

                // positive hex
                } else if (x.slice(0,2) === "0x") {
                    serialized = abi.pad_left(x.slice(2));

                // text string
                } else {
                    serialized = new Buffer(x, "utf8").toString("hex");
                }
            }
        }
        return serialized;
    },

    sha3: function (hashable) {
        var x = clone(hashable);
        var serialized;
        if (x && x.constructor === Array) {
            serialized = "";
            for (var i = 0, n = x.length; i < n; ++i) {
                serialized += this.serialize(x[i]);
            }
        } else {
            serialized = this.serialize(x);
        }
        return abi.prefix_hex(abi.sha3(serialized));
    }

};
