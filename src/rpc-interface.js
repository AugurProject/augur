"use strict";

var createRpcInterface = function (ethrpc) {
  return {
    constants: ethrpc.constants,
    errors: ethrpc.errors,
    eth: ethrpc.eth,
    clear: ethrpc.clear,
    startBlockStream: ethrpc.startBlockStream,
    getBlockStream: ethrpc.getBlockStream,
    getCoinbase: ethrpc.getCoinbase,
    getCurrentBlock: ethrpc.getCurrentBlock,
    getGasPrice: ethrpc.getGasPrice,
    getNetworkID: ethrpc.getNetworkID,
    getLogs: ethrpc.getLogs,
    getTransactionReceipt: ethrpc.getTransactionReceipt,
    isUnlocked: ethrpc.isUnlocked,
    sendEther: ethrpc.sendEther,
    packageAndSubmitRawTransaction: ethrpc.packageAndSubmitRawTransaction,
    callContractFunction: ethrpc.callContractFunction,
    transact: ethrpc.transact,
    excludeFromTransactionRelay: ethrpc.excludeFromTransactionRelay,
    registerTransactionRelay: ethrpc.registerTransactionRelay,
    setDebugOptions: ethrpc.setDebugOptions,
    WsTransport: ethrpc.WsTransport,
    publish: ethrpc.publish,
  };
};

var ethrpc = createRpcInterface(require("ethrpc"));
ethrpc.createRpcInterface = createRpcInterface;

module.exports = ethrpc;
