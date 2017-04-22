"use strict";

var clone = require("clone");
var getLogs = require("./get-logs");
var sortTradesByBlockNumber = require("./sort-trades-by-block-number");
var getParsedCompleteSetsLogs = require("./get-parsed-complete-sets-logs");
var isFunction = require("../utils/is-function");

function getAccountTrades(account, filterParams, callback) {
  var takerTradesFilterParams, aux;
  if (!callback && isFunction(filterParams)) {
    callback = filterParams;
    filterParams = null;
  }
  filterParams = filterParams || {};
  takerTradesFilterParams = clone(filterParams);
  takerTradesFilterParams.sender = account;
  aux = {
    index: ["market", "outcome"],
    mergedLogs: {},
    extraField: {name: "maker", value: false}
  };
  getLogs("log_fill_tx", takerTradesFilterParams, aux, function (err) {
    var makerTradesFilterParams;
    if (err) return callback(err);
    makerTradesFilterParams = clone(filterParams);
    makerTradesFilterParams.owner = account;
    aux.extraField.value = true;
    getLogs("log_fill_tx", makerTradesFilterParams, aux, function (err) {
      var takerShortSellsFilterParams;
      if (err) return callback(err);
      takerShortSellsFilterParams = clone(filterParams);
      takerShortSellsFilterParams.sender = account;
      aux.extraField.value = false;
      getLogs("log_short_fill_tx", takerShortSellsFilterParams, aux, function (err) {
        var makerShortSellsFilterParams;
        if (err) return callback(err);
        makerShortSellsFilterParams = clone(filterParams);
        makerShortSellsFilterParams.owner = account;
        aux.extraField.value = true;
        getLogs("log_short_fill_tx", makerShortSellsFilterParams, aux, function (err) {
          var completeSetsFilterParams;
          if (err) return callback(err);
          if (filterParams.noCompleteSets) {
            callback(null, sortTradesByBlockNumber(aux.mergedLogs));
          } else {
            completeSetsFilterParams = clone(filterParams);
            completeSetsFilterParams.shortAsk = false;
            completeSetsFilterParams.mergeInto = aux.mergedLogs;
            getParsedCompleteSetsLogs(account, completeSetsFilterParams, function (err, merged) {
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
