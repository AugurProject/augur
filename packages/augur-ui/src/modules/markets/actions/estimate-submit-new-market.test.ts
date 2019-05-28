import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { YES_NO } from "modules/common-elements/constants";
import { buildCreateMarket } from "modules/markets/helpers/build-create-market";

jest.mock("modules/markets/helpers/build-create-market");

describe("modules/markets/actions/estimate-submit-new-market.js", () => {
  const mockStore = configureMockStore([thunk]);
  const newBinaryMarket = { properties: "value", type: YES_NO };
  const state = {
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

  const {
    estimateSubmitNewMarket
  } = require("modules/markets/actions/estimate-submit-new-market");

  describe(`get gas cost estimation`, () => {
    beforeEach(() => {
      buildCreateMarket.mockImplementationOnce(() => ({
        createMarket: jest.fn(value => {
          value.onSent({
            callReturn: "marketId"
          });
          value.onSuccess("GAS COST");
        }),
        formattedNewMarket: {}
      }));
    });

    test("should call callback with success and gas cost value", () => {
      const store = mockStore(state);

      store.dispatch(
        estimateSubmitNewMarket(newBinaryMarket, (err, value) => {
          expect(err).toBeNull();
          expect(value).toBe("GAS COST");
        })
      );
    });
  });
});
