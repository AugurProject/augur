"use strict";

var assign = require("lodash.assign");
var getLogsChunked = require("./get-logs-chunked");
var noop = require("../utils/noop");

// { market, filter }
function getMarketPriceHistory(p, callback) {
  var filter = assign({}, p.filter, { market: p.market });

  var aux = { index: "outcome", mergedLogs: {} };
  getLogsChunked({ label: "log_fill_tx", filter: filter, aux: aux }, noop, function (err) {
    if (err) return callback(err);
    getLogsChunked({ label: "log_short_fill_tx", filter: filter, aux: aux }, noop, function (err) {
      if (err) return callback(err);
      callback(null, aux.mergedLogs);
    });
  });
}

module.exports = getMarketPriceHistory;
