const moduleObject = jest.genMockFromModule(
  "modules/markets/actions/market-trading-history-management"
);

let setBehavior = () => {};
moduleObject.loadMarketTradingHistory.__set = func => {
  setBehavior = func;
};
moduleObject.loadMarketTradingHistory = jest.fn(() => setBehavior());

module.exports = moduleObject;
