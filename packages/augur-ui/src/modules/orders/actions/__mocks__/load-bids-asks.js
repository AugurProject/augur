let method = jest.genMockFromModule("modules/orders/actions/load-bids-asks");

let setBehavior = () => {};
method.__set = func => {
  setBehavior = func;
};
method = jest.fn(() => setBehavior());

module.exports = method;
