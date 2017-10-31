"use strict";

var assign = require("lodash.assign");
var async = require("async");
var encodeNumberAsJSNumber = require("speedomatic").encodeNumberAsJSNumber;
var parseLogMessage = require("./parse-message/parse-log-message");
var contracts = require("../contracts");
var ethrpc = require("../rpc-interface");
var chunkBlocks = require("../utils/chunk-blocks");
var listContracts = require("../utils/list-contracts");
var mapContractAddressesToNames = require("../utils/map-contract-addresses-to-names");
var mapEventSignaturesToNames = require("../utils/map-event-signatures-to-names");
var constants = require("../constants");

/**
 * @param {Object} p Parameters object.
 * @param {number=} p.fromBlock Block number to start looking up logs (default: constants.AUGUR_UPLOAD_BLOCK_NUMBER).
 * @param {number=} p.toBlock Block number where the log lookup should stop (default: current block number).
 * @param {function} callback Called when all data has been received and parsed.
 * @return { contractName => { eventName => [parsed event logs] } }
 */
function getAllAugurLogs(p, callback) {
  var allAugurLogs = {};
  var contractNameToAddressMap = contracts.addresses[ethrpc.getNetworkID()];
  var eventsAbi = contracts.abi.events;
  var contractAddressToNameMap = mapContractAddressesToNames(contractNameToAddressMap);
  var eventSignatureToNameMap = mapEventSignaturesToNames(eventsAbi);
  var filterParams = { address: listContracts(contractNameToAddressMap) };
  var fromBlock = p.fromBlock ? encodeNumberAsJSNumber(p.fromBlock) : constants.AUGUR_UPLOAD_BLOCK_NUMBER;
  var toBlock = p.toBlock ? encodeNumberAsJSNumber(p.toBlock) : parseInt(ethrpc.getCurrentBlock().number, 16);
  async.eachSeries(chunkBlocks(fromBlock, toBlock).reverse(), function (chunkOfBlocks, nextChunkOfBlocks) {
    ethrpc.getLogs(assign({}, filterParams, chunkOfBlocks), function (logs) {
      if (logs && logs.error) return nextChunkOfBlocks(logs);
      if (!Array.isArray(logs) || !logs.length) return nextChunkOfBlocks(null);
      logs.forEach(function (log) {
        if (log && Array.isArray(log.topics) && log.topics.length) {
          var contractName = contractAddressToNameMap[log.address];
          var eventName = eventSignatureToNameMap[contractName][log.topics[0]];
          if (!allAugurLogs[contractName]) allAugurLogs[contractName] = {};
          if (!allAugurLogs[contractName][eventName]) allAugurLogs[contractName][eventName] = [];
          try {
            var parsedLog = parseLogMessage(contractName, eventName, log, eventsAbi[contractName][eventName].inputs);
            allAugurLogs[contractName][eventName].push(parsedLog);
          } catch (exc) {
            console.error("parseLogMessage error", exc);
            console.log(contractName, eventName, log, eventsAbi[contractName], chunkOfBlocks);
          }
        }
      });
      nextChunkOfBlocks(null);
    });
  }, function (err) {
    if (err) return callback(err);
    callback(null, allAugurLogs);
  });
}

module.exports = getAllAugurLogs;
