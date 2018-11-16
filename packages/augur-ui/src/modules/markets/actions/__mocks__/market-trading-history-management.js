const moduleObject = jest.genMockFromModule(
  "modules/markets/actions/market-trading-history-management"
);

const methodType = "LOAD_MARKET_TRADING_HISTORY";

let setBehavior = (value, cb) => {
  if (cb) cb();
  return {
    type: methodType,
    value
  };
};

moduleObject.loadMarketTradingHistory = jest.fn((value, cb) =>
  setBehavior(value, cb)
);

moduleObject.loadMarketTradingHistory.__set = func => {
  setBehavior = func;
};

module.exports = moduleObject;
