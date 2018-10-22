const moduleObject = jest.genMockFromModule(
  "modules/transactions/actions/add-transactions"
);

moduleObject.addTradeTransactions = jest.fn(() => ({
  type: "ADD_TRADE_TRANSACTIONS"
}));

moduleObject.addTransferTransactions = jest.fn(() => ({
  type: "ADD_TRANSFER_TRANSACTIONS"
}));
moduleObject.addNewMarketCreationTransactions = jest.fn(() => ({
  type: "ADD_NEW_MARKET_CREATION_TRANSACTIONS"
}));

moduleObject.addMarketCreationTransactions = jest.fn(() => ({
  type: "ADD_MARKET_CREATION_TRANSACTION"
}));

moduleObject.addCompleteSetsSoldLogs = jest.fn(() => ({
  type: "ADD_COMPLETE_SET_SOLD"
}));

moduleObject.addOpenOrderTransactions = jest.fn(() => ({
  type: "ADD_OPEN_ORDER_TRANSACTIONS"
}));

moduleObject.addReportingTransactions = jest.fn(() => ({
  type: "ADD_REPORTING_TRANSACTIONS"
}));

module.exports = moduleObject;
