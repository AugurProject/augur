"use strict";

var createRpcInterface = function (ethrpc) {
  return {
    errors: ethrpc.errors,
    constants: ethrpc.constants,
    eth: ethrpc.eth,
    shh: ethrpc.shh,
    miner: ethrpc.miner,
    personal: ethrpc.personal,
    clear: ethrpc.clear,
    getBlockStream: ethrpc.getBlockStream,
    getCurrentBlock: ethrpc.getCurrentBlock,
    getGasPrice: ethrpc.getGasPrice,
    getNetworkID: ethrpc.getNetworkID,
    getTransactions: ethrpc.getTransactions,
    getLogs: ethrpc.getLogs,
    getBalance: ethrpc.getBalance,
    estimateGas: ethrpc.estimateGas,
    getBlockByNumber: ethrpc.getBlockByNumber,
    getTransactionReceipt: ethrpc.getTransactionReceipt,
    isUnlocked: ethrpc.isUnlocked,
    sendEther: ethrpc.sendEther,
    waitForNextBlocks: ethrpc.waitForNextBlocks,
    packageAndSubmitRawTransaction: ethrpc.packageAndSubmitRawTransaction,
    callContractFunction: ethrpc.callContractFunction,
    transact: ethrpc.transact,
    handleRPCError: ethrpc.handleRPCError,
    excludeFromTransactionRelay: ethrpc.excludeFromTransactionRelay,
    includeInTransactionRelay: ethrpc.includeInTransactionRelay,
    registerTransactionRelay: ethrpc.registerTransactionRelay,
    unregisterTransactionRelay: ethrpc.unregisterTransactionRelay
  };
};

var rpcInterface = createRpcInterface(require("ethrpc"));
rpcInterface.createRpcInterface = createRpcInterface;

module.exports = rpcInterface;
