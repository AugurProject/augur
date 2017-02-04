/**
 * Augur JavaScript SDK
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var abi = require("augur-abi");
var utils = require("../utilities");
var constants = require("../constants");

module.exports = {

  sortTagsInfo: function (tag1, tag2) {
    return tag2.popularity - tag1.popularity;
  },

  parseTagsInfo: function (tagsInfo) {
    var parsedTagsInfo = [];
    for (var i = 0, len = tagsInfo.length; i < len; i += 2) {
      parsedTagsInfo.push({
        tag: this.decodeTag(tagsInfo[i]),
        popularity: abi.unfix(tagsInfo[i + 1], "number")
      });
    }
    return parsedTagsInfo.sort(this.sortTagsInfo);
  },

  getTagsInfo: function (branch, offset, numTagsToLoad, callback) {
    if (!callback) {
      if (utils.is_function(offset)) {
        callback = offset;
        offset = null;
        numTagsToLoad = null;
      } else if (utils.is_function(numTagsToLoad)) {
        callback = numTagsToLoad;
        numTagsToLoad = null;
      }
    }
    if (branch && branch.branch) {
      offset = branch.offset;
      numTagsToLoad = branch.numTagsToLoad;
      callback = callback || branch.callback;
      branch = branch.branch;
    }
    return this.Tags.getTagsInfo(branch, offset || 0, numTagsToLoad || 0, callback);
  },

  getTagsInfoChunked: function (branch, offset, numTagsToLoad, totalTags, chunkCB, callback) {
    var self = this;
    if (!utils.is_function(chunkCB)) chunkCB = utils.noop;
    if (!totalTags) {
      return this.getNumTagsInBranch(branch, function (totalTags) {
        if (!totalTags || totalTags.error || !parseInt(totalTags, 10)) {
          return callback(totalTags);
        }
        self.getTagsInfoChunked(branch, offset, Math.min(parseInt(totalTags, 10), constants.ORDERBOOK_MAX_CHUNK_SIZE), totalTags, chunkCB, callback);
      });
    }
    this.getTagsInfo({
      branch: branch,
      offset: offset,
      numTagsToLoad: numTagsToLoad || totalTags
    }, function (tagsInfoChunk) {
      if (!tagsInfoChunk || tagsInfoChunk.error) {
        console.error("getTagsInfo failed:", branch, tagsInfoChunk);
        return callback(tagsInfoChunk);
      }
      chunkCB(tagsInfoChunk);
      if (offset + numTagsToLoad < totalTags) {
        return self.getTagsInfoChunked(branch, offset + numTagsToLoad, numTagsToLoad, totalTags, chunkCB, callback);
      }
      callback(null);
    });
  }
};
