import {LoginAccountSettings} from "modules/types";
import { AppStatus } from 'modules/app/store/app-status';

export const updateLoginAccountSettings = (
  settings: LoginAccountSettings = {},
) => {
  const { loginAccount } = AppStatus.get();
  try {
    console.log('updateLoginAccountSettings was called', settings);
    AppStatus.actions.updateLoginAccount({
      settings: {
        ...loginAccount.settings,
        ...settings,
      }
    });
  } catch (e) {
    console.error('Could not update login account settings', e);
  }
};
