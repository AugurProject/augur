/**
 * Numerical methods
 */

"use strict";

var BigNumber = require("bignumber.js");
var constants = require("./constants");

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

module.exports = {

    remove_leading_zeros: function (h) {
        var hex = h.toString();
        if (hex.slice(0, 2) === "0x") {
            hex = hex.slice(2);
        }
        if (!/^0+$/.test(hex)) {
            while (hex.slice(0, 2) === "00") {
                hex = hex.slice(2);
            }
        }
        return hex;
    },

    remove_trailing_zeros: function (h) {
        var hex = h.toString();
        while (hex.slice(-2) === "00") {
            hex = hex.slice(0,-2);
        }
        return hex;
    },

    // convert bytes to hex
    encode_hex: function (str) {
        var hexbyte, hex = '';
        for (var i = 0, len = str.length; i < len; ++i) {
            hexbyte = str.charCodeAt(i).toString(16);
            if (hexbyte.length === 1) hexbyte = "0" + hexbyte;
            hex += hexbyte;
        }
        return hex;
    },

    decode_hex: function (h, strip) {
        var hex = h.toString();
        var str = '';
        // first 32 bytes = offset
        // second 32 bytes = string length
        if (strip) {
            if (hex.slice(0,2) === "0x") hex = hex.slice(2);
            hex = hex.slice(128);
            hex = this.remove_trailing_zeros(hex);
        }
        for (var i = 0, l = hex.length; i < l; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
    },

    prefix_hex: function (n) {
        if (n !== undefined && n !== null) {
            if (n.constructor === Number || n.constructor === BigNumber) {
                n = n.toString(16);
            }
            if (n.slice(0,2) !== "0x" && n.slice(0,3) !== "-0x") {
                if (n.slice(0,1) === '-') {
                    n = "-0x" + n.slice(1);
                } else {
                    n = "0x" + n;
                }
            }
        }
        return n;
    },

    bignum: function (n, encoding, nowrap) {
        var bn, len;
        if (n !== null && n !== undefined && n !== "0x") {
            switch (n.constructor) {
                case Number:
                    if (Math.floor(Math.log(n) / Math.log(10) + 1) <= 15) {
                        bn = new BigNumber(n);
                    } else {
                        n = n.toString();
                        try {
                            bn = new BigNumber(n);
                        } catch (exc) {
                            if (n.slice(0,1) === '-') {
                                bn = new BigNumber("-0x" + n.slice(1));
                            }
                            bn = new BigNumber("0x" + n);
                        }
                    }
                    break;
                case String:
                    try {
                        bn = new BigNumber(n);
                    } catch (exc) {
                        if (n.slice(0, 1) === '-') {
                            bn = new BigNumber("-0x" + n.slice(1));
                        } else {
                            bn = new BigNumber("0x" + n);
                        }
                    }
                    break;
                case BigNumber:
                    bn = n;
                    break;
                case Array:
                    len = n.length;
                    bn = new Array(len);
                    for (var i = 0; i < len; ++i) {
                        bn[i] = this.bignum(n[i], encoding);
                    }
                    break;
                default:
                    return n;
            }
            if (bn !== undefined && bn !== null && bn.constructor === BigNumber) {
                if (!nowrap && bn.gte(constants.BYTES_32)) {
                    bn = bn.sub(constants.MOD);
                }
                if (encoding) {
                    if (encoding === "number") {
                        bn = bn.toNumber();
                    } else if (encoding === "string") {
                        bn = bn.toFixed();
                    } else if (encoding === "hex") {
                        bn = this.prefix_hex(bn.toString(16));
                    }
                }
            }
            return bn;
        } else {
            return n;
        }
    },

    hex: function (n, nowrap) {
        var h;
        if (n !== undefined && n !== null && n.constructor) {
            switch (n.constructor) {
                case Object:
                    h = this.encode_hex(JSON.stringify(n));
                    break;
                case Array:
                    h = this.encode_hex(JSON.stringify(n));
                    break;
                case BigNumber:
                    h = n.toString(16);
                    break;
                case String:
                    if (n === "-0x0") {
                        h = "0x0";
                    } else if (n === "-0") {
                        h = "0";
                    } else if (n.slice(0, 3) === "-0x" || n.slice(0, 2) === "-0x") {
                        h = n;
                    } else {
                        if (isFinite(n)) {
                            h = this.bignum(n, "hex", nowrap);
                        } else {
                            h = this.encode_hex(n);
                        }
                    }
                    break;
                case Boolean:
                    h = (n) ? "0x1" : "0x0";
                    break;
                default:
                    h = this.bignum(n, "hex");
            }
        }
        return this.prefix_hex(h);
    },

    /**************************
     * Fixed-point conversion *
     **************************/

    fix: function (n, encode) {
        var fixed;
        if (n && n !== "0x") {
            if (encode) encode = encode.toLowerCase();
            if (n.constructor === Array) {
                var len = n.length;
                fixed = new Array(len);
                for (var i = 0; i < len; ++i) {
                    fixed[i] = this.fix(n[i], encode);
                }
            } else {
                if (n.constructor === BigNumber) {
                    fixed = n.mul(constants.ONE).round();
                } else {
                    fixed = this.bignum(n).mul(constants.ONE).round();
                }
                if (fixed && fixed.gte(constants.BYTES_32)) {
                    fixed = fixed.sub(constants.MOD);
                }
                if (encode) {
                    if (encode === "string") {
                        fixed = fixed.toFixed();
                    } else if (encode === "hex") {
                        fixed = this.prefix_hex(fixed);
                    }
                }
            }
            return fixed;
        } else {
            return n;
        }
    },

    unfix: function (n, encode) {
        var unfixed;
        if (n && n !== "0x") {
            if (encode) encode = encode.toLowerCase();
            if (n.constructor === Array) {
                var len = n.length;
                unfixed = new Array(len);
                for (var i = 0; i < len; ++i) {
                    unfixed[i] = this.unfix(n[i], encode);
                }
            } else {
                if (n.constructor === BigNumber) {
                    unfixed = n.dividedBy(constants.ONE);
                } else {
                    unfixed = this.bignum(n).dividedBy(constants.ONE);
                }
                if (encode) {
                    if (encode === "hex") {
                        unfixed = this.prefix_hex(unfixed);
                    } else if (encode === "string") {
                        unfixed = unfixed.toFixed();
                    } else if (encode === "number") {
                        unfixed = unfixed.toNumber();
                    }
                }
            }
            return unfixed;
        } else {
            return n;
        }
    }

};
