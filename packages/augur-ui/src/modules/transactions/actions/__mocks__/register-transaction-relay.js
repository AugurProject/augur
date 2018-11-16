const mockRegisterTransactionRelay = jest.genMockFromModule(
  "modules/transactions/actions/register-transaction-relay.js"
);

mockRegisterTransactionRelay.registerTransactionRelay = () => ({
  type: "REGISTER_TRANSACTION_RELAY"
});

module.exports = mockRegisterTransactionRelay;
