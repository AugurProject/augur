"use strict";

var compact = require("lodash").compact;
var assign = require("lodash").assign;
var contracts = require("../contracts");
var ethrpc = require("../rpc-interface");
var isObject = require("../utils/is-object");
var parseLogMessage = require("./parse-message/parse-log-message");

function parseLogs(logs, eventByAddressAndSignature) {
  const parsedLogs = logs.map((log) => {
    if (eventByAddressAndSignature[log.address] === undefined) {
      throw new Error(`Missing mapping for contract address ${log.address}`);
    }
    const eventDetails = eventByAddressAndSignature[log.address][log.topics[0]];
    // Based on how we grab event logs, it's possible to get an event we don't care about if
    // two contracts have same event, but we only want to subscribe to one of them
    if (eventDetails === undefined) return null;
    return parseLogMessage(eventDetails.contractName, eventDetails.eventName, log, eventDetails.abi);
  });
  return compact(parsedLogs);
}

// Iterates through eventCallbacks, generates eth filter and event signature mapping
function getEventsDetails(eventsToSubscribe, activeContracts) {
  var eventByAddressAndSignature = {};
  const addresses = [];
  const topics = new Set();
  for (const contractName in eventsToSubscribe) {
    if (Object.prototype.hasOwnProperty.call(eventsToSubscribe, contractName)) {
      eventByAddressAndSignature[activeContracts[contractName]] = {};
      addresses.push(activeContracts[contractName]);
      for (let eventNameIndex = 0; eventNameIndex < eventsToSubscribe[contractName].length; eventNameIndex++) {
        const eventName = eventsToSubscribe[contractName][eventNameIndex];
        const eventAbi = contracts.abi.events[contractName][eventName];
        if (!eventAbi || !eventAbi.contract || !eventAbi.signature || !eventAbi.inputs) throw new Error(`Missing abi for ${contractName}.${eventName}`);
        eventByAddressAndSignature[activeContracts[contractName]][eventAbi.signature] = {
          contractName: contractName,
          eventName: eventName,
          abi: eventAbi.inputs,
        };
        topics.add(eventAbi.signature);
      }
    }
  }
  const filter = {
    address: addresses,
    topics: [Array.from(topics)],
  };
  return {
    eventByAddressAndSignature,
    filter,
  };
}

function flagRemoved(logs) {
  return logs.map((log) => assign({}, log, {removed: true}));
}

/**
 * Start listening for events emitted by the Ethereum blockchain.
 * @param {Object.<function>=} eventsToSubscribe List of interested contract events. Object of arrays. {ContractName: ["Event1", "Event2"]}
 * @param {number=} startingBlockNumber Block height to start blockstream at.
 * @param {function=} logsAddedListener Callback which accepts array of logs added. Always gets one block worth of logs. Called after block added
 * @param {function=} logsRemovedListener Callback which accepts array of logs removed. Always gets one block worth of logs. Called before block removed
 */
function startBlockchainEventListeners(eventsToSubscribe, startingBlockNumber, logsAddedListener, logsRemovedListener) {
  if (typeof startingBlockNumber !== "undefined") {
    console.log("Starting blockstream at block ", startingBlockNumber);
    ethrpc.startBlockStream(startingBlockNumber);
  }
  const blockStream = ethrpc.getBlockStream();
  if (!blockStream) throw new Error("Not connected to Ethereum");
  if (!isObject(eventsToSubscribe)) throw new Error("No event callbacks found");
  const activeContracts = contracts.addresses[ethrpc.getNetworkID()];

  const eventDetails = getEventsDetails(eventsToSubscribe, activeContracts);
  blockStream.addLogFilter(eventDetails.filter);
  blockStream.subscribeToOnLogsAdded((blockHash, logs) => logsAddedListener(blockHash, parseLogs(logs, eventDetails.eventByAddressAndSignature)));
  blockStream.subscribeToOnLogsRemoved((blockHash, logs) => logsRemovedListener(blockHash, parseLogs(flagRemoved(logs), eventDetails.eventByAddressAndSignature)));
}

module.exports = startBlockchainEventListeners;
