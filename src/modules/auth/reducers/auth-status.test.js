import {
  NOT_CONNECTED,
  ATTEMPTING_CONNECTION
} from "modules/auth/constants/ledger-status";
import {
  IS_LOGGED,
  LEDGER_STATUS,
  EDGE_LOADING,
  EDGE_CONTEXT,
  updateAuthStatus
} from "modules/auth/actions/update-auth-status";
import { resetState } from "modules/app/actions/reset-state";
import { clearLoginAccount } from "modules/auth/actions/update-login-account";
import reducer from "modules/auth/reducers/auth-status";

describe(`modules/auth/reducers/auth-status.js`, () => {
  const DEFAULT_STATE = {
    [IS_LOGGED]: false,
    [LEDGER_STATUS]: NOT_CONNECTED,
    [EDGE_CONTEXT]: null,
    [EDGE_LOADING]: false
  };

  test("It should return the default state on unrecognized action", () => {
    expect(reducer(DEFAULT_STATE, { type: "unrecognized" })).toEqual(
      DEFAULT_STATE
    );
  });
  test("It should return the default state on reset-state action", () => {
    expect(
      reducer(
        {
          ...DEFAULT_STATE,
          [LEDGER_STATUS]: ATTEMPTING_CONNECTION
        },
        resetState()
      )
    ).toEqual(DEFAULT_STATE);
  });
  test("It should return the default state on clear login account action", () => {
    expect(
      reducer(
        {
          ...DEFAULT_STATE,
          [LEDGER_STATUS]: ATTEMPTING_CONNECTION
        },
        clearLoginAccount()
      )
    ).toEqual(DEFAULT_STATE);
  });
  test("It should return the update the ledger status on UPDATE_LEDGER_STATUS action", () => {
    expect(
      reducer(
        DEFAULT_STATE,
        updateAuthStatus(LEDGER_STATUS, ATTEMPTING_CONNECTION)
      )
    ).toEqual({
      ...DEFAULT_STATE,
      [LEDGER_STATUS]: ATTEMPTING_CONNECTION
    });
  });
});
