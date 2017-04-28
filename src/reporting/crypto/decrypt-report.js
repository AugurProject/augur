"use strict";

var abi = require("augur-abi");
var keythereum = require("keythereum");
var REPORT_CIPHER = require("../../constants").REPORT_CIPHER;

// returns plaintext fixed-point report
function decryptReport(encryptedReport, key, salt) {
  if (!Buffer.isBuffer(encryptedReport)) encryptedReport = Buffer.from(abi.pad_left(abi.hex(encryptedReport)), "hex");
  if (!Buffer.isBuffer(key)) key = Buffer.from(abi.pad_left(abi.hex(key)), "hex");
  if (!salt) salt = Buffer.from("11111111111111111111111111111111", "hex");
  if (!Buffer.isBuffer(salt)) salt = Buffer.from(abi.pad_left(abi.hex(salt)), "hex");
  return abi.prefix_hex(keythereum.decrypt(encryptedReport, key, salt.slice(0, 16), REPORT_CIPHER).toString("hex"));
}

module.exports = decryptReport;
