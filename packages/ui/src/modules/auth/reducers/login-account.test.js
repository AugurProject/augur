import {
  UPDATE_LOGIN_ACCOUNT,
  CLEAR_LOGIN_ACCOUNT
} from "modules/auth/actions/update-login-account";
import reducer from "modules/auth/reducers/login-account";
import testState from "test/testState";

describe(`modules/auth/reducers/login-account.js`, () => {
  let action;
  const thisTestState = Object.assign({}, testState);

  test(`should updated the logged in account`, () => {
    action = {
      type: UPDATE_LOGIN_ACCOUNT,
      data: {
        loginAccount: {
          ether: 5,
          rep: 15,
          realEther: 25
        }
      }
    };

    const expectedOutput = Object.assign({}, thisTestState.loginAccount, {
      ether: 5,
      rep: 15,
      realEther: 25
    });

    expect(reducer(thisTestState.loginAccount, action)).toEqual(expectedOutput);
  });

  test(`should clear the logged in account`, () => {
    action = {
      type: CLEAR_LOGIN_ACCOUNT
    };
    const expectedOutput = {};
    expect(reducer(thisTestState.loginAccount, action)).toEqual(expectedOutput);
  });
});
