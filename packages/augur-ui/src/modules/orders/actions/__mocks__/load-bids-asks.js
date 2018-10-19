let method = jest.genMockFromModule("modules/orders/actions/load-bids-asks");
const methodType = "LOAD_BID_ASKS";

let setBehavior = (value, cb) => {
  if (cb) cb();
  return {
    type: methodType,
    value
  };
};

method.__set = func => {
  setBehavior = func;
};
method = jest.fn((value, cb) => setBehavior(value, cb));

module.exports = method;
