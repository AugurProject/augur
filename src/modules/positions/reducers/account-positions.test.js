import accountPositions from "modules/positions/reducers/account-positions";

import { UPDATE_ACCOUNT_POSITIONS_DATA } from "modules/positions/actions/update-account-trades-data";
import { CLEAR_LOGIN_ACCOUNT } from "modules/auth/actions/update-login-account";

describe("modules/positions/reducers/account-positions.js", () => {
  test(`should return the default state`, () => {
    const actual = accountPositions(undefined, { type: null });
    const expected = {};
    expect(actual).toEqual(expected);
  });

  test(`should return the default state for type: CLEAR_LOGIN_ACCOUNT`, () => {
    const actual = accountPositions(
      { test: "test" },
      { type: CLEAR_LOGIN_ACCOUNT }
    );
    const expected = {};
    expect(actual).toEqual(expected);
  });

  test(`should update the state from the default state correctly`, () => {
    const actual = accountPositions(undefined, {
      type: UPDATE_ACCOUNT_POSITIONS_DATA,
      data: {
        positionData: {
          "0xMARKETID1": {
            test: "test"
          }
        },
        marketId: "0xMARKETID1"
      }
    });
    const expected = {
      "0xMARKETID1": {
        test: "test"
      }
    };
    expect(actual).toEqual(expected);
  });

  test(`should update the state from existing state correctly`, () => {
    const actual = accountPositions(
      {
        "0xMARKETID2": {
          testing: "testing"
        },
        "0xMARKETID1": {
          old: "state"
        }
      },
      {
        type: UPDATE_ACCOUNT_POSITIONS_DATA,
        data: {
          positionData: {
            "0xMARKETID1": {
              test: "test"
            }
          },
          marketId: "0xMARKETID1"
        }
      }
    );
    const expected = {
      "0xMARKETID2": {
        testing: "testing"
      },
      "0xMARKETID1": {
        test: "test"
      }
    };
    expect(actual).toEqual(expected);
  });
});
