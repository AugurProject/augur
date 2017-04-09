"use strict";

var abi = require("augur-abi");

module.exports = {
  slashRep: function (branch, salt, report, reporter, eventID, minValue, maxValue, type, isIndeterminate, isUnethical, onSent, onSuccess, onFailed) {
    var fixedReport;
    if (branch && branch.constructor === Object) {
      salt = branch.salt;
      report = branch.report;
      reporter = branch.reporter;
      eventID = branch.eventID;
      minValue = branch.minValue;
      maxValue = branch.maxValue;
      type = branch.type;
      isIndeterminate = branch.isIndeterminate;
      isUnethical = branch.isUnethical;
      onSent = branch.onSent;
      onSuccess = branch.onSuccess;
      onFailed = branch.onFailed;
      branch = branch.branch;
    }
    fixedReport = this.fixReport(report, minValue, maxValue, type, isIndeterminate);
    if (this.options.debug.reporting) {
      console.log("slashRep params:");
      console.log(" - branch:", branch);
      console.log(" - salt:", salt, abi.hex(salt));
      console.log(" - report:", report);
      console.log(" - fixedReport:", fixedReport);
      console.log(" - reporter:", reporter);
      console.log(" - eventID:", eventID);
      console.log(" - minValue:", minValue);
      console.log(" - maxValue:", maxValue);
      console.log(" - type:", type);
      console.log(" - isIndeterminate:", isIndeterminate);
      console.log(" - isUnethical:", isUnethical);
    }
    return this.SlashRep.slashRep(branch, abi.hex(salt), fixedReport, reporter, eventID, onSent, onSuccess, onFailed);
  }
};
