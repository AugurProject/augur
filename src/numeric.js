/**
 * Numerical methods
 */

"use strict";

var BigNumber = require("bignumber.js");
var constants = require("./constants");

module.exports = {

  encode_int: function (value) {
    var cs = [];
    var x = new BigNumber(value);
    while (x.gt(new BigNumber(0))) {
      cs.push(String.fromCharCode(x.mod(new BigNumber(256))));
      x = x.dividedBy(new BigNumber(256)).floor();
    }
    return (cs.reverse()).join('');
  },

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
    return n;
  },

  bignum: function (n, encoding, compact) {
    var bn, len;
    if (n !== null && n !== undefined && n !== "0x") {
      if (n.constructor === Number) {
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
      } else if (n.constructor === String) {
        try {
          bn = new BigNumber(n);
        } catch (exc) {
          if (n.slice(0,1) === '-') {
            bn = new BigNumber("-0x" + n.slice(1));
          }
          bn = new BigNumber("0x" + n);
        }
      } else if (n.constructor === BigNumber) {
        bn = n;
      } else if (n.constructor === Array ) {
        len = n.length;
        bn = new Array(len);
        for (var i = 0; i < len; ++i) {
          bn[i] = this.bignum(n[i]);
        }
      }
      if (bn && bn.constructor !== Array && bn.gt(constants.BYTES_32)) {
        bn = bn.sub(constants.MOD);
      }
      if (compact && bn.constructor !== Array) {
        var cbn = bn.sub(constants.MOD);
        if (bn.toString(16).length > cbn.toString(16).length) {
          bn = cbn;
        }
      }
      if (bn && encoding) {
        if (encoding === "number") {
          bn = bn.toNumber();
        } else if (encoding === "string") {
          bn = bn.toFixed();
        } else if (encoding === "hex") {
          bn = bn.toString(16);
        }
      }
      return bn;
    } else {
      return n;
    }
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
        if (fixed && fixed.gt(constants.BYTES_32)) {
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
