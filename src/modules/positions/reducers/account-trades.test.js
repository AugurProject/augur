import accountTrades from "modules/positions/reducers/account-trades";

import {
  UPDATE_ACCOUNT_TRADES_DATA,
  CLEAR_ACCOUNT_TRADES
} from "modules/positions/actions/update-account-trades-data";
import { CLEAR_LOGIN_ACCOUNT } from "modules/auth/actions/update-login-account";

describe("modules/positions/reducers/account-trades.js", () => {
  test(`should return the default state`, () => {
    const actual = accountTrades(undefined, { type: null });
    const expected = {};
    expect(actual).toEqual(expected);
  });

  test(`should return the default state for type: CLEAR_LOGIN_ACCOUNT`, () => {
    const actual = accountTrades(
      { test: "test" },
      { type: CLEAR_LOGIN_ACCOUNT }
    );
    const expected = {};
    expect(actual).toEqual(expected);
  });

  test(`should return the default state for type: CLEAR_ACCOUNT_TRADES`, () => {
    const actual = accountTrades(
      { test: "test" },
      { type: CLEAR_ACCOUNT_TRADES }
    );
    const expected = {};
    expect(actual).toEqual(expected);
  });

  test(`should update the state from the default state correctly`, () => {
    const actual = accountTrades(undefined, {
      type: UPDATE_ACCOUNT_TRADES_DATA,
      data: {
        tradeData: {
          1: [
            {
              transactionHash: "0xTRANSACTIONHASH1"
            }
          ]
        },
        market: "0xMARKETID1"
      }
    });
    const expected = {
      "0xMARKETID1": {
        1: [
          {
            transactionHash: "0xTRANSACTIONHASH1"
          }
        ]
      }
    };
    expect(actual).toEqual(expected);
  });

  test(`should update the state correctly from state WITH matching trades`, () => {
    const actual = accountTrades(
      {
        "0xMARKETID2": {
          2: [
            {
              transactionHash: "0x2TRANSACTIONHASH2"
            },
            {
              transactionHash: "0x2TRANSACTIONHASH1"
            }
          ]
        },
        "0xMARKETID1": {
          1: [
            {
              transactionHash: "0xTRANSACTIONHASH2"
            },
            {
              transactionHash: "0xTRANSACTIONHASH1"
            }
          ]
        }
      },
      {
        type: UPDATE_ACCOUNT_TRADES_DATA,
        data: {
          tradeData: {
            1: [
              {
                transactionHash: "0xTRANSACTIONHASH1"
              }
            ]
          },
          market: "0xMARKETID1"
        }
      }
    );
    const expected = {
      "0xMARKETID2": {
        2: [
          {
            transactionHash: "0x2TRANSACTIONHASH2"
          },
          {
            transactionHash: "0x2TRANSACTIONHASH1"
          }
        ]
      },
      "0xMARKETID1": {
        1: [
          {
            transactionHash: "0xTRANSACTIONHASH2"
          },
          {
            transactionHash: "0xTRANSACTIONHASH1"
          }
        ]
      }
    };
    expect(actual).toEqual(expected);
  });

  test(`should update the state correctly from state WITHOUT matching trades`, () => {
    const actual = accountTrades(
      {
        "0xMARKETID2": {
          2: [
            {
              transactionHash: "0x2TRANSACTIONHASH2"
            },
            {
              transactionHash: "0x2TRANSACTIONHASH1"
            }
          ]
        },
        "0xMARKETID1": {
          1: [
            {
              transactionHash: "0xTRANSACTIONHASH2"
            },
            {
              transactionHash: "0xTRANSACTIONHASH1"
            }
          ]
        }
      },
      {
        type: UPDATE_ACCOUNT_TRADES_DATA,
        data: {
          tradeData: {
            1: [
              {
                transactionHash: "0xTRANSACTIONHASH3"
              }
            ]
          },
          market: "0xMARKETID1"
        }
      }
    );
    const expected = {
      "0xMARKETID2": {
        2: [
          {
            transactionHash: "0x2TRANSACTIONHASH2"
          },
          {
            transactionHash: "0x2TRANSACTIONHASH1"
          }
        ]
      },
      "0xMARKETID1": {
        1: [
          {
            transactionHash: "0xTRANSACTIONHASH2"
          },
          {
            transactionHash: "0xTRANSACTIONHASH1"
          },
          {
            transactionHash: "0xTRANSACTIONHASH3"
          }
        ]
      }
    };
    expect(actual).toEqual(expected);
  });
});
