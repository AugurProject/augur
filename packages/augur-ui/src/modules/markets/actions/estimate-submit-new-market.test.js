import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
  estimateSubmitNewMarket,
  __RewireAPI__ as estimateSubmitNewMarketReqireAPI
} from "modules/markets/actions/estimate-submit-new-market";
import { YES_NO } from "modules/markets/constants/market-types";

describe(`modules/markets/actions/estimate-submit-new-market.js`, () => {
  const mockStore = configureMockStore([thunk]);
  const newBinaryMarket = { properties: "value", type: YES_NO };
  const stateData = {
    universe: {
      id: "1010101"
    },
    contractAddresses: {
      Cash: "domnination"
    },
    loginAccount: {
      meta: {
        test: "object"
      },
      address: "0x1233"
    }
  };

  function buildCreateMarket() {
    return {
      createMarket(p) {
        p.onSuccess("GAS COST");
      },
      formattedNewMarket: {}
    };
  }

  afterAll(() => {
    estimateSubmitNewMarketReqireAPI.__ResetDependency__("buildCreateMarket");
  });

  const test = t =>
    test(t.description, () => {
      estimateSubmitNewMarketReqireAPI.__Rewire__(
        "buildCreateMarket",
        buildCreateMarket
      );
      const store = mockStore(t.state || {});
      t.assertions(store);
    });

  test({
    description: "should call callback with success and gas cost value",
    state: stateData,
    assertions: store => {
      store.dispatch(
        estimateSubmitNewMarket(newBinaryMarket, (err, value) => {
          assert.deepEqual(err, null, `Error value not as expected`);
          assert.deepEqual(value, "GAS COST", `Didn't value as expected`);
        })
      );
    }
  });
});
