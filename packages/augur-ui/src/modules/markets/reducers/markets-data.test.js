import reducer from "modules/markets/reducers/markets-data";
import { UPDATE_MARKET_REP_BALANCE } from "src/modules/markets/actions/update-markets-data";

describe(`modules/markets/reducers/markets-data.js`, () => {
  describe("UPDATE_MARKET_CATEGORY", () => {
    test("no market ID = no change to markets data", () => {
      const marketsData = {
        "0xa1": {
          id: "0xa1",
          category: undefined
        },
        "0xa2": {
          id: "0xa2",
          category: "regular potables"
        }
      };

      const action = {
        type: "UPDATE_MARKET_CATEGORY",
        data: {
          marketId: undefined,
          category: "potent potables"
        }
      };

      expect(reducer(marketsData, action)).toEqual({
        "0xa1": {
          id: "0xa1",
          category: undefined
        },
        "0xa2": {
          id: "0xa2",
          category: "regular potables"
        }
      });
    });

    test("set market category", () => {
      const marketsData = {
        "0xa1": {
          id: "0xa1",
          category: undefined
        },
        "0xa2": {
          id: "0xa2",
          category: "regular potables"
        }
      };
      const action = {
        type: "UPDATE_MARKET_CATEGORY",
        data: {
          marketId: "0xa1",
          category: "potent potables"
        }
      };

      expect(reducer(marketsData, action)).toEqual({
        "0xa1": {
          id: "0xa1",
          category: "potent potables"
        },
        "0xa2": {
          id: "0xa2",
          category: "regular potables"
        }
      });
    });

    test("unset market category", () => {
      const marketsData = {
        "0xa1": {
          id: "0xa1",
          category: "potent potables"
        },
        "0xa2": {
          id: "0xa2",
          category: "regular potables"
        }
      };
      const action = {
        type: "UPDATE_MARKET_CATEGORY",
        data: {
          marketId: "0xa1",
          category: undefined
        }
      };

      expect(reducer(marketsData, action)).toEqual({
        "0xa1": {
          id: "0xa1",
          category: undefined
        },
        "0xa2": {
          id: "0xa2",
          category: "regular potables"
        }
      });
    });

    test("update market category", () => {
      const marketsData = {
        "0xa1": {
          id: "0xa1",
          category: "regular potables"
        },
        "0xa2": {
          id: "0xa2",
          category: "regular potables"
        }
      };
      const action = {
        type: "UPDATE_MARKET_CATEGORY",
        data: {
          marketId: "0xa1",
          category: "potent potables"
        }
      };

      expect(reducer(marketsData, action)).toEqual({
        "0xa1": {
          id: "0xa1",
          category: "potent potables"
        },
        "0xa2": {
          id: "0xa2",
          category: "regular potables"
        }
      });
    });
  });
  describe("UPDATE_MARKET_REP_BALANCE", () => {
    test("should add repBalance attribute to market data", () => {
      const result = reducer(
        {
          "0xa2": {}
        },
        {
          type: UPDATE_MARKET_REP_BALANCE,
          data: {
            marketId: "0xa2",
            repBalance: 0.3496805826822917
          }
        }
      );

      const d = result["0xa2"];
      expect(d).toHaveProperty("repBalance");
      expect(d.repBalance).toBe(0.3496805826822917);
    });
  });

  describe("UPDATE_MARKETS_DATA", () => {
    test("should update markets data", () => {
      const marketsData = {
        "0x04be50f6303babc4e5400a6ebfaa77a8a76f620dd9f6394466e552842f585801": {
          id: 2,
          outcomeId: "someoutcome",
          details: {
            example: "test"
          }
        }
      };
      const marketsData2 = {
        "0x0131d98e878803e113e2accc457ad57f5b97a87910be31d60e931c08ca4d5ef1": {
          id: 1,
          outcomeId: "an outcomeId",
          details: {
            test: "example"
          }
        },
        "0x04be50f6303babc4e5400a6ebfaa77a8a76f620dd9f6394466e552842f585801": {
          id: 2,
          outcomeId: "someoutcome",
          details: {
            example: "test"
          }
        }
      };
      const curMarketsData1 = {
        "0x0131d98e878803e113e2accc457ad57f5b97a87910be31d60e931c08ca4d5ef1": {
          id: 1,
          outcomeId: "an outcomeId",
          details: {
            test: "example"
          }
        }
      };
      const curMarketsData2 = {
        "0x0131d98e878803e113e2accc457ad57f5b97a87910be31d60e931c08ca4d5ef1": {
          id: 1,
          outcomeId: "an outcomeId",
          details: {
            test: "example"
          }
        },
        "0x04be50f6303babc4e5400a6ebfaa77a8a76f620dd9f6394466e552842f585801": {
          id: 2,
          outcomeId: "a different outcome",
          details: {
            example: "test2"
          }
        }
      };
      const expectedOutput = {
        "0x0131d98e878803e113e2accc457ad57f5b97a87910be31d60e931c08ca4d5ef1": {
          id: 1,
          outcomeId: "an outcomeId",
          details: {
            test: "example"
          }
        },
        "0x04be50f6303babc4e5400a6ebfaa77a8a76f620dd9f6394466e552842f585801": {
          id: 2,
          outcomeId: "someoutcome",
          details: {
            example: "test"
          }
        }
      };
      const action = {
        type: "UPDATE_MARKETS_DATA",
        data: { marketsData }
      };
      const action2 = {
        type: "UPDATE_MARKETS_DATA",
        data: { marketsData: marketsData2 }
      };
      expect(reducer(curMarketsData1, action)).toEqual(expectedOutput);
      expect(reducer(curMarketsData2, action)).toEqual(expectedOutput);
      expect(reducer(undefined, action2)).toEqual(expectedOutput);
    });
  });
});
