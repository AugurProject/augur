import {
  MARKET_INFO_LOADED,
  MARKET_INFO_LOADING,
  MARKET_FULLY_LOADED,
  MARKET_FULLY_LOADING
} from "modules/markets/constants/market-loading-states";
import { isLoading } from "modules/markets/selectors/is-loading";

describe(`modules/markets/selectors/is-loading.js`, () => {
  const t1 = {
    description: `Empty is false`,
    assertions: () => {
      const value = {};
      const actual = isLoading(value);

      expect(actual).toBe(false);
    }
  };

  const t2 = {
    description: `Non loading is false`,
    assertions: () => {
      const value = {
        marketId: MARKET_INFO_LOADED,
        marketId2: MARKET_FULLY_LOADED
      };

      const actual = isLoading(value);

      expect(actual).toBe(false);
    }
  };

  const t3 = {
    description: `Some loading is true`,
    assertions: () => {
      const value = {
        marketId: MARKET_INFO_LOADED,
        marketId2: MARKET_FULLY_LOADED,
        marketId3: MARKET_INFO_LOADING
      };

      const actual = isLoading(value);

      expect(actual).toBe(true);
    }
  };

  const t4 = {
    description: `All loading is true`,
    assertions: () => {
      const value = {
        marketId2: MARKET_FULLY_LOADING,
        marketId3: MARKET_INFO_LOADING
      };

      const actual = isLoading(value);

      expect(actual).toBe(true);
    }
  };

  describe.each([[t1, t2, t3, t4]])("Is loading test", t => {
    test(t.description, () => {
      t.assertions();
    });
  });
});
