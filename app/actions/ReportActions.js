var _ = require('lodash');
var secureRandom = require('secure-random');

var constants = require('../libs/constants');


var bytesToHex = function (bytes) {
  return '0x' + _.reduce(bytes, function (hexString, byte) {
    return hexString + byte.toString(16);
  }, '');
};

var ReportActions = {
  /**
   * Broadcast the hash of the report and store the report and salt.
   */
  hashReport: function (branchId, votePeriod, decisions) {
    var saltBytes = secureRandom(32);
    var salt = bytesToHex(saltBytes);

    var reportsString = localStorage.getItem(constants.report.REPORTS_STORAGE);
    var reports = reportsString ? JSON.parse(reportsString) : [];
    reports.push({
      branchId,
      votePeriod,
      decisions,
      salt
    });
    localStorage.setItem(constants.report.REPORTS_STORAGE, JSON.stringify(reports));

    var ethereumClient = this.flux.store('config').getEthereumClient();
    ethereumClient.hashReport(decisions, salt);
    this.dispatch(constants.report.UPDATE_REPORTS, {reports});
  }
};

module.exports = ReportActions;
