import testState from "test/testState";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { submitInitialReport } from "modules/reports/actions/submit-initial-report";
import { REPORTING_REPORT_MARKETS } from "modules/routes/constants/views";

import { augur } from "services/augurjs";
import { getPayoutNumerators } from "modules/reports/selectors/get-payout-numerators";

jest.mock("modules/reports/selectors/get-payout-numerators");
jest.mock("services/augurjs");

describe(`modules/reports/actions/submit-initial-report.js`, () => {
  const state = Object.assign({}, testState);
  const mockStore = configureMockStore([thunk]);
  const store = mockStore(state);

  let callback;
  let history;

  beforeEach(() => {
    getPayoutNumerators.mockReturnValue([10000, 0]);

    callback = jest.fn();
    history = {
      push: jest.fn()
    };
  });

  describe("augur successful", () => {
    beforeEach(() => {
      augur.api.Market.doInitialReport.mockImplementation(
        ({ onSent, onSuccess }) => {
          onSent();
          onSuccess();
        }
      );
    });

    test(`should call callback and history`, () => {
      store.dispatch(
        submitInitialReport({
          estimateGas: false,
          marketId: "testMarketId",
          selectedOutcome: 0,
          invalid: false,
          history,
          returnPath: REPORTING_REPORT_MARKETS,
          callback
        })
      );
      expect(callback).toHaveBeenCalledTimes(1);
      expect(history.push).toHaveBeenCalledTimes(1);
    });

    test(`should call only callback`, () => {
      store.dispatch(
        submitInitialReport({
          estimateGas: false,
          marketId: null,
          selectedOutcome: 0,
          invalid: false,
          history,
          returnPath: REPORTING_REPORT_MARKETS,
          callback
        })
      );
      expect(callback).toHaveBeenCalledTimes(1);
      expect(history.push).not.toHaveBeenCalled();
    });

    test(`should call only callback with empty market id`, () => {
      store.dispatch(
        submitInitialReport({
          estimateGas: false,
          marketId: "",
          selectedOutcome: 0,
          invalid: false,
          history,
          returnPath: REPORTING_REPORT_MARKETS,
          callback
        })
      );
      expect(callback).toHaveBeenCalledTimes(1);
      expect(history.push).not.toHaveBeenCalled();
    });

    test(`should call only callback with empty market id and bad outcome`, () => {
      store.dispatch(
        submitInitialReport({
          estimateGas: false,
          marketId: "",
          selectedOutcome: "blah",
          invalid: false,
          history,
          returnPath: REPORTING_REPORT_MARKETS,
          callback
        })
      );
      expect(callback).toHaveBeenCalledTimes(1);
      expect(history.push).not.toHaveBeenCalled();
    });

    test(`should only call callback with empty market id, bad outcome and is invalid`, () => {
      store.dispatch(
        submitInitialReport({
          estimateGas: false,
          marketId: "",
          selectedOutcome: "blah",
          invalid: true,
          history,
          returnPath: REPORTING_REPORT_MARKETS,
          callback
        })
      );
      expect(callback).toHaveBeenCalledTimes(1);
      expect(history.push).not.toHaveBeenCalled();
    });

    test(`should only call callback with bad outcome`, () => {
      store.dispatch(
        submitInitialReport({
          estimateGas: false,
          marketId: "testMarketId",
          selectedOutcome: "blah",
          invalid: false,
          history,
          returnPath: REPORTING_REPORT_MARKETS,
          callback
        })
      );
      expect(callback).toHaveBeenCalledTimes(1);
      expect(history.push).not.toHaveBeenCalled();
    });
  });

  describe("augur failed", () => {
    beforeEach(() => {
      augur.api.Market.doInitialReport.mockImplementation(
        ({ onSent, onFailed }) => {
          onSent();
          onFailed();
        }
      );
    });

    test(`should call both callback and history with good data not invalid`, () => {
      store.dispatch(
        submitInitialReport({
          estimateGas: false,
          marketId: "testMarketId",
          selectedOutcome: 0,
          invalid: false,
          history,
          returnPath: REPORTING_REPORT_MARKETS,
          callback
        })
      );
      expect(callback).toHaveBeenCalledTimes(1);
      expect(history.push).toHaveBeenCalledTimes(1);
    });

    test(`should call callback and history with good data and is invalid`, () => {
      store.dispatch(
        submitInitialReport({
          estimateGas: false,
          marketId: "testMarketId",
          selectedOutcome: 0,
          invalid: true,
          history,
          returnPath: REPORTING_REPORT_MARKETS,
          callback
        })
      );
      expect(callback).toHaveBeenCalledTimes(1);
      expect(history.push).toHaveBeenCalledTimes(1);
    });

    test(`should call callback and not history with good data and is invalid`, () => {
      store.dispatch(
        submitInitialReport({
          estimateGas: true,
          marketId: "testMarketId",
          selectedOutcome: 0,
          invalid: true,
          history,
          returnPath: REPORTING_REPORT_MARKETS,
          callback
        })
      );
      expect(callback).toHaveBeenCalledTimes(1);
      expect(history.push).not.toHaveBeenCalled();
    });
  });
});
