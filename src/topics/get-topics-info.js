"use strict";

var api = require("../api");

// { branch, offset, numTopicsToLoad }
function getTopicsInfo(p, callback) {
  return api().Topics.getTopicsInfo({
    branch: p.branch,
    offset: p.offset || 0,
    numTopicsToLoad: p.numTopicsToLoad || 0
  }, callback);
}

module.exports = getTopicsInfo;
