"use strict";

var api = require("../api");
var DEFAULT_BRANCH_ID = require("../constants").DEFAULT_BRANCH_ID;

// { branch, offset, numMarketsToLoad, volumeMin, volumeMax, callback }
function getMarketsInfo(p, callback) {
  return api().CompositeGetters.getMarketsInfo({
    branch: p.branch || DEFAULT_BRANCH_ID,
    offset: p.offset || 0,
    numMarketsToLoad: p.numMarketsToLoad || 0,
    volumeMin: p.volumeMin || 0,
    volumeMax: p.volumeMax || 0
  }, callback, { extraArgument: p.branch });
}

module.exports = getMarketsInfo;
