/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var keys = require("keythereum");
var contracts = require("augur-contracts");
var utils = require("../utilities");
var constants = require("../constants");

module.exports = {

  // rules: http://docs.augur.net/#reporting-outcomes
  fixReport: function (report, minValue, maxValue, type, isIndeterminate) {
    var fixedReport, rescaledReport, bnMinValue;
    if (isIndeterminate) {
      if (type === "binary") {
        fixedReport = abi.hex(constants.BINARY_INDETERMINATE);
      } else {
        fixedReport = abi.hex(constants.CATEGORICAL_SCALAR_INDETERMINATE);
      }
    } else {
      if (type === "binary") {
        fixedReport = abi.fix(report, "hex");
      } else {
        // y = (x - min)/(max - min)
        bnMinValue = abi.bignum(minValue);
        rescaledReport = abi.bignum(report).minus(bnMinValue).dividedBy(
          abi.bignum(maxValue).minus(bnMinValue)
        );
        if (rescaledReport.eq(constants.ZERO)) {
          fixedReport = "0x1";
        } else {
          fixedReport = abi.fix(rescaledReport, "hex");
        }
      }

      // if report is equal to fix(0.5) but is not indeterminate,
      // then set report to fix(0.5) + 1
      if (abi.bignum(fixedReport).eq(constants.CATEGORICAL_SCALAR_INDETERMINATE)) {
        fixedReport = abi.hex(constants.INDETERMINATE_PLUS_ONE);
      }
    }
    return fixedReport;
  },

  unfixReport: function (fixedReport, minValue, maxValue, type) {
    var report, bnMinValue, bnFixedReport;
    bnFixedReport = abi.bignum(fixedReport);
    if (bnFixedReport.eq(constants.BINARY_INDETERMINATE)) {
      return {report: "1.5", isIndeterminate: true};
    } else if (bnFixedReport.eq(constants.CATEGORICAL_SCALAR_INDETERMINATE)) {
      return {report: "0.5", isIndeterminate: true};
    } else if (bnFixedReport.eq(constants.INDETERMINATE_PLUS_ONE)) {
      return {report: "0.5", isIndeterminate: false};
    }
    if (type === "binary") {
      report = abi.unfix(fixedReport);
    } else {
      if (bnFixedReport.eq(abi.bignum(1))) {
        fixedReport = "0";
      }
      // x = (max - min)*y + min
      bnMinValue = abi.bignum(minValue);
      report = abi.unfix(fixedReport).times(
        abi.bignum(maxValue).minus(bnMinValue)
      ).plus(bnMinValue);
    }
    if (type !== "scalar") {
      report = report.round();
    }
    return {report: report.toFixed(), isIndeterminate: false};
  },

  // report in fixed-point
  makeHash: function (salt, report, event, from) {
    return utils.sha3([from || this.from, abi.hex(salt), report, event]);
  },

  // report in fixed-point
  encryptReport: function (report, key, salt) {
    if (!Buffer.isBuffer(report)) report = new Buffer(abi.pad_left(abi.hex(report)), "hex");
    if (!Buffer.isBuffer(key)) key = new Buffer(abi.pad_left(abi.hex(key)), "hex");
    if (!salt) salt = new Buffer("11111111111111111111111111111111", "hex");
    if (!Buffer.isBuffer(salt)) salt = new Buffer(abi.pad_left(abi.hex(salt)), "hex");
    return abi.prefix_hex(
      new Buffer(
        keys.encrypt(report, key, salt.slice(0, 16), constants.REPORT_CIPHER),
        "base64"
      ).toString("hex")
    );
  },

  // returns plaintext fixed-point report
  decryptReport: function (encryptedReport, key, salt) {
    if (!Buffer.isBuffer(encryptedReport)) encryptedReport = new Buffer(abi.pad_left(abi.hex(encryptedReport)), "hex");
    if (!Buffer.isBuffer(key)) key = new Buffer(abi.pad_left(abi.hex(key)), "hex");
    if (!salt) salt = new Buffer("11111111111111111111111111111111", "hex");
    if (!Buffer.isBuffer(salt)) salt = new Buffer(abi.pad_left(abi.hex(salt)), "hex");
    return abi.prefix_hex(
      keys.decrypt(encryptedReport, key, salt.slice(0, 16), constants.REPORT_CIPHER)
    );
  },

  parseAndDecryptReport: function (arr, secret) {
    if (!arr || arr.constructor !== Array || arr.length < 2) return null;
    var salt = this.decryptReport(arr[1], secret.derivedKey, secret.salt);
    return {
      salt: salt,
      report: this.decryptReport(arr[0], secret.derivedKey, salt),
      ethics: (arr.length > 2) ? arr[2] : false
    };
  },

  getAndDecryptReport: function (branch, expDateIndex, reporter, event, secret, callback) {
    var self = this;
    if (branch.constructor === Object) {
      expDateIndex = branch.expDateIndex;
      reporter = branch.reporter;
      event = branch.event;
      secret = branch.secret;
      callback = callback || branch.callback;
      branch = branch.branch;
    }
    var tx = clone(this.tx.ExpiringEvents.getEncryptedReport);
    tx.params = [branch, expDateIndex, reporter, event];
    return this.fire(tx, callback, this.parseAndDecryptReport, secret);
  },

  submitReportHash: function (event, reportHash, encryptedReport, encryptedSalt, ethics, branch, period, periodLength, onSent, onSuccess, onFailed) {
    var self = this;
    if (event.constructor === Object) {
      reportHash = event.reportHash;
      encryptedReport = event.encryptedReport;
      encryptedSalt = event.encryptedSalt;
      ethics = event.ethics;
      branch = event.branch;
      period = event.period;
      periodLength = event.periodLength;
      onSent = event.onSent;
      onSuccess = event.onSuccess;
      onFailed = event.onFailed;
      event = event.event;
    }
    if (this.getCurrentPeriodProgress(periodLength) >= 50) {
      return onFailed({"-2": "not in first half of period (commit phase)"});
    }
    var tx = clone(this.tx.MakeReports.submitReportHash);
    tx.params = [
      event,
      reportHash,
      encryptedReport || 0,
      encryptedSalt || 0,
      abi.fix(ethics, "hex")
    ];
    if (this.options.debug.reporting) {
      console.log('submitReportHash tx:', JSON.stringify(tx, null, 2));
    }
    return this.transact(tx, onSent, function (res) {
      if (self.options.debug.reporting) {
        console.log('submitReportHash response:', res.callReturn);
      }
      res.callReturn = abi.bignum(res.callReturn, "string", true);
      if (res.callReturn === "0") {
        return self.checkPeriod(branch, periodLength, res.from, function (err, newPeriod) {
          if (err) return onFailed(err);
          self.getRepRedistributionDone(branch, res.from, function (repRedistributionDone) {
            if (self.options.debug.reporting) {
              console.log('rep redistribution done:', repRedistributionDone);
            }
            if (repRedistributionDone === "0") {
              return onFailed("rep redistribution not done");
            }
            self.submitReportHash({
              event: event,
              reportHash: reportHash,
              encryptedReport: encryptedReport,
              encryptedSalt: encryptedSalt,
              ethics: ethics,
              branch: branch,
              period: period,
              periodLength: periodLength,
              onSent: onSent,
              onSuccess: onSuccess,
              onFailed: onFailed
            });
          });
        });
      } else if (res.callReturn !== "-2") {
        return onSuccess(res);
      }
      self.ExpiringEvents.getReportHash({
        branch: branch,
        expDateIndex: period,
        reporter: res.from,
        event: event,
        callback: function (storedReportHash) {
          if (parseInt(storedReportHash, 16)) {
            res.callReturn = "1";
            return onSuccess(res);
          }
          onFailed({"-2": "not in first half of period (commit phase)"});
        }
      });
    }, onFailed);
  },

  submitReport: function (event, salt, report, ethics, minValue, maxValue, type, isIndeterminate, onSent, onSuccess, onFailed) {
    if (event.constructor === Object) {
      salt = event.salt;
      report = event.report;
      ethics = event.ethics;
      minValue = event.minValue;
      maxValue = event.maxValue;
      type = event.type;
      isIndeterminate = event.isIndeterminate;
      onSent = event.onSent;
      onSuccess = event.onSuccess;
      onFailed = event.onFailed;
      event = event.event;
    }
    if (this.options.debug.reporting) {
      console.log('MakeReports.submitReport params:',
        event,
        abi.hex(salt),
        this.fixReport(report, minValue, maxValue, type, isIndeterminate),
        ethics);
    }
    return this.MakeReports.submitReport(
      event,
      abi.hex(salt),
      this.fixReport(report, minValue, maxValue, type, isIndeterminate),
      ethics,
      onSent,
      onSuccess,
      onFailed
    );
  }
};
