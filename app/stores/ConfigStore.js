var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');

var state = {
  host: 'localhost:8545',
  debug: false,
  percentLoaded: null,
  ethereumClient: null,
  ethereumClientFailed: false
}

var ConfigStore = Fluxxor.createStore({
  initialize: function () {
    this.bindActions(
      constants.config.UPDATE_ETHEREUM_CLIENT_SUCCESS, this.handleUpdateEthereumClientSuccess,
      constants.config.UPDATE_ETHEREUM_CLIENT_FAILED, this.handleUpdateEthereumClientFailed,
      constants.config.UPDATE_DEBUG, this.handleUpdateDebug,
      constants.config.UPDATE_PERCENT_LOADED, this.handleUpdatePercentLoaded
    );
  },

  getState: function () {
    return state;
  },

  getEthereumClient: function () {

    return state.ethereumClient;
  },

  handleUpdatePercentLoaded: function (payload) {
    state.percentLoaded = payload.percentLoaded
    this.emit(constants.CHANGE_EVENT);
  },

  handleUpdateEthereumClientSuccess: function (payload) {
    state.ethereumClient = payload.ethereumClient;
    state.ethereumClientFailed = false;
    this.emit(constants.CHANGE_EVENT);
  },

  handleUpdateEthereumClientFailed: function () {
    state.ethereumClient = null;
    state.ethereumClientFailed = true;
    this.emit(constants.CHANGE_EVENT);
  },

  handleUpdateDebug: function (payload) {
    state.debug = payload.debug;
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = ConfigStore;
