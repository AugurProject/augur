const moduleObject = jest.genMockFromModule(
  "modules/markets/actions/load-markets-info"
);

let setBehavior = value => ({
  type: "LOAD_MARKETS_INFO",
  value
});
moduleObject.loadMarketsInfo = jest.fn(value => setBehavior(value));
moduleObject.loadMarketsInfo.__set = func => {
  setBehavior = func;
};

module.exports = moduleObject;
