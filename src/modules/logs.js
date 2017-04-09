"use strict";

var async = require("async");
var clone = require("clone");
var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var unrollArray = require("ethrpc").unmarshal;
var constants = require("../constants");
var isFunction = require("../utils/is-function");
var formatTradeType = require("../format/log/format-trade-type");
var parseLogMessage = require("../filters/parse-message/parse-log-message");

var ONE = new BigNumber("1", 10);

module.exports = {

  parseCompleteSetsLogs: function (logs, mergeInto) {
    var i, j, n, marketID, logData, numOutcomes, logType, parsed;
    parsed = mergeInto || {};
    for (i = 0, n = logs.length; i < n; ++i) {
      if (logs[i] && logs[i].data !== undefined && logs[i].data !== null && logs[i].data !== "0x") {
        marketID = logs[i].topics[2];
        logType = formatTradeType(logs[i].topics[3]);
        logData = unrollArray(logs[i].data);
        numOutcomes = parseInt(logData[1], 16);
        if (mergeInto) {
          if (!parsed[marketID]) parsed[marketID] = {};
          for (j = 1; j <= numOutcomes; ++j) {
            if (!parsed[marketID][j]) parsed[marketID][j] = [];
            parsed[marketID][j].push({
              type: logType,
              isCompleteSet: true,
              amount: abi.unfix(logData[0], "string"),
              price: ONE.dividedBy(abi.bignum(numOutcomes)).toFixed(),
              blockNumber: parseInt(logs[i].blockNumber, 16)
            });
          }
        } else {
          if (!parsed[marketID]) parsed[marketID] = [];
          parsed[marketID].push({
            type: logType,
            amount: abi.unfix(logData[0], "string"),
            numOutcomes: numOutcomes,
            blockNumber: parseInt(logs[i].blockNumber, 16)
          });
        }
      }
    }
    return parsed;
  },

  /***********
   * Getters *
   ***********/

  getMarketPriceHistory: function (market, options, callback) {
    var params, aux, self = this;
    if (!callback && isFunction(options)) {
      callback = options;
      options = null;
    }
    params = clone(options || {});
    params.market = market;
    aux = {index: "outcome", mergedLogs: {}};
    if (!isFunction(callback)) {
      this.getLogs("log_fill_tx", params, aux);
      this.getLogs("log_short_fill_tx", params, aux);
      return aux.mergedLogs;
    }
    this.getLogs("log_fill_tx", params, aux, function (err) {
      if (err) return callback(err);
      self.getLogs("log_short_fill_tx", params, aux, function (err) {
        if (err) return callback(err);
        callback(null, aux.mergedLogs);
      });
    });
  },

  sortByBlockNumber: function (a, b) {
    return a.blockNumber - b.blockNumber;
  },

  buildTopicsList: function (event, params) {
    var i, numInputs;
    var topics = [event.signature];
    var inputs = event.inputs;
    for (i = 0, numInputs = inputs.length; i < numInputs; ++i) {
      if (inputs[i].indexed) {
        if (params[inputs[i].name]) {
          topics.push(abi.format_int256(params[inputs[i].name]));
        } else {
          topics.push(null);
        }
      }
    }
    return topics;
  },

  parametrizeFilter: function (event, params) {
    return {
      fromBlock: params.fromBlock || constants.GET_LOGS_DEFAULT_FROM_BLOCK,
      toBlock: params.toBlock || constants.GET_LOGS_DEFAULT_TO_BLOCK,
      address: this.contracts[event.contract],
      topics: this.buildTopicsList(event, params),
      timeout: constants.GET_LOGS_TIMEOUT
    };
  },

  // warning: mutates processedLogs
  insertIndexedLog: function (processedLogs, parsed, index) {
    if (index.constructor === Array) {
      if (index.length === 1) {
        if (!processedLogs[parsed[index[0]]]) {
          processedLogs[parsed[index[0]]] = [];
        }
        processedLogs[parsed[index[0]]].push(parsed);
      } else if (index.length === 2) {
        if (!processedLogs[parsed[index[0]]]) {
          processedLogs[parsed[index[0]]] = {};
        }
        if (!processedLogs[parsed[index[0]]][parsed[index[1]]]) {
          processedLogs[parsed[index[0]]][parsed[index[1]]] = [];
        }
        processedLogs[parsed[index[0]]][parsed[index[1]]].push(parsed);
      }
    } else {
      if (!processedLogs[parsed[index]]) processedLogs[parsed[index]] = [];
      processedLogs[parsed[index]].push(parsed);
    }
  },

  // warning: mutates processedLogs, if passed
  processLogs: function (label, index, logs, extraField, processedLogs) {
    var parsed, i, numLogs;
    if (!processedLogs) processedLogs = (index) ? {} : [];
    for (i = 0, numLogs = logs.length; i < numLogs; ++i) {
      if (!logs[i].removed) {
        parsed = parseLogMessage(label, logs[i], this.api.events[label].inputs);
        if (extraField && extraField.name) {
          parsed[extraField.name] = extraField.value;
        }
        if (index) {
          this.insertIndexedLog(processedLogs, parsed, index);
        } else {
          processedLogs.push(parsed);
        }
      }
    }
    return processedLogs;
  },

  getFilteredLogs: function (label, filterParams, callback) {
    var filter;
    if (!callback && isFunction(filterParams)) {
      callback = filterParams;
      filterParams = null;
    }
    filter = this.parametrizeFilter(this.api.events[label], filterParams || {});
    if (!isFunction(callback)) return this.rpc.getLogs(filter);
    this.rpc.getLogs(filter, function (logs) {
      if (logs && logs.error) return callback(logs, null);
      if (!logs || !logs.length) return callback(null, []);
      callback(null, logs);
    });
  },

  // aux: {index: str/arr, mergedLogs: {}, extraField: {name, value}}
  getLogs: function (label, filterParams, aux, callback) {
    var logs, self = this;
    if (!isFunction(callback) && isFunction(aux)) {
      callback = aux;
      aux = null;
    }
    aux = aux || {};
    if (!isFunction(callback)) {
      logs = this.getFilteredLogs(label, filterParams || {});
      if (logs && logs.length) logs.reverse();
      return this.processLogs(label, aux.index, logs, aux.extraField, aux.mergedLogs);
    }
    this.getFilteredLogs(label, filterParams || {}, function (err, logs) {
      if (err) return callback(err);
      if (logs && logs.length) logs = logs.reverse();
      callback(null, self.processLogs(label, aux.index, logs, aux.extraField, aux.mergedLogs));
    });
  },

  chunkBlocks: function (fromBlock, toBlock) {
    var toBlockChunk, fromBlockChunk, chunks;
    if (fromBlock < 1) fromBlock = 1;
    if (toBlock < fromBlock) return [];
    toBlockChunk = toBlock;
    fromBlockChunk = toBlock - constants.BLOCKS_PER_CHUNK;
    chunks = [];
    while (toBlockChunk >= fromBlock) {
      if (fromBlockChunk < fromBlock) {
        fromBlockChunk = fromBlock;
      }
      chunks.push({fromBlock: fromBlockChunk, toBlock: toBlockChunk});
      fromBlockChunk -= constants.BLOCKS_PER_CHUNK;
      toBlockChunk -= constants.BLOCKS_PER_CHUNK;
      if (toBlockChunk === toBlock - constants.BLOCKS_PER_CHUNK) {
        toBlockChunk--;
      }
    }
    return chunks;
  },

  getLogsChunked: function (label, filterParams, aux, onChunkReceived, callback) {
    var chunks, self = this;
    aux = aux || {};
    filterParams = filterParams || {};
    if (!filterParams.fromBlock) {
      filterParams.fromBlock = parseInt(constants.GET_LOGS_DEFAULT_FROM_BLOCK, 16);
    }
    if (!filterParams.toBlock) {
      filterParams.toBlock = this.rpc.block.number;
    }
    chunks = this.chunkBlocks(abi.number(filterParams.fromBlock), abi.number(filterParams.toBlock));
    async.eachSeries(chunks, function (chunk, nextChunk) {
      var filterParamsChunk = clone(filterParams);
      filterParamsChunk.fromBlock = chunk.fromBlock;
      filterParamsChunk.toBlock = chunk.toBlock;
      self.getLogs(label, filterParamsChunk, aux, function (err, logs) {
        if (err) return nextChunk(err);
        onChunkReceived(logs);
        nextChunk(null);
      });
    }, function (err) {
      if (err) return callback(err);
      callback(null);
    });
  },

  getAccountTrades: function (account, filterParams, callback) {
    var takerTradesFilterParams, aux, self = this;
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
    this.getLogs("log_fill_tx", takerTradesFilterParams, aux, function (err) {
      var makerTradesFilterParams;
      if (err) return callback(err);
      makerTradesFilterParams = clone(filterParams);
      makerTradesFilterParams.owner = account;
      aux.extraField.value = true;
      self.getLogs("log_fill_tx", makerTradesFilterParams, aux, function (err) {
        var takerShortSellsFilterParams;
        if (err) return callback(err);
        takerShortSellsFilterParams = clone(filterParams);
        takerShortSellsFilterParams.sender = account;
        aux.extraField.value = false;
        self.getLogs("log_short_fill_tx", takerShortSellsFilterParams, aux, function (err) {
          var makerShortSellsFilterParams;
          if (err) return callback(err);
          makerShortSellsFilterParams = clone(filterParams);
          makerShortSellsFilterParams.owner = account;
          aux.extraField.value = true;
          self.getLogs("log_short_fill_tx", makerShortSellsFilterParams, aux, function (err) {
            var completeSetsFilterParams;
            if (err) return callback(err);
            if (filterParams.noCompleteSets) {
              callback(null, self.sortTradesByBlockNumber(aux.mergedLogs));
            } else {
              completeSetsFilterParams = clone(filterParams);
              completeSetsFilterParams.shortAsk = false;
              completeSetsFilterParams.mergeInto = aux.mergedLogs;
              self.getParsedCompleteSetsLogs(account, completeSetsFilterParams, function (err, merged) {
                if (err) {
                  return callback(null, self.sortTradesByBlockNumber(aux.mergedLogs));
                }
                callback(null, self.sortTradesByBlockNumber(merged));
              });
            }
          });
        });
      });
    });
  },

  sortTradesByBlockNumber: function (trades) {
    var marketTrades, outcomeTrades, outcomeIDs, numOutcomes, marketIDs, numMarkets, i, j;
    marketIDs = Object.keys(trades);
    numMarkets = marketIDs.length;
    for (i = 0; i < numMarkets; ++i) {
      marketTrades = trades[marketIDs[i]];
      outcomeIDs = Object.keys(marketTrades);
      numOutcomes = outcomeIDs.length;
      for (j = 0; j < numOutcomes; ++j) {
        outcomeTrades = marketTrades[outcomeIDs[j]];
        outcomeTrades = outcomeTrades.sort(this.sortByBlockNumber);
      }
    }
    return trades;
  },

  /********************************
   * Raw log getters (deprecated) *
   ********************************/

  getShortSellLogs: function (account, options, callback) {
    var topics, filter;
    if (!callback && isFunction(options)) {
      callback = options;
      options = null;
    }
    options = options || {};
    if (account !== undefined && account !== null) {
      topics = [
        this.api.events.log_short_fill_tx.signature,
        options.market ? abi.format_int256(options.market) : null,
        null,
        null
      ];
      topics[options.maker ? 3 : 2] = abi.format_int256(account);
      filter = {
        fromBlock: options.fromBlock || "0x1",
        toBlock: options.toBlock || "latest",
        address: this.contracts.Trade,
        topics: topics,
        timeout: constants.GET_LOGS_TIMEOUT
      };
      if (!isFunction(callback)) return this.rpc.getLogs(filter);
      this.rpc.getLogs(filter, function (logs) {
        if (logs && logs.error) return callback(logs, null);
        if (!logs || !logs.length) return callback(null, []);
        callback(null, logs);
      });
    }
  },

  getTakerShortSellLogs: function (account, filterParams, callback) {
    var params;
    if (!callback && isFunction(filterParams)) {
      callback = filterParams;
      filterParams = null;
    }
    params = clone(filterParams || {});
    params.maker = false;
    return this.getShortSellLogs(account, params, callback);
  },

  getShortAskBuyCompleteSetsLogs: function (account, options, callback) {
    var opt;
    if (!callback && isFunction(options)) {
      callback = options;
      options = null;
    }
    opt = options ? clone(options) : {};
    opt.shortAsk = true;
    opt.type = "buy";
    return this.getCompleteSetsLogs(account, opt, callback);
  },

  getParsedCompleteSetsLogs: function (account, options, callback) {
    var self = this;
    if (!callback && isFunction(options)) {
      callback = options;
      options = null;
    }
    options = options || {};
    this.getCompleteSetsLogs(account, options, function (err, logs) {
      if (err) return callback(err);
      callback(null, self.parseCompleteSetsLogs(logs, options.mergeInto));
    });
  },

  getCompleteSetsLogs: function (account, options, callback) {
    var typeCode, market, filter;
    if (!callback && isFunction(options)) {
      callback = options;
      options = null;
    }
    options = options || {};
    if (account !== undefined && account !== null) {
      typeCode = constants.LOG_TYPE_CODES[options.type] || null;
      market = options.market ? abi.format_int256(options.market) : null;
      filter = {
        fromBlock: options.fromBlock || "0x1",
        toBlock: options.toBlock || "latest",
        address: (options.shortAsk) ? this.contracts.BuyAndSellShares : this.contracts.CompleteSets,
        topics: [
          this.api.events.completeSets_logReturn.signature,
          abi.format_int256(account),
          market,
          typeCode
        ],
        timeout: constants.GET_LOGS_TIMEOUT
      };
      if (!isFunction(callback)) return this.rpc.getLogs(filter);
      this.rpc.getLogs(filter, function (logs) {
        if (logs && logs.error) return callback(logs, null);
        if (!logs || !logs.length) return callback(null, []);
        callback(null, logs);
      });
    }
  },

  getBuyCompleteSetsLogs: function (account, options, callback) {
    var opt;
    if (!callback && isFunction(options)) {
      callback = options;
      options = null;
    }
    opt = options ? clone(options) : {};
    opt.shortAsk = false;
    opt.type = "buy";
    return this.getCompleteSetsLogs(account, opt, callback);
  },

  getSellCompleteSetsLogs: function (account, options, callback) {
    var opt;
    if (!callback && isFunction(options)) {
      callback = options;
      options = null;
    }
    opt = options ? clone(options) : {};
    opt.shortAsk = false;
    opt.type = "sell";
    return this.getCompleteSetsLogs(account, opt, callback);
  }
};
