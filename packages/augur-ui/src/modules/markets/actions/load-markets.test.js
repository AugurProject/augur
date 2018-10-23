import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { MARKET_REPORTING } from "modules/filter-sort/constants/market-states";
import { augur, constants } from "services/augurjs";

describe(`modules/markets/actions/load-markets`, () => {
  const middleware = [thunk];
  const mockStore = configureMockStore(middleware);
  const store = mockStore({ universe: { id: "0xUniverse" } });
  const { REPORTING_STATE } = constants;
  augur.markets = jest.fn(() => {});
  augur.markets.getMarkets = jest.fn(() => {});

  const {
    loadMarketsByFilter
  } = require("modules/markets/actions/load-markets");

  test(`test filtering market empty filter object`, () => {
    augur.markets.getMarkets.mockImplementation((value, cb) =>
      cb(null, [
        { id: "0xMarket1", test: "value" },
        { id: "0xMarket2", test: "value" }
      ])
    );

    const filterOptions = {};
    store.dispatch(
      loadMarketsByFilter(filterOptions, (err, actual) => {
        const expected = [
          { id: "0xMarket1", test: "value" },
          { id: "0xMarket2", test: "value" }
        ];
        expect(err).toBeNull();
        expect(actual).toEqual(expected);
      })
    );
  });

  test(`test filtering market empty filter object`, () => {
    augur.markets.getMarkets
      .mockImplementationOnce((value, cb) =>
        cb(null, [
          {
            id: "0xMarket1",
            test: "value",
            reportingState: REPORTING_STATE.OPEN_REPORTING
          },
          { id: "0xMarket2", test: "value" }
        ])
      )
      .mockImplementationOnce(() => {});

    const filterOptions = {
      filter: MARKET_REPORTING,
      sort: "endTime"
    };
    store.dispatch(
      loadMarketsByFilter(filterOptions, (err, actual) => {
        const expected = [
          {
            id: "0xMarket1",
            test: "value",
            reportingState: REPORTING_STATE.OPEN_REPORTING
          },
          { id: "0xMarket2", test: "value" }
        ];
        expect(err).toBeNull();
        expect(actual).toEqual(expected);
      })
    );
  });
});
