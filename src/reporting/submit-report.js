"use strict";

var assign = require("lodash.assign");
var abi = require("augur-abi");
var fixReport = require("./format/fix-report");
var api = require("../api");
var isObject = require("../utils/is-object");

// { event, salt, report, ethics, minValue, maxValue, type, isIndeterminate }
function submitReport(p) {
  return api().MakeReports.submitReport(assign({}, p, {
    salt: abi.hex(p.salt),
    report: fixReport(p.report, p.minValue, p.maxValue, p.type, p.isIndeterminate)
  });
}

module.exports = submitReport;
