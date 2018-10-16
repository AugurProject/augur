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
  const test = t => it(t.description, () => t.assertions());

  const DEFAULT_STATE = {
    [IS_LOGGED]: false,
    [LEDGER_STATUS]: NOT_CONNECTED,
    [EDGE_CONTEXT]: null,
    [EDGE_LOADING]: false
  };

  test({
    description: "It should return the default state on unrecognized action",
    assertions: () => {
      assert.deepEqual(
        reducer(DEFAULT_STATE, { type: "unrecognized" }),
        DEFAULT_STATE
      );
    }
  });
  test({
    description: "It should return the default state on reset-state action",
    assertions: () => {
      assert.deepEqual(
        reducer(
          {
            ...DEFAULT_STATE,
            [LEDGER_STATUS]: ATTEMPTING_CONNECTION
          },
          resetState()
        ),
        DEFAULT_STATE
      );
    }
  });
  test({
    description:
      "It should return the default state on clear login account action",
    assertions: () => {
      assert.deepEqual(
        reducer(
          {
            ...DEFAULT_STATE,
            [LEDGER_STATUS]: ATTEMPTING_CONNECTION
          },
          clearLoginAccount()
        ),
        DEFAULT_STATE
      );
    }
  });
  test({
    description:
      "It should return the update the ledger status on UPDATE_LEDGER_STATUS action",
    assertions: () => {
      assert.deepEqual(
        reducer(
          DEFAULT_STATE,
          updateAuthStatus(LEDGER_STATUS, ATTEMPTING_CONNECTION)
        ),
        {
          ...DEFAULT_STATE,
          [LEDGER_STATUS]: ATTEMPTING_CONNECTION
        }
      );
    }
  });
});
