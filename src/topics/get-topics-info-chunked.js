"use strict";

var assign = require("lodash.assign");
var getTopicsInfo = require("./get-topics-info");
var api = require("../api");
var isFunction = require("../utils/is-function");
var noop = require("../utils/noop");
var GETTER_CHUNK_SIZE = require("../constants").GETTER_CHUNK_SIZE;

// { branch, offset, numTopicsToLoad, totalTopics }
function getTopicsInfoChunked(p, onChunkReceived, onComplete) {
  if (!isFunction(onChunkReceived)) onChunkReceived = noop;
  if (!isFunction(onComplete)) onComplete = noop;
  if (!p.totalTopics) {
    api().Topics.getNumTopicsInBranch({ branch: p.branch }, function (err, totalTopics) {
      if (err) return onComplete(err);
      if (!totalTopics || totalTopics.error || !parseInt(totalTopics, 10)) {
        return onComplete(totalTopics);
      }
      getTopicsInfoChunked(assign({}, p, {
        numTopicsToLoad: Math.min(parseInt(totalTopics, 10), GETTER_CHUNK_SIZE),
        totalTopics: totalTopics
      }), onChunkReceived, onComplete);
    });
  } else {
    getTopicsInfo({
      _branch: p.branch,
      _offset: p.offset,
      _numTopicsToLoad: p.numTopicsToLoad || p.totalTopics
    }, function (err, topicsInfoChunk) {
      if (err) return onComplete(err);
      onChunkReceived(topicsInfoChunk);
      if (p.offset + p.numTopicsToLoad < p.totalTopics) {
        getTopicsInfoChunked(assign({}, p, { offset: p.offset + p.numTopicsToLoad }), onChunkReceived, onComplete);
      } else {
        onComplete(null);
      }
    });
  }
}

module.exports = getTopicsInfoChunked;
