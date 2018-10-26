import marketAssertions from "src/assertions/market";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

jest.mock("modules/trades/actions/place-trade");
jest.mock("modules/reports/actions/submit-report");
jest.mock("modules/orders/selectors/positions-plus-asks");
jest.mock("modules/orders/selectors/user-open-orders");
jest.mock("modules/orders/selectors/user-open-orders-summary");
jest.mock("modules/markets/selectors/price-time-series");
jest.mock("modules/orders/selectors/order-book-series");
jest.mock("modules/trades/helpers/has-user-enough-funds");
jest.mock("modules/reports/selectors/reportable-outcomes");
jest.mock("utils/calculate-payout-numerators-value");

describe(`modules/markets/selectors/market.js`, () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const state = {
    loginAccount: {
      address: "0x0000000000000000000000000000000000000001"
    }
  };
  const store = mockStore(state);
  const selector = require("modules/markets/selectors/market.js");

  beforeEach(() => {
    store.clearActions();
  });

  afterEach(() => {
    store.clearActions();
  });

  test(`should return the expected values to components`, () => {
    const actual = selector.default(state);
    marketAssertions(actual);
  });
});
