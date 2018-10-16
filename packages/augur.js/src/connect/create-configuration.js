"use strict";

var assign = require("lodash").assign;
var cloneDeep = require("lodash").cloneDeep;

// upgrade from old config (single address per type) to new config (array of addresses per type)
function createConfiguration(options) {
  var configuration = assign({ contracts: {} }, cloneDeep(options));
  if (!Array.isArray(configuration.httpAddresses)) configuration.httpAddresses = [];
  if (!Array.isArray(configuration.wsAddresses)) configuration.wsAddresses = [];
  if (!Array.isArray(configuration.ipcAddresses)) configuration.ipcAddresses = [];
  if (typeof configuration.http === "string" && configuration.http !== "") configuration.httpAddresses.push(configuration.http);
  if (typeof configuration.ws === "string" && configuration.ws !== "") configuration.wsAddresses.push(configuration.ws);
  if (typeof configuration.ipc === "string" && configuration.ipc !== "") configuration.ipcAddresses.push(configuration.ipc);
  return configuration;
}

module.exports = createConfiguration;
