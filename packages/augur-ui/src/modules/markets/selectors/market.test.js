import { describe, it, beforeEach, afterEach } from "mocha";
import proxyquire from "proxyquire";
import sinon from "sinon";

import * as mockStore from "test/mockStore";
import marketAssertions from "assertions/market";

describe(`modules/markets/selectors/market.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
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

  const selector = proxyquire(
    "../../../src/modules/markets/selectors/market.js",
    {
      "../../../store": store,
      // make selectors/user-open-orders-summary use the same store as selectors/market.js
      "../../orders/selectors/user-open-orders-summary": proxyquire(
        "../../../src/modules/orders/selectors/user-open-orders-summary",
        {
          "../../../store": store
        }
      ),
      "../../../modules/markets/selectors/user-markets": proxyquire(
        "../../../src/modules/markets/selectors/user-markets",
        {
          "../../../services/augurjs": stubbedAugurJS,
          "../../../selectors": stubbedSelectors
        }
      )
    }
  );

  beforeEach(() => {
    store.clearActions();
  });

  afterEach(() => {
    store.clearActions();
  });

  it(`should return the expected values to components`, () => {
    const actual = selector.default();
    marketAssertions(actual);
  });
});
