import testState from "test/testState";
import configureMockStore from "redux-mock-store";
import { REPORTING_DISPUTE_MARKETS } from "modules/routes/constants/views";
import thunk from "redux-thunk";

import { submitMarketContribute } from "modules/reports/actions/submit-market-contribute";
import { removeAccountDispute } from "modules/reports/actions/update-account-disputes";

import { augur } from "services/augurjs";
import { getPayoutNumerators } from "src/modules/reports/selectors/get-payout-numerators";

jest.mock("services/augurjs");
jest.mock("modules/reports/selectors/get-payout-numerators");
jest.mock("modules/reports/actions/update-account-disputes");

describe(`modules/reports/actions/submit-market-contribute.js`, () => {
  const state = Object.assign({}, testState);
  const mockStore = configureMockStore([thunk]);
  const store = mockStore(state);

  let callback;
  let history;

  beforeEach(() => {
    getPayoutNumerators.mockReturnValue([10000, 0]);
    removeAccountDispute.mockReturnValue({ type: "REMOVE_ACCOUNT_DISPUTE" });

    callback = jest.fn();
    history = {
      push: jest.fn()
    };
  });

  describe("augur successful", () => {
    beforeEach(() => {
      augur.api.Market.contribute.mockImplementation(
        ({ onSent, onSuccess }) => {
          onSent();
          onSuccess();
        }
      );
    });

    test(`should call callback and history with good data`, () => {
      store.dispatch(
        submitMarketContribute({
          estimateGas: false,
          marketId: "testMarketId",
          selectedOutcome: 0,
          invalid: false,
          amount: 1000,
          history,
          returnPath: REPORTING_DISPUTE_MARKETS,
          callback
        })
      );
      expect(callback).toHaveBeenCalledTimes(1);
      expect(history.push).toHaveBeenCalledTimes(1);
    });

    test(`should call callback and history with good negative data`, () => {
      store.dispatch(
        submitMarketContribute({
          estimateGas: false,
          marketId: "testMarketId",
          selectedOutcome: -10,
          invalid: false,
          amount: 1000,
          history,
          returnPath: REPORTING_DISPUTE_MARKETS,
          callback
        })
      );
      expect(callback).toHaveBeenCalledTimes(1);
      expect(history.push).toHaveBeenCalledTimes(1);
    });

    test(`should only call callback with null market id`, () => {
      store.dispatch(
        submitMarketContribute({
          estimateGas: false,
          marketId: null,
          selectedOutcome: 0,
          invalid: false,
          amount: 1000,
          history,
          returnPath: REPORTING_DISPUTE_MARKETS,
          callback
        })
      );
      expect(callback).toHaveBeenCalledTimes(1);
      expect(history.push).not.toHaveBeenCalled();
    });

    test(`should only callback with empty market id`, () => {
      store.dispatch(
        submitMarketContribute({
          estimateGas: false,
          marketId: "",
          selectedOutcome: 0,
          invalid: false,
          amount: 1000,
          history,
          returnPath: REPORTING_DISPUTE_MARKETS,
          callback
        })
      );
      expect(callback).toHaveBeenCalledTimes(1);
      expect(history.push).not.toHaveBeenCalled();
    });

    test("should only call callback with bad outcome", () => {
      store.dispatch(
        submitMarketContribute({
          estimateGas: false,
          marketId: "testMarketId",
          selectedOutcome: "blah",
          invalid: false,
          amount: 1000,
          history,
          returnPath: REPORTING_DISPUTE_MARKETS,
          callback
        })
      );
      expect(callback).toHaveBeenCalledTimes(1);
      expect(history.push).not.toHaveBeenCalled();
    });

    test(`should call callback but not history with good data`, () => {
      store.dispatch(
        submitMarketContribute({
          estimateGas: true,
          marketId: "testMarketId",
          selectedOutcome: 0,
          invalid: false,
          amount: 1000,
          history,
          returnPath: REPORTING_DISPUTE_MARKETS,
          callback
        })
      );
      expect(callback).toHaveBeenCalledTimes(1);
      expect(history.push).not.toHaveBeenCalled();
    });
  });

  describe("augur failed", () => {
    beforeEach(() => {
      augur.api.Market.contribute.mockImplementation(({ onSent, onFailed }) => {
        onSent();
        onFailed();
      });
    });
    test(`should call both callback and history with good data`, () => {
      store.dispatch(
        submitMarketContribute({
          estimateGas: false,
          marketId: "testMarketId",
          selectedOutcome: 0,
          invalid: false,
          amount: 1000,
          history,
          returnPath: REPORTING_DISPUTE_MARKETS,
          callback
        })
      );
      expect(callback).toHaveBeenCalledTimes(1);
      expect(history.push).toHaveBeenCalledTimes(1);
    });
  });
});
