"use strict";

var constants = require("../constants");

function parametrizeFilter(event, params) {
  return {
    fromBlock: params.fromBlock || constants.GET_LOGS_DEFAULT_FROM_BLOCK,
    toBlock: params.toBlock || constants.GET_LOGS_DEFAULT_TO_BLOCK,
    address: store.getState().contractAddresses[event.contract],
    topics: this.buildTopicsList(event, params),
    timeout: constants.GET_LOGS_TIMEOUT
  };
}

module.exports = parametrizeFilter;
