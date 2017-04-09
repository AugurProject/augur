"use strict";

var isFunction = require("./is-function");

var compose = function (prepare, callback) {
  if (!isFunction(callback)) return null;
  if (!isFunction(prepare)) return callback;
  return function (result) {
    return prepare(result, callback);
  };
};

module.exports = compose;
