"use strict";

var createRpcInterface = function (ethrpc) {
  return {
    errors: ethrpc.errors,
    eth: ethrpc.eth,
    shh: ethrpc.shh,
    miner: ethrpc.miner,
    personal: ethrpc.personal,
    getBlockStream: ethrpc.getBlockStream,
    getCurrentBlock: ethrpc.getCurrentBlock,
    getGasPrice: ethrpc.getGasPrice,
    getNetworkID: ethrpc.getNetworkID,
    getTransactions: ethrpc.getTransactions,
    getLogs: ethrpc.getLogs,
    getBalance: ethrpc.getBalance,
    estimateGas: ethrpc.estimateGas,
    getBlockByNumber: ethrpc.getBlockByNumber,
    isUnlocked: ethrpc.isUnlocked,
    sendEther: ethrpc.sendEther,
    packageAndSubmitRawTransaction: ethrpc.packageAndSubmitRawTransaction,
    callContractFunction: ethrpc.callContractFunction,
    transact: ethrpc.transact
  };
};

var rpcInterface = createRpcInterface(require("ethrpc"));
rpcInterface.createRpcInterface = createRpcInterface;

module.exports = rpcInterface;
