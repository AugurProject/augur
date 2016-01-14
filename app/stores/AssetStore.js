"use strict";

var _ = require("lodash");
var constants = require("../libs/constants");

module.exports = {
  state: {
    cash: null,
    reputation: null,
    ether: null,
    marketsHeld: {}
  },
  getState: function () {
    return this.state;
  },
  handleUpdateAssets: function (payload) {
    this.state = _.merge(this.state, payload);
    this.emit(constants.CHANGE_EVENT);
  }
};
