"use strict";

var api = require("../api");
var isFunction = require("../utils/is-function");
var isObject = require("../utils/is-object");

function getTopicsInfo(branch, offset, numTopicsToLoad, callback) {
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
  if (isObject(branch)) {
    offset = branch.offset;
    numTopicsToLoad = branch.numTopicsToLoad;
    callback = callback || branch.callback;
    branch = branch.branch;
  }
  return api().Topics.getTopicsInfo(branch, offset || 0, numTopicsToLoad || 0, callback);
}

module.exports = getTopicsInfo;
