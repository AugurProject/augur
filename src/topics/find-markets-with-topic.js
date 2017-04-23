"use strict";

var filterByBranchID = require("./filter-by-branch-id");
var getLogs = require("../logs/get-logs");
var encodeTag = require("../format/tag/encode-tag");
var isFunction = require("../utils/is-function");

function findMarketsWithTopic(topic, branchID, callback) {
  var encodedTopic = { topic: encodeTag(topic) };
  if (!isFunction(callback)) {
    return filterByBranchID(branchID, getLogs("marketCreated", encodedTopic));
  }
  // TODO filter by endDate? (get active markets only)
  getLogs("marketCreated", encodedTopic, null, function (err, logs) {
    if (err) return callback(err);
    callback(null, filterByBranchID(branchID, logs));
  });
}

module.exports = findMarketsWithTopic;
