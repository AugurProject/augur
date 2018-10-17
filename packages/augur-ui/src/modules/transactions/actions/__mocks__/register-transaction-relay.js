const mockRegisterTransactionRelay = jest.genMockFromModule(
  "../register-transaction-relay.js"
);

mockRegisterTransactionRelay.registerTransactionRelay = () => ({
  type: "REGISTER_TRANSACTION_RELAY"
});

module.exports = mockRegisterTransactionRelay;
