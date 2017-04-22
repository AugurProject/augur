"use strict";

var abi = require("augur-abi");
var keythereum = require("keythereum");
var REPORT_CIPHER = require("../constants").REPORT_CIPHER;

// report in fixed-point
function encryptReport(report, key, salt) {
  if (!Buffer.isBuffer(report)) report = Buffer.from(abi.pad_left(abi.hex(report)), "hex");
  if (!Buffer.isBuffer(key)) key = Buffer.from(abi.pad_left(abi.hex(key)), "hex");
  if (!salt) salt = Buffer.from("11111111111111111111111111111111", "hex");
  if (!Buffer.isBuffer(salt)) salt = Buffer.from(abi.pad_left(abi.hex(salt)), "hex");
  return abi.prefix_hex(keythereum.encrypt(report, key, salt.slice(0, 16), REPORT_CIPHER).toString("hex"));
}

module.exports = encryptReport;
