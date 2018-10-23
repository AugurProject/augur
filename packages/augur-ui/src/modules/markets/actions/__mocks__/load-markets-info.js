const moduleObject = jest.genMockFromModule(
  "modules/markets/actions/load-markets-info"
);
const methodType = "LOAD_MARKETS_INFO";

let setBehavior = (value, cb) => {
  if (cb) cb();
  return {
    type: methodType,
    value
  };
};

moduleObject.loadMarketsInfo = jest.fn((value, cb) => setBehavior(value, cb));
moduleObject.loadMarketsInfo.__set = func => {
  setBehavior = func;
};

module.exports = moduleObject;
