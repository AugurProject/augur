"use strict";

var assign = require("lodash.assign");
var getLogs = require("./get-logs");

// { market, filter }
function getMarketPriceHistory(p, callback) {
  var filter = assign({}, p.filter, { market: p.market });
  var aux = { index: "outcome", mergedLogs: {} };
  getLogs({ label: "log_fill_tx", filter: filter, aux: aux }, function (err) {
    if (err) return callback(err);
    getLogs({ label: "log_short_fill_tx", filter: filter, aux: aux }, function (err) {
      if (err) return callback(err);
      callback(null, aux.mergedLogs);
    });
  });
}

module.exports = getMarketPriceHistory;
