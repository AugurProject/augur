const moduleObject = jest.genMockFromModule(
  "modules/markets/actions/load-markets-info"
);
const loadMarketInfoType = "LOAD_MARKETS_INFO";
const loadDisputeMarketsType = "LOAD_DISPUTE_MARKETS_INFO";

let setBehavior = (value, type, cb) => {
  if (cb) cb();
  return {
    type,
    value
  };
};

moduleObject.loadMarketsInfo = jest.fn((value, cb) =>
  setBehavior(value, loadMarketInfoType, cb)
);
moduleObject.loadMarketsInfo.__set = func => {
  setBehavior = func;
};

moduleObject.loadMarketsDisputeInfo = jest.fn((value, cb) =>
  setBehavior(value, loadDisputeMarketsType, cb)
);
moduleObject.loadMarketsDisputeInfo.__set = func => {
  setBehavior = func;
};

module.exports = moduleObject;
