"use strict";

var getTopicsInfo = require("./get-topics-info");
var api = require("../api");
var isFunction = require("../utils/is-function");
var noop = require("../utils/noop");
var GETTER_CHUNK_SIZE = require("../constants").GETTER_CHUNK_SIZE;

function getTopicsInfoChunked(branch, offset, numTopicsToLoad, totalTopics, chunkCB, callback) {
  if (!isFunction(chunkCB)) chunkCB = noop;
  if (!totalTopics) {
    return api().Topics.getNumTopicsInBranch({ branch: branch }, function (totalTopics) {
      if (!totalTopics || totalTopics.error || !parseInt(totalTopics, 10)) {
        return callback(totalTopics);
      }
      getTopicsInfoChunked(branch, offset, Math.min(parseInt(totalTopics, 10), GETTER_CHUNK_SIZE), totalTopics, chunkCB, callback);
    });
  }
  getTopicsInfo({
    branch: branch,
    offset: offset,
    numTopicsToLoad: numTopicsToLoad || totalTopics
  }, function (topicsInfoChunk) {
    if (!topicsInfoChunk || topicsInfoChunk.error) return callback(topicsInfoChunk);
    chunkCB(topicsInfoChunk);
    if (offset + numTopicsToLoad < totalTopics) {
      return getTopicsInfoChunked(branch, offset + numTopicsToLoad, numTopicsToLoad, totalTopics, chunkCB, callback);
    }
    callback(null);
  });
}

module.exports = getTopicsInfoChunked;
