import proxyquire from "proxyquire";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import realSelector from "modules/trades/selectors/trade-in-progress";

describe(`modules/trades/selectors/trade-in-progress.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const testState = {
    selectedMarketId: "testmarket",
    tradesInProgress: {
      testmarket: "this is a test"
    }
  };
  const store = mockStore(testState);

  const selector = proxyquire(
    "../../../src/modules/trades/selectors/trade-in-progress",
    {
      "../../../store": store
    }
  );

  it(`should return tradesInProgress[selectedMarketId] if available`, () => {
    assert.equal(
      selector.default(),
      "this is a test",
      `selector.default() is not 'this is a test'`
    );
  });

  it(`should return undefined if tradesInProgress[selectedMarketId] doesn't exist`, () => {
    assert.isUndefined(
      realSelector(),
      `isn't undefined as expected with blank state`
    );
  });
});
