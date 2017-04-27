"use strict";

var assign = require("lodash.assign");
var abi = require("augur-abi");
var api = require("../api");
var fixReport = require("./format/fix-report");

// branch, salt, report, reporter, eventID, minValue, maxValue, type, isIndeterminate, isUnethical, onSent, onSuccess, onFailed
function slashRep(p) {
  return api().SlashRep.slashRep(assign({}, p, {
    salt: abi.hex(p.salt),
    report: fixReport(p.report, p.minValue, p.maxValue, p.type, p.isIndeterminate)
  }));
}

module.exports = slashRep;
