"use strict";

var _ = require("lodash");
var constants = require("../libs/constants");

module.exports = {
  state: {
    peerCount: null,
    blockNumber: null,
    blocktime: null,
    ether: null,
    gasPrice: null,
    ethereumStatus: null,
    mining: null,
    hashrate: null,
    clientVersion: null,
    networkId: null,
    blockchainAge: null,
    isMonitoringBlocks: false,
    hasCheckedQuorum: false
  },
  getState: function () {
    return this.state;
  },
  handleUpdateNetwork: function (payload) {
    _.merge(this.state, payload);
    this.emit(constants.CHANGE_EVENT);
  },
  handleUpdateBlockchainAge: function (payload) {
    this.state.blockchainAge = payload.blockchainAge;
    this.emit(constants.CHANGE_EVENT);
  },
  handleUpdateEthereumStatus: function (payload) {
    this.state.ethereumStatus = payload.ethereumStatus;
    this.emit(constants.CHANGE_EVENT);
  },
  handleUpdateIsMonitoringBlocks: function (payload) {
    this.state.isMonitoringBlocks = payload.isMonitoringBlocks;
    this.emit(constants.CHANGE_EVENT);
  }
};
