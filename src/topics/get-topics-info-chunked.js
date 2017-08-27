"use strict";

var assign = require("lodash.assign");
var getTopicsInfo = require("./get-topics-info");
var api = require("../api");
var isFunction = require("../utils/is-function");
var noop = require("../utils/noop");
var GETTER_CHUNK_SIZE = require("../constants").GETTER_CHUNK_SIZE;

// { branch, offset, numTopicsToLoad, totalTopics }
function getTopicsInfoChunked(p, chunkCB, callback) {
  if (!isFunction(chunkCB)) chunkCB = noop;
  if (!isFunction(callback)) callback = noop;
  if (!p.totalTopics) {
    api().Topics.getNumTopicsInBranch({ branch: p.branch }, function (totalTopics) {
      if (!totalTopics || totalTopics.error || !parseInt(totalTopics, 10)) {
        return callback(totalTopics);
      }
      getTopicsInfoChunked(assign({}, p, {
        numTopicsToLoad: Math.min(parseInt(totalTopics, 10), GETTER_CHUNK_SIZE),
        totalTopics: totalTopics
      }), chunkCB, callback);
    });
  } else {
    getTopicsInfo({
      branch: p.branch,
      offset: p.offset,
      numTopicsToLoad: p.numTopicsToLoad || p.totalTopics
    }, function (topicsInfoChunk) {
      if (!topicsInfoChunk || topicsInfoChunk.error) return callback(topicsInfoChunk);
      chunkCB(topicsInfoChunk);
      if (p.offset + p.numTopicsToLoad < p.totalTopics) {
        getTopicsInfoChunked(assign({}, p, { offset: p.offset + p.numTopicsToLoad }), chunkCB, callback);
      } else {
        callback(null);
      }
    });
  }
}

module.exports = getTopicsInfoChunked;
