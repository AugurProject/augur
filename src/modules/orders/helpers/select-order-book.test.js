import {
  selectAggregateOrderBook,
  selectTopBid,
  selectTopAsk
} from "modules/orders/helpers/select-order-book";

import store from "src/store";

jest.mock("src/store");

describe("modules/orders/helpers/select-order-book.js", () => {
  beforeEach(() => {
    store.getState = jest.fn(() => ({
      loginAccount: {
        address: "0xBob"
      }
    }));
  });

  describe("selectAggregateOrderBook", () => {
    test(`should return the expected object when 'marketOrderBook' is null`, () => {
      const actual = selectAggregateOrderBook("1", null, {});
      const expected = {
        bids: [],
        asks: []
      };
      expect(actual).toEqual(expected);
    });

    test(`should return the expected object when 'marketOrderBook' is null`, () => {
      const actual = selectAggregateOrderBook("1", { buy: [], sell: [] }, {});
      const expected = {
        bids: [],
        asks: []
      };
      expect(actual).toEqual(expected);
    });
  });

  describe("selectTopBid", () => {
    const marketOrderBook = {
      bids: [
        {
          isOfCurrentUser: true,
          price: "0.4"
        },
        {
          price: "0.3"
        },
        {
          price: "0.2"
        },
        {
          price: "0.1"
        }
      ]
    };

    test(`should return null when not bids exist and including current user`, () => {
      const actual = selectTopBid({ bids: [] });
      const expected = null;
      expect(actual).toEqual(expected);
    });

    test(`should return null when not bids exist and excluding current user`, () => {
      const actual = selectTopBid({ bids: [] }, true);
      const expected = null;
      expect(actual).toEqual(expected);
    });

    test(`should return the topBid, including current user`, () => {
      const actual = selectTopBid(marketOrderBook);
      const expected = {
        isOfCurrentUser: true,
        price: "0.4"
      };
      expect(actual).toEqual(expected);
    });

    test(`should return the topBid, excluding current user`, () => {
      const actual = selectTopBid(marketOrderBook, true);
      const expected = {
        price: "0.3"
      };
      expect(actual).toEqual(expected);
    });
  });

  describe("selectTopAsk", () => {
    const marketOrderBook = {
      asks: [
        {
          isOfCurrentUser: true,
          price: "0.5"
        },
        {
          price: "0.6"
        },
        {
          price: "0.7"
        },
        {
          price: "0.8"
        }
      ]
    };

    test(`should return null when not asks exist and including current user`, () => {
      const actual = selectTopAsk({ asks: [] });
      const expected = null;
      expect(actual).toEqual(expected);
    });

    test(`should return null when not asks exist and excluding current user`, () => {
      const actual = selectTopAsk({ asks: [] }, true);
      const expected = null;
      expect(actual).toEqual(expected);
    });

    test(`should return the topAsk, including current user`, () => {
      const actual = selectTopAsk(marketOrderBook);
      const expected = {
        isOfCurrentUser: true,
        price: "0.5"
      };
      expect(actual).toEqual(expected);
    });

    test(`should return the topAsk, excluding current user`, () => {
      const actual = selectTopAsk(marketOrderBook, true);
      const expected = {
        price: "0.6"
      };
      expect(actual).toEqual(expected);
    });
  });
});
