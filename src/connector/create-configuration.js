"use strict";

var assign = require("lodash.assign");

// upgrade from old config (single address per type) to new config (array of addresses per type)
function createConfiguration(options) {
  var configuration = assign({}, options);
  configuration.contracts = configuration.contracts || {};
  if (!Array.isArray(configuration.httpAddresses)) configuration.httpAddresses = [];
  if (!Array.isArray(configuration.wsAddresses)) configuration.wsAddresses = [];
  if (!Array.isArray(configuration.ipcAddresses)) configuration.ipcAddresses = [];
  if (typeof configuration.http === "string") configuration.httpAddresses.push(configuration.http);
  if (typeof configuration.ws === "string") configuration.wsAddresses.push(configuration.ws);
  if (typeof configuration.ipc === "string") configuration.ipcAddresses.push(configuration.ipc);
  return configuration;
}

module.exports = createConfiguration;
