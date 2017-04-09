"use strict";

var BigNumber = require("bignumber.js");
var clone = require("clone");
var abi = require("augur-abi");
var keys = require("keythereum");
var sha3 = require("../utils/sha3");
var constants = require("../constants");
var store = require("../store");

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

  // So in the scenario where it's indeterminate getUncaughtOutcome will be 0.5*10^18 and getOutcome will be middle of the range, so if range is 0-200 it'll be 100*10^18
  // When it's not indeterminate and it lands halfway getUncaughtOutcome should be 0.5*10^18 + 1 and getOutcome will be like 100*10^18 + some fraction of a quadrillionth or so
  // Like how 0 outcomes should report 1 (which is some super tiny fraction)
  // When it's determinate to differentiate for scalars and categoricals it should be .5*fxp + 1
  // And for differentiating for indeterminate, indeterminate ones should be .5*fxp
  isIndeterminateConsensusOutcome: function (consensusOutcome, minValue, maxValue) {
    if (consensusOutcome.eq(maxValue.plus(minValue).dividedBy(2))) {
      return consensusOutcome.toFixed();
    }
    return false;
  },

  isIndeterminateReport: function (fxpReport, type) {
    var bnFxpReport = abi.bignum(fxpReport);
    if (type === "binary" && bnFxpReport.eq(constants.BINARY_INDETERMINATE)) {
      return "1.5";
    } else if (bnFxpReport.eq(constants.CATEGORICAL_SCALAR_INDETERMINATE)) {
      return "0.5";
    }
    return false;
  },

  isSpecialValueConsensusOutcome: function (fxpConsensusOutcome, minValue, maxValue) {
    var bnFxpConsensusOutcome, meanValue;
    bnFxpConsensusOutcome = abi.bignum(fxpConsensusOutcome);
    if (bnFxpConsensusOutcome.eq(1)) {
      return "0";
    }
    meanValue = abi.fix(maxValue).plus(abi.fix(minValue)).dividedBy(2);
    if (bnFxpConsensusOutcome.eq(meanValue.plus(1))) {
      return abi.unfix(meanValue, "string");
    }
    return false;
  },

  isSpecialValueReport: function (fxpReport) {
    var bnFxpReport = abi.bignum(fxpReport);
    if (bnFxpReport.eq(1)) {
      return "0";
    }
    if (bnFxpReport.eq(constants.INDETERMINATE_PLUS_ONE)) {
      return "0.5";
    }
    return false;
  },

  unfixReport: function (rawReport, minValue, maxValue, type) {
    var report, indeterminateReport, specialValueReport, bnMinValue;
    indeterminateReport = this.isIndeterminateReport(rawReport, type);
    if (indeterminateReport) {
      return {report: indeterminateReport, isIndeterminate: true};
    }
    if (type === "binary") {
      return {report: abi.unfix(rawReport, "string"), isIndeterminate: false};
    }
    if (type === "scalar") {
      specialValueReport = this.isSpecialValueReport(rawReport);
      if (specialValueReport) {
        return {report: specialValueReport, isIndeterminate: false};
      }
    }
    // x = (max - min)*y + min
    bnMinValue = abi.bignum(minValue);
    report = abi.unfix(rawReport).times(abi.bignum(maxValue).minus(bnMinValue)).plus(bnMinValue);
    if (type === "categorical") report = report.round();
    return {report: report.toFixed(), isIndeterminate: false};
  },

  unfixConsensusOutcome: function (fxpConsensusOutcome, minValue, maxValue, type) {
    var bnMinValue, bnMaxValue, consensusOutcome, indeterminateConsensusOutcome, specialValueConsensusOutcome;
    bnMinValue = new BigNumber(minValue, 10);
    bnMaxValue = new BigNumber(maxValue, 10);
    consensusOutcome = abi.unfix_signed(fxpConsensusOutcome);
    indeterminateConsensusOutcome = this.isIndeterminateConsensusOutcome(consensusOutcome, bnMinValue, bnMaxValue);
    if (indeterminateConsensusOutcome) {
      return {outcomeID: indeterminateConsensusOutcome, isIndeterminate: true};
    }
    if (type !== "binary") {
      specialValueConsensusOutcome = this.isSpecialValueConsensusOutcome(fxpConsensusOutcome, bnMinValue, bnMaxValue);
      if (specialValueConsensusOutcome) {
        return {outcomeID: specialValueConsensusOutcome, isIndeterminate: false};
      }
    }
    return {outcomeID: consensusOutcome.toFixed(), isIndeterminate: false};
  },

  // report in fixed-point
  makeHash: function (salt, report, event, from) {
    return sha3([from, abi.hex(salt), report, event]);
  },

  // report in fixed-point
  encryptReport: function (report, key, salt) {
    if (!Buffer.isBuffer(report)) report = Buffer.from(abi.pad_left(abi.hex(report)), "hex");
    if (!Buffer.isBuffer(key)) key = Buffer.from(abi.pad_left(abi.hex(key)), "hex");
    if (!salt) salt = Buffer.from("11111111111111111111111111111111", "hex");
    if (!Buffer.isBuffer(salt)) salt = Buffer.from(abi.pad_left(abi.hex(salt)), "hex");
    return abi.prefix_hex(keys.encrypt(report, key, salt.slice(0, 16), constants.REPORT_CIPHER).toString("hex"));
  },

  // returns plaintext fixed-point report
  decryptReport: function (encryptedReport, key, salt) {
    if (!Buffer.isBuffer(encryptedReport)) encryptedReport = Buffer.from(abi.pad_left(abi.hex(encryptedReport)), "hex");
    if (!Buffer.isBuffer(key)) key = Buffer.from(abi.pad_left(abi.hex(key)), "hex");
    if (!salt) salt = Buffer.from("11111111111111111111111111111111", "hex");
    if (!Buffer.isBuffer(salt)) salt = Buffer.from(abi.pad_left(abi.hex(salt)), "hex");
    return abi.prefix_hex(keys.decrypt(encryptedReport, key, salt.slice(0, 16), constants.REPORT_CIPHER).toString("hex"));
  },

  parseAndDecryptReport: function (arr, secret) {
    var salt;
    if (!arr || arr.constructor !== Array || arr.length < 2) return null;
    salt = this.decryptReport(arr[1], secret.derivedKey, secret.salt);
    return {
      salt: salt,
      report: this.decryptReport(arr[0], secret.derivedKey, salt),
      ethics: (arr.length > 2) ? arr[2] : false
    };
  },

  getAndDecryptReport: function (branch, expDateIndex, reporter, event, secret, callback) {
    var tx;
    if (branch && branch.constructor === Object) {
      expDateIndex = branch.expDateIndex;
      reporter = branch.reporter;
      event = branch.event;
      secret = branch.secret;
      callback = callback || branch.callback;
      branch = branch.branch;
    }
    tx = clone(store.getState().contractsAPI.functions.ExpiringEvents.getEncryptedReport);
    tx.params = [branch, expDateIndex, reporter, event];
    return this.fire(tx, callback, this.parseAndDecryptReport, secret);
  },

  submitReportHash: function (event, reportHash, encryptedReport, encryptedSalt, ethics, branch, period, periodLength, onSent, onSuccess, onFailed) {
    var tx, self = this;
    if (event && event.constructor === Object) {
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
    tx = clone(store.getState().contractsAPI.functions.MakeReports.submitReportHash);
    tx.params = [
      event,
      reportHash,
      encryptedReport || 0,
      encryptedSalt || 0,
      abi.fix(ethics, "hex")
    ];
    if (this.options.debug.reporting) {
      console.log("submitReportHash tx:", JSON.stringify(tx, null, 2));
    }
    return this.transact(tx, onSent, function (res) {
      if (self.options.debug.reporting) {
        console.log("submitReportHash response:", res.callReturn);
      }
      res.callReturn = abi.bignum(res.callReturn, "string", true);
      if (res.callReturn === "0") {
        return self.checkPeriod(branch, periodLength, res.from, function (err) {
          if (err) return onFailed(err);
          self.getRepRedistributionDone(branch, res.from, function (repRedistributionDone) {
            if (self.options.debug.reporting) {
              console.log("rep redistribution done:", repRedistributionDone);
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
      console.log("submitReport params:", event, abi.hex(salt), this.fixReport(report, minValue, maxValue, type, isIndeterminate), ethics);
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
