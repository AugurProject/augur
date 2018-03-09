"use strict";

function createEthrpcConfiguration(configuration) {
  var ethrpcConfiguration = {
    connectionTimeout: 60000,
    errorHandler: function (err) { if (err) console.error(err); },
  };
  ethrpcConfiguration.httpAddresses = configuration.httpAddresses;
  ethrpcConfiguration.wsAddresses = configuration.wsAddresses;
  ethrpcConfiguration.ipcAddresses = configuration.ipcAddresses;
  ethrpcConfiguration.networkId = configuration.networkId;
  ethrpcConfiguration.startBlockStreamOnConnect = configuration.startBlockStreamOnConnect;
  return ethrpcConfiguration;
}

module.exports = createEthrpcConfiguration;
