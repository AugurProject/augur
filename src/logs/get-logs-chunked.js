"use strict";

var assign = require("lodash.assign");
var abi = require("augur-abi");
var async = require("async");
var clone = require("clone");
var chunkBlocks = require("./chunk-blocks");
var getLogs = require("./get-logs");
var rpcInterface = require("../rpc-interface");
var GET_LOGS_DEFAULT_FROM_BLOCK = require("../constants").GET_LOGS_DEFAULT_FROM_BLOCK;

// { label, filter, aux }
function getLogsChunked(p, onChunkReceived, onComplete) {
  p.aux = p.aux || {};
  p.filter = p.filter || {};
  if (!p.filter.fromBlock) {
    p.filter.fromBlock = parseInt(GET_LOGS_DEFAULT_FROM_BLOCK, 16);
  }
  if (!p.filter.toBlock) {
    p.filter.toBlock = parseInt(rpcInterface.getCurrentBlock().number, 16);
  }
  async.eachSeries(chunkBlocks(abi.number(p.filter.fromBlock), abi.number(p.filter.toBlock)), function (chunk, nextChunk) {
    var filterChunk = clone(p.filter);
    filterChunk.fromBlock = chunk.fromBlock;
    filterChunk.toBlock = chunk.toBlock;
    getLogs(assign({}, p, { filter: filterChunk }), function (err, logs) {
      if (err) return nextChunk(err);
      onChunkReceived(logs);
      nextChunk(null);
    });
  }, function (err) {
    if (err) return onComplete(err);
    onComplete(null);
  });
}

module.exports = getLogsChunked;
