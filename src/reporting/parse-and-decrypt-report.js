"use strict";

var decryptReport = require("./decrypt-report");

function parseAndDecryptReport(arr, secret) {
  var salt;
  if (!Array.isArray(arr) || arr.length < 2) return null;
  salt = decryptReport(arr[1], secret.derivedKey, secret.salt);
  return {
    salt: salt,
    report: decryptReport(arr[0], secret.derivedKey, salt),
    ethics: (arr.length > 2) ? arr[2] : false
  };
}

module.exports = parseAndDecryptReport;
