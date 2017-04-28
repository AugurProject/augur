"use strict";

var clone = require("clone");
var getLogs = require("./get-logs");
var sortTradesByBlockNumber = require("./sort-trades-by-block-number");
var getParsedCompleteSetsLogs = require("./get-parsed-complete-sets-logs");

// { account, filter }
function getAccountTrades(p, callback) {
  var takerTradesFilter, aux;
  p.filter = p.filter || {};
  takerTradesFilter = clone(p.filter);
  takerTradesFilter.sender = p.account;
  aux = {
    index: ["market", "outcome"],
    mergedLogs: {},
    extraField: {name: "maker", value: false}
  };
  getLogs({ label: "log_fill_tx", filter: takerTradesFilter, aux: aux }, function (err) {
    var makerTradesFilter;
    if (err) return callback(err);
    makerTradesFilter = clone(p.filter);
    makerTradesFilter.owner = p.account;
    aux.extraField.value = true;
    getLogs({ label: "log_fill_tx", filter: makerTradesFilter, aux: aux }, function (err) {
      var takerShortSellsFilter;
      if (err) return callback(err);
      takerShortSellsFilter = clone(p.filter);
      takerShortSellsFilter.sender = p.account;
      aux.extraField.value = false;
      getLogs({ label: "log_short_fill_tx", filter: takerShortSellsFilter, aux: aux }, function (err) {
        var makerShortSellsFilter;
        if (err) return callback(err);
        makerShortSellsFilter = clone(p.filter);
        makerShortSellsFilter.owner = p.account;
        aux.extraField.value = true;
        getLogs({ label: "log_short_fill_tx", filter: makerShortSellsFilter, aux: aux }, function (err) {
          var completeSetsFilter;
          if (err) return callback(err);
          if (p.filter.noCompleteSets) {
            callback(null, sortTradesByBlockNumber(aux.mergedLogs));
          } else {
            completeSetsFilter = clone(p.filter);
            completeSetsFilter.shortAsk = false;
            completeSetsFilter.mergeInto = aux.mergedLogs;
            getParsedCompleteSetsLogs({ account: p.account, filter: completeSetsFilter }, function (err, merged) {
              if (err) {
                return callback(null, sortTradesByBlockNumber(aux.mergedLogs));
              }
              callback(null, sortTradesByBlockNumber(merged));
            });
          }
        });
      });
    });
  });
}

module.exports = getAccountTrades;
