"use strict";

var abi = require("augur-abi");
var constants = require("../constants");
var noop = require("../utils/noop");
var isFunction = require("../utils/is-function");
var encodeTag = require("../format/tag/encode-tag");
var decodeTag = require("../format/tag/decode-tag");

module.exports = {

  filterByBranchID: function (branchID, logs) {
    if (branchID) {
      logs = logs.filter(function (log) {
        return log.branch === abi.format_int256(branchID);
      });
    }
    return logs.map(function (log) { return log.marketID; });
  },

  findMarketsWithTopic: function (topic, branchID, callback) {
    var self = this;
    var formattedTopic = encodeTag(topic);
    if (!isFunction(callback)) {
      return this.filterByBranchID(branchID, this.getLogs("marketCreated", {topic: formattedTopic}));
    }
    // TODO filter by endDate? (get active markets only)
    this.getLogs("marketCreated", {topic: formattedTopic}, null, function (err, logs) {
      if (err) return callback(err);
      return callback(null, self.filterByBranchID(branchID, logs));
    });
  },

  getTopicsInfo: function (branch, offset, numTopicsToLoad, callback) {
    if (!callback) {
      if (isFunction(offset)) {
        callback = offset;
        offset = null;
        numTopicsToLoad = null;
      } else if (isFunction(numTopicsToLoad)) {
        callback = numTopicsToLoad;
        numTopicsToLoad = null;
      }
    }
    if (branch && branch.branch) {
      offset = branch.offset;
      numTopicsToLoad = branch.numTopicsToLoad;
      callback = callback || branch.callback;
      branch = branch.branch;
    }
    return this.Topics.getTopicsInfo(branch, offset || 0, numTopicsToLoad || 0, callback);
  },

  getTopicsInfoChunked: function (branch, offset, numTopicsToLoad, totalTopics, chunkCB, callback) {
    var self = this;
    if (!isFunction(chunkCB)) chunkCB = noop;
    if (!totalTopics) {
      return this.getNumTopicsInBranch(branch, function (totalTopics) {
        if (!totalTopics || totalTopics.error || !parseInt(totalTopics, 10)) {
          return callback(totalTopics);
        }
        self.getTopicsInfoChunked(branch, offset, Math.min(parseInt(totalTopics, 10), constants.GETTER_CHUNK_SIZE), totalTopics, chunkCB, callback);
      });
    }
    this.getTopicsInfo({
      branch: branch,
      offset: offset,
      numTopicsToLoad: numTopicsToLoad || totalTopics
    }, function (topicsInfoChunk) {
      if (!topicsInfoChunk || topicsInfoChunk.error) {
        return callback(topicsInfoChunk);
      }
      chunkCB(topicsInfoChunk);
      if (offset + numTopicsToLoad < totalTopics) {
        return self.getTopicsInfoChunked(branch, offset + numTopicsToLoad, numTopicsToLoad, totalTopics, chunkCB, callback);
      }
      callback(null);
    });
  }
};
