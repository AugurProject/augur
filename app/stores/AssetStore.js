"use strict";

var clone = require("clone");
var constants = require("../libs/constants");

module.exports = {
  state: {
    cash: null,
    reputation: null,
    ether: null,
    meanTradePrices: {}
  },
  getState: function () {
    return this.state;
  },
  handleUpdateAssets: function (payload) {
    if (payload.cash) this.state.cash = payload.cash;
    if (payload.reputation) this.state.reputation = payload.reputation;
    if (payload.ether) this.state.ether = payload.ether;
    this.emit(constants.CHANGE_EVENT);
  },
  handleLoadMeanTradePricesSuccess: function (payload) {
    this.state.meanTradePrices = clone(payload.meanTradePrices);
    this.emit(constants.CHANGE_EVENT);
  }
};
