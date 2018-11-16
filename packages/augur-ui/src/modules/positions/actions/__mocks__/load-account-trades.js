const moduleObject = jest.genMockFromModule(
  "modules/positions/actions/load-account-trades"
);

const methodType = "LOAD_ACCOUNT_TRADES";

let setBehavior = (value, cb) => {
  if (cb) cb();
  return {
    type: methodType,
    value
  };
};

moduleObject.loadAccountTrades = jest.fn((value, cb) => setBehavior(value, cb));
moduleObject.loadAccountTrades.__set = func => {
  setBehavior = func;
};

module.exports = moduleObject;
