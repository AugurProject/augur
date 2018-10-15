const mockLoadAccountHistoryModule = jest.genMockFromModule(
  "modules/auth/actions/load-account-history.js"
);

mockLoadAccountHistoryModule.loadAccountHistory = () => {};
mockLoadAccountHistoryModule.mockLoadAccountHistory = () => {};
mockLoadAccountHistoryModule.setLoadAccountHistory = fn => {
  mockLoadAccountHistoryModule.loadAccountHistory = fn;
};

module.exports = mockLoadAccountHistoryModule;
