const moduleObject = jest.genMockFromModule(
  "modules/markets/actions/price-history-management"
);

const methodType = "LOAD_PRICE_HISTORY";

let setBehavior = (value, cb) => {
  if (cb) cb();
  return {
    type: methodType,
    value
  };
};
moduleObject.loadPriceHistory = jest.fn((value, cb) => setBehavior(value, cb));
moduleObject.loadPriceHistory.__set = func => {
  setBehavior = func;
};

module.exports = moduleObject;
