const moduleObject = jest.genMockFromModule(
  "modules/markets/actions/price-history-management"
);

let setBehavior = () => {};
moduleObject.loadPriceHistory = jest.fn(() => setBehavior());
moduleObject.loadPriceHistory.__set = func => {
  setBehavior = func;
};

module.exports = moduleObject;
