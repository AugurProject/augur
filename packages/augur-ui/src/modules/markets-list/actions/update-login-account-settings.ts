import {updateLoginAccount} from 'modules/account/actions/login-account';
import {AppState} from 'store';
import {ThunkDispatch} from 'redux-thunk';
import {Action} from 'redux';
import {LoginAccountSettings} from "modules/types";

export const updateLoginAccountSettings = (
  settings: LoginAccountSettings = {},
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { loginAccount } = getState();
  try {
    console.log('settings', settings);
    console.log('loginAccount', loginAccount);
    dispatch(
      updateLoginAccount({
        settings: {
          ...loginAccount.settings,
          ...settings
        },
      })
    );
  } catch (e) {
    console.error('Could not update login account settings', e);
  }
};
