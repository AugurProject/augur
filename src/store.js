"use strict";

var reducer = require("./reducers");

var state;

var getState = function () {
  return state;
};

var dispatch = function (action) {
  state = reducer(state, action);
};

var reset = function () {
  state = reducer({});
};

module.exports = { getState: getState, dispatch: dispatch, reset: reset };
