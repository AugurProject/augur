"use strict";

var getLogsChunked = require("./get-logs-chunked");
var isFunction = require("../utils/is-function");
var noop = require("../utils/noop");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.creator Lookup all markets created by this Ethereum address.
 * @param {number=} p.fromBlock Block number to start looking up logs (default: 1).
 * @param {number=} p.toBlock Block number where the log lookup should stop (default: latest).
 * @param {function=} onChunkReceived Called when a chunk is received and parsed (default: noop).
 * @param {function=} onComplete Called after all chunks have been received and parsed (default: noop).
 */
function getMarketsCreatedByAccount(p, onChunkReceived, onComplete) {
  if (!isFunction(onChunkReceived)) onChunkReceived = noop;
  if (!isFunction(onComplete)) onComplete = noop;
  getLogsChunked({ label: "CreateMarket", filter: p }, onChunkReceived, function (err, logs) {
    if (err) return onComplete(err);
    // TODO get fees accrued so far on this market to the creator
    onComplete(null, logs);
  });
}

module.exports = getMarketsCreatedByAccount;
