const moduleObject = jest.genMockFromModule(
  "modules/markets/selectors/markets-all"
);

let value = {};
moduleObject.selectMarkets = jest.fn(() => value);

moduleObject.selectMarkets.__set = state => {
  value = state;
};

module.exports = moduleObject;
