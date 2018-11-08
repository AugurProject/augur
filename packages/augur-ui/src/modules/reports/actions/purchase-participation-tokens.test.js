import mockStore from "test/mockStore";
import speedomatic from "speedomatic";
import { formatGasCostToEther } from "utils/format-number";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";

import { purchaseParticipationTokens } from "modules/reports/actions/participation-tokens-management";

import { augur } from "services/augurjs";

jest.mock("modules/auth/selectors/get-gas-price");
jest.mock("services/augurjs");

describe("purchase participation tokens tests", () => {
  const { store } = mockStore;

  const ACTIONS = {
    CLOSE_MODAL: { type: "CLOSE_MODAL" }
  };

  beforeEach(() => {
    getGasPrice.mockImplementation(() => 100000);
  });

  afterEach(() => {
    store.clearActions();
  });

  test("It should handle buying 10.25 participation tokens", done => {
    augur.reporting.getFeeWindowCurrent.mockImplementation((p, cb) => {
      expect(p).toEqual({ universe: store.getState().universe.id });
      expect(typeof cb).toBe("function");
      cb(null, { feeWindow: "0xfeeWindow01" });
    });

    augur.api.FeeWindow.buy.mockImplementation(
      ({ tx, _attotokens, onSent, onSuccess, onFailed }) => {
        expect(tx).toEqual({ to: "0xfeeWindow01", estimateGas: false });
        expect(_attotokens).toEqual(speedomatic.fix("10.25", "hex"));
        expect(typeof onSent).toBe("function");
        expect(typeof onSuccess).toBe("function");
        expect(typeof onFailed).toBe("function");
        onSent();
        onSuccess({});
      }
    );

    store.dispatch(
      purchaseParticipationTokens("10.25", false, (err, res) => {
        expect(err).toBeNull();
        expect(typeof res).toBe("object");
        const expectedActions = [ACTIONS.CLOSE_MODAL];
        expect(store.getActions()).toEqual(expectedActions);
        done();
      })
    );

    expect(augur.api.FeeWindow.buy).toHaveBeenCalledWith({
      tx: { to: "0xfeeWindow01", estimateGas: false },
      _attotokens: speedomatic.fix("10.25", "hex"),
      onSent: expect.any(Function),
      onSuccess: expect.any(Function),
      onFailed: expect.any(Function)
    });
  });

  test("It should handle estimating gas for buying participation tokens", done => {
    augur.api.FeeWindow.buy.mockImplementation(p => {
      const { tx, _attotokens, onSent, onSuccess, onFailed } = p;
      expect(tx).toEqual({ to: "0xfeeWindow01", estimateGas: true });
      expect(_attotokens).toEqual(speedomatic.fix("10.25", "hex"));
      expect(typeof onSent).toBe("function");
      expect(typeof onSuccess).toBe("function");
      expect(typeof onFailed).toBe("function");
      onSent();
      onSuccess("0xdeadbeef");
    });
    augur.reporting.getFeeWindowCurrent.mockImplementation((p, cb) => {
      expect(p).toEqual({ universe: store.getState().universe.id });
      expect(typeof cb).toBe("function");
      cb(null, { feeWindow: "0xfeeWindow01" });
    });

    store.dispatch(
      purchaseParticipationTokens("10.25", true, (err, res) => {
        expect(err).toBeNull();
        const expectedResponse = formatGasCostToEther(
          "0xdeadbeef",
          { decimalsRounded: 4 },
          100000
        );
        expect(res).toEqual(expectedResponse);
        const expectedActions = [];
        expect(store.getActions()).toEqual(expectedActions);
        done();
      })
    );
  });

  test("It should handle an error from estimating gas for buying participation tokens", done => {
    augur.api.FeeWindow.buy.mockImplementation(p => {
      const { tx, _attotokens, onSent, onSuccess, onFailed } = p;
      expect(tx).toEqual({ to: "0xfeeWindow01", estimateGas: true });
      expect(_attotokens).toEqual(speedomatic.fix("10.25", "hex"));
      expect(typeof onSent).toBe("function");
      expect(typeof onSuccess).toBe("function");
      expect(typeof onFailed).toBe("function");
      onSent();
      onFailed({ error: 1000, message: "Uh-Oh!" });
    });
    augur.reporting.getFeeWindowCurrent.mockImplementation((p, cb) => {
      expect(p).toEqual({ universe: store.getState().universe.id });
      expect(typeof cb).toBe("function");
      cb(null, { feeWindow: "0xfeeWindow01" });
    });

    store.dispatch(
      purchaseParticipationTokens("10.25", true, (err, res) => {
        expect(res).not.toBeDefined();
        expect(err).toEqual({ error: 1000, message: "Uh-Oh!" });
        const expectedActions = [];
        expect(store.getActions()).toEqual(expectedActions);
        done();
      })
    );
  });

  test("It should handle an error from getting the Fee Window", done => {
    augur.api.FeeWindow.buy.mockImplementation(() => {
      expect("we should never hit this.").toBeNull();
    });
    augur.reporting.getFeeWindowCurrent.mockImplementation((p, cb) => {
      expect(p).toEqual({ universe: store.getState().universe.id });
      expect(typeof cb).toBe("function");
      cb({ error: 1000, message: "Uh-Oh!" });
    });

    store.dispatch(
      purchaseParticipationTokens("10.25", true, (err, res) => {
        expect(res).not.toBeDefined();
        expect(err).toEqual({ error: 1000, message: "Uh-Oh!" });
        const expectedActions = [];
        expect(store.getActions()).toEqual(expectedActions);
        done();
      })
    );
  });

  test("It should handle an null current Fee Window", done => {
    augur.api.FeeWindow.buy.mockImplementation(() => {
      expect("we should never hit this.").toBeNull();
    });
    augur.api.Universe.buyParticipationTokens.mockImplementation(p => {
      p.onSuccess("10.25");
    });
    augur.reporting.getFeeWindowCurrent.mockImplementation((p, cb) => {
      expect(p).toEqual({ universe: store.getState().universe.id });
      expect(typeof cb).toBe("function");
      cb(null);
    });

    store.dispatch(
      purchaseParticipationTokens("10.25", false, (err, res) => {
        expect(err).toBeNull();
        expect(res).toEqual("10.25");
        const expectedActions = [];
        expect(store.getActions()).toEqual(expectedActions);
        done();
      })
    );
  });
});
