"use strict";

var api = require("../api");
var isFunction = require("../utils/is-function");
var isObject = require("../utils/is-object");
var DEFAULT_BRANCH_ID = require("../constants").DEFAULT_BRANCH_ID;

function getMarketsInfo(branch, offset, numMarketsToLoad, volumeMin, volumeMax, callback) {
  if (!callback && isFunction(offset)) {
    callback = offset;
    offset = null;
    numMarketsToLoad = null;
    volumeMin = null;
    volumeMax = null;
  }
  if (isObject(branch)) {
    offset = branch.offset;
    numMarketsToLoad = branch.numMarketsToLoad;
    volumeMin = branch.volumeMin;
    volumeMax = branch.volumeMax;
    callback = callback || branch.callback;
    branch = branch.branch;
  }
  return api().CompositeGetters.getMarketsInfo(
    branch || DEFAULT_BRANCH_ID,
    offset || 0,
    numMarketsToLoad || 0,
    volumeMin || 0,
    volumeMax || 0,
    callback,
    { extraArgument: branch }
  );
}

module.exports = getMarketsInfo;
