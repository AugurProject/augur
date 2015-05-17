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

    var pendingReports = this.flux.store('branch').getState().pendingReports;
    pendingReports.push({
      branchId,
      votePeriod,
      decisions,
      salt
    });
    // TODO: Encrypt the reports so malware can't access them and steal
    // reputation.
    localStorage.setItem(constants.report.REPORTS_STORAGE, JSON.stringify(pendingReports));

    // Hash the report and submit it to the network.
    var ethereumClient = this.flux.store('config').getEthereumClient();
    var hash = ethereumClient.hashReport(decisions, salt);
    ethereumClient.submitReportHash(branchId, hash, votePeriod);

    this.dispatch(constants.branch.UPDATE_PENDING_REPORTS, {pendingReports});
  },

  loadPendingReports: function () {
    var reportsString = localStorage.getItem(constants.report.REPORTS_STORAGE);
    var pendingReports = reportsString ? JSON.parse(reportsString) : [];
    this.dispatch(constants.branch.LOAD_PENDING_REPORTS_SUCCESS, {pendingReports});
  },
};

module.exports = ReportActions;
