import {updateLoginAccount} from 'modules/account/actions/login-account';
import {AppState} from 'appStore';
import {ThunkDispatch} from 'redux-thunk';
import {Action} from 'redux';
import {LoginAccountSettings} from "modules/types";

export const updateLoginAccountSettings = (
  settings: LoginAccountSettings = {},
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { loginAccount } = getState();
  try {
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
