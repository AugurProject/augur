import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";

const marketsData = { MARKET_0: { numOutcomes: 3 } };
const params = {
  marketId: "MARKET_0"
};

describe(`modules/orders/actions/load-bids-asks.js`, () => {
  jest.doMock("modules/orders/actions/load-one-outcome-bids-asks", () =>
    jest.fn((marketId, outcome, nextOutcome) => {
      if (!marketId && nextOutcome) return nextOutcome("ERROR_MESSAGE");
      if (nextOutcome) nextOutcome(null);
      return {
        type: "LOAD_ONE_OUTCOME_BIDS_ASKS",
        marketId,
        outcome
      };
    })
  );

  const loadBidsAsks = require("modules/orders/actions/load-bids-asks").default;

  test("short-circuit if market ID not provided", () => {
    const store = configureMockStore([thunk])({});
    store.dispatch(
      loadBidsAsks(undefined, err => {
        expect(err).toEqual("must specify market ID: undefined");
        expect(store.getActions()).toEqual([]);
      })
    );
  });

  test("short-circuit if market data not found", () => {
    const state = { marketsData: {} };
    const store = configureMockStore([thunk])(state);
    store.dispatch(
      loadBidsAsks(params.marketId, err => {
        expect(err).toEqual("market MARKET_0 data not found");
        expect(store.getActions()).toEqual([]);
      })
    );
  });

  test("short-circuit if market numOutcomes not found", () => {
    const state = {
      marketsData: { MARKET_0: { numOutcomes: undefined } }
    };
    const store = configureMockStore([thunk])(state);
    store.dispatch(
      loadBidsAsks(params.marketId, err => {
        expect(err).toEqual("market MARKET_0 numOutcomes not found");
        expect(store.getActions()).toEqual([]);
      })
    );
  });

  test("market with 2 outcomes", () => {
    const state = {
      marketsData: {
        MARKET_0: { numOutcomes: 2 }
      }
    };
    const store = configureMockStore([thunk])(state);
    store.dispatch(
      loadBidsAsks(params.marketId, err => {
        expect(err).toBeNull();
        expect(store.getActions()).toEqual([
          {
            type: "LOAD_ONE_OUTCOME_BIDS_ASKS",
            marketId: "MARKET_0",
            outcome: 0
          },
          {
            type: "LOAD_ONE_OUTCOME_BIDS_ASKS",
            marketId: "MARKET_0",
            outcome: 1
          }
        ]);
      })
    );
  });

  test("market with 3 outcomes", () => {
    const state = { marketsData };
    const store = configureMockStore([thunk])(state);
    store.dispatch(
      loadBidsAsks(params.marketId, err => {
        expect(err).toBeNull();
        expect(store.getActions()).toEqual([
          {
            type: "LOAD_ONE_OUTCOME_BIDS_ASKS",
            marketId: "MARKET_0",
            outcome: 0
          },
          {
            type: "LOAD_ONE_OUTCOME_BIDS_ASKS",
            marketId: "MARKET_0",
            outcome: 1
          },
          {
            type: "LOAD_ONE_OUTCOME_BIDS_ASKS",
            marketId: "MARKET_0",
            outcome: 2
          }
        ]);
      })
    );
  });
});
