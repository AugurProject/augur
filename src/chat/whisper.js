"use strict";

var state = {
  id: null,
  filters: { augur: null }
};

module.exports.setWhisperID = function (id) {
  state.id = id;
};

module.exports.getWhisperID = function () {
  return state.id;
};

module.exports.setFilter = function (roomName, id, heartbeat) {
  state.filters[roomName] = { id: id, heartbeat: heartbeat };
};

module.exports.getFilter = function (roomName) {
  return state[roomName];
};

module.exports.clearFilter = function (roomName) {
  clearInterval(state.filters[roomName].heartbeat);
  state.filters[roomName] = null;
};
