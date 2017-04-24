"use strict";

var abi = require("augur-abi");
var async = require("async");
var clone = require("clone");
var chunkBlocks = require("./chunk-blocks");
var getLogs = require("./get-logs");
var rpcInterface = require("../rpc-interface");
var GET_LOGS_DEFAULT_FROM_BLOCK = require("../constants").GET_LOGS_DEFAULT_FROM_BLOCK;

function getLogsChunked(label, filterParams, aux, onChunkReceived, callback) {
  var chunks;
  aux = aux || {};
  filterParams = filterParams || {};
  if (!filterParams.fromBlock) {
    filterParams.fromBlock = parseInt(GET_LOGS_DEFAULT_FROM_BLOCK, 16);
  }
  if (!filterParams.toBlock) {
    filterParams.toBlock = parseInt(rpcInterface.getCurrentBlock().number, 16);
  }
  chunks = chunkBlocks(abi.number(filterParams.fromBlock), abi.number(filterParams.toBlock));
  async.eachSeries(chunks, function (chunk, nextChunk) {
    var filterParamsChunk = clone(filterParams);
    filterParamsChunk.fromBlock = chunk.fromBlock;
    filterParamsChunk.toBlock = chunk.toBlock;
    getLogs(label, filterParamsChunk, aux, function (err, logs) {
      if (err) return nextChunk(err);
      onChunkReceived(logs);
      nextChunk(null);
    });
  }, function (err) {
    if (err) return callback(err);
    callback(null);
  });
}

module.exports = getLogsChunked;
