"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var _ = require("lodash");
var constants = require("../libs/constants");
var isHosted = NODE_JS || document.location.protocol === "https:";

module.exports = {
  state: {
    host: (isHosted) ? null : (process.env.RPC_HOST || "http://127.0.0.1:8545"),
    currentAccount: null,
    privateKey: null,
    handle: null,
    keystore: null,
    debug: false,
    loaded: false,
    isHosted: isHosted,
    percentLoaded: null,
    filters: {}
  },
  getState: function () {
    return this.state;
  },
  handleSetIsHosted: function (payload) {
    this.state.isHosted = payload.isHosted;
    this.emit(constants.CHANGE_EVENT);
  },
  handleSetHost: function (payload) {
    this.state.host = payload.host;
    this.emit(constants.CHANGE_EVENT);
  },
  getAccount: function () {
    if (_.isUndefined(this.state.currentAccount)) return null;
    return this.state.currentAccount;
  },
  getPrivateKey: function () {
    if (_.isUndefined(this.state.privateKey)) return null;
    return this.state.privateKey;
  },
  getHandle: function () {
    if (_.isUndefined(this.state.handle)) return null;
    return this.state.handle;
  },
  getKeystore: function () {
    if (_.isUndefined(this.state.keystore)) return null;
    return this.state.keystore;
  },
  handleUpdatePercentLoadedSuccess: function (payload) {
    this.state.percentLoaded = payload.percentLoaded;
    this.emit(constants.CHANGE_EVENT);
  },
  handleUpdateAccount: function (payload) {
    this.state.currentAccount = payload.currentAccount;
    this.state.privateKey = payload.privateKey;
    this.state.handle = payload.handle;
    this.state.keystore = payload.keystore;
    this.emit(constants.CHANGE_EVENT);
  },
  handleLoadApplicationDataSuccess: function (payload) {
    this.state.loaded = true;
    this.emit(constants.CHANGE_EVENT);
  },
  handleFilterSetupComplete: function (payload) {
    this.state.filters = payload;
    this.emit(constants.CHANGE_EVENT);
  },
  handleFilterTeardownComplete: function () {
    this.state.filters = {};
    this.emit(constants.CHANGE_EVENT);
  }
};
