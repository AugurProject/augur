"use strict";

var isFunction = require("./is-function");

var compose = function (prepare, callback, extraArgument) {
  if (!isFunction(callback)) return null;
  if (!isFunction(prepare)) return callback;
  return function (result) {
    if (extraArgument == null) return prepare(result, callback);
    return prepare(result, extraArgument, callback);
  };
};

module.exports = compose;
