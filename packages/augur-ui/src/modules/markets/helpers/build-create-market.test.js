import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";

import {
  YES_NO,
  CATEGORICAL,
  SCALAR
} from "modules/markets/constants/market-types";
import {
  DESIGNATED_REPORTER_SELF,
  DESIGNATED_REPORTER_SPECIFIC
} from "modules/markets/constants/new-market-constraints";
import { augur } from "services/augurjs";

jest.mock("services/augurjs");

describe("modules/markets/helpers/build-create-market", () => {
  const mockStore = configureMockStore([thunk]);

  augur.createMarket = jest.fn(() => {});
  augur.createMarket.createCategoricalMarket = jest.fn(() => {});
  augur.createMarket.createScalarMarket = jest.fn(() => {});
  augur.createMarket.createYesNoMarket = jest.fn(() => {});

  const {
    buildCreateMarket
  } = require("modules/markets/helpers/build-create-market");

  test(`should build new market data for categorical market`, () => {
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
      },
      newMarket: {
        description: "test description",
        endTime: {
          timestamp: 1234567890000
        },
        expirySource: "",
        settlementFee: 2,
        designatedReporterType: DESIGNATED_REPORTER_SELF,
        makerFee: 1,
        detailsText: "",
        category: "test category",
        tags: [],
        type: CATEGORICAL,
        outcomes: ["one", "two"]
      }
    };
    const store = mockStore(state);
    const actual = buildCreateMarket(
      store.getState().newMarket,
      false,
      store.getState().universe,
      store.getState().loginAccount,
      store.getState().contractAddresses
    );

    const expected = {
      _designatedReporterAddress: "0x1233",
      universe: "1010101",
      _endTime: 1234567890000,
      _denominationToken: "domnination",
      _description: "test description",
      _extraInfo: {
        longDescription: "",
        resolutionSource: "",
        tags: []
      },
      _outcomes: ["one", "two"],
      _topic: "TEST CATEGORY",
      _feePerEthInWei: "0x470de4df820000"
    };

    expect(actual.formattedNewMarket).toEqual(expected);
    expect(actual.createMarket).toEqual(
      augur.createMarket.createCategoricalMarket
    );
  });

  test(`should market object for yes/no  market`, () => {
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
      },
      newMarket: {
        description: "test description",
        endTime: {
          timestamp: 1234567890000
        },
        expirySource: "",
        settlementFee: 2,
        designatedReporterAddress: "0x01234abcd",
        designatedReporterType: DESIGNATED_REPORTER_SPECIFIC,
        makerFee: 1,
        detailsText: "",
        category: "test category",
        tags: [],
        type: YES_NO
      }
    };

    const store = mockStore(state);
    const actual = buildCreateMarket(
      store.getState().newMarket,
      false,
      store.getState().universe,
      store.getState().loginAccount,
      store.getState().contractAddresses
    );

    const expected = {
      _designatedReporterAddress: "0x01234abcd",
      universe: "1010101",
      _endTime: 1234567890000,
      _denominationToken: "domnination",
      _description: "test description",
      _extraInfo: {
        longDescription: "",
        resolutionSource: "",
        tags: []
      },
      _topic: "TEST CATEGORY",
      _feePerEthInWei: "0x470de4df820000"
    };

    expect(actual.formattedNewMarket).toEqual(expected);
    expect(actual.createMarket).toEqual(augur.createMarket.createYesNoMarket);
  });

  test(`should build market object for scalar market`, () => {
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
      },
      newMarket: {
        description: "test description",
        endTime: {
          timestamp: 1234567890000
        },
        expirySource: "",
        settlementFee: 2,
        makerFee: 1,
        designatedReporterAddress: "0x01234abcd",
        designatedReporterType: DESIGNATED_REPORTER_SPECIFIC,
        detailsText: "",
        category: "test category",
        tags: [],
        type: SCALAR,
        scalarSmallNum: "-10", // String for the test case, normally a BigNumber
        scalarBigNum: "10", // String for the test case, normally a BigNumber
        scalarDenomination: "%",
        tickSize: 1000
      }
    };
    const store = mockStore(state);
    const actual = buildCreateMarket(
      store.getState().newMarket,
      false,
      store.getState().universe,
      store.getState().loginAccount,
      store.getState().contractAddresses
    );

    const expected = {
      _designatedReporterAddress: "0x01234abcd",
      universe: "1010101",
      _endTime: 1234567890000,
      _denominationToken: "domnination",
      _description: "test description",
      _extraInfo: {
        _scalarDenomination: "%",
        longDescription: "",
        resolutionSource: "",
        tags: []
      },
      _maxPrice: "10",
      _minPrice: "-10",
      tickSize: 1000,
      _topic: "TEST CATEGORY",
      _feePerEthInWei: "0x470de4df820000"
    };

    expect(actual.formattedNewMarket).toEqual(expected);
    expect(actual.createMarket).toEqual(augur.createMarket.createScalarMarket);
  });
});
