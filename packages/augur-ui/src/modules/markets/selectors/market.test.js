import sinon from "sinon";

import * as mockStore from "test/mockStore";
import marketAssertions from "assertions/market";

jest.mock("../../../store", () => store);

jest.mock("../../orders/selectors/user-open-orders-summary", () => proxyquire(
  "../../../src/modules/orders/selectors/user-open-orders-summary",
  {
    "../../../store": store
  }
));

jest.mock("../../../modules/markets/selectors/user-markets", () => proxyquire(
  "../../../src/modules/markets/selectors/user-markets",
  {
    "../../../services/augurjs": stubbedAugurJS,
    "../../../selectors": stubbedSelectors
  }
));

jest.mock("../../../store", () => store);
jest.mock("../../../services/augurjs", () => stubbedAugurJS);
jest.mock("../../../selectors", () => stubbedSelectors);

describe(`modules/markets/selectors/market.js`, () => {
  const { store } = mockStore.default;

  const { loginAccount } = store.getState();
  const stubbedSelectors = { loginAccount };

  const stubbedAugurJS = {
    getMarketCreatorFeesCollected: () => {},
    abi: { bignum: n => n }
  };
  sinon
    .stub(stubbedAugurJS, "getMarketCreatorFeesCollected")
    .callsFake(() => 10);

  const selector = require("../../../src/modules/markets/selectors/market.js");

  beforeEach(() => {
    store.clearActions();
  });

  afterEach(() => {
    store.clearActions();
  });

  test(`should return the expected values to components`, () => {
    const actual = selector.default();
    marketAssertions(actual);
  });
});
