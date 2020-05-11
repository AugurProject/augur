'use strict'

/*
 * base58.js
 *  - encodes integers to and decodes from a base58 (or your own) base58 alphabet
 *  - based on Flickr's url shortening
 *
 * usage:
 *   base58.encode(integer);
 *   base58.decode(string);
 *
 * (c) 2012 inflammable/raromachine
 * Licensed under the MIT License.
 *
 */

export default function baseX (alphabet) {
  const base = alphabet.length

  return {
    encode: function (enc) {
      if (typeof enc !== 'number' || enc !== parseInt(enc)) {
        throw new Error('"encode" only accepts integers.')
      }
      let encoded = ''
      while (enc) {
        const remainder = enc % base
        enc = Math.floor(enc / base)
        encoded = alphabet[remainder].toString() + encoded
      }
      return encoded
    },
    decode: function (dec) {
      if (typeof dec !== 'string') throw new Error('"decode" only accepts strings.')
      let decoded = 0
      while (dec) {
        const alphabetPosition = alphabet.indexOf(dec[0])
        if (alphabetPosition < 0) {
          throw new Error(
            '"decode" can\'t find "' + dec[0] + '" in the alphabet: "' + alphabet + '"'
          )
        }
        const powerOf = dec.length - 1
        decoded += alphabetPosition * Math.pow(base, powerOf)
        dec = dec.substring(1)
      }
      return decoded
    }
  }
}

export const base58 = baseX('123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ')
