import { useUnlockedAccount } from 'modules/auth/actions/use-unlocked-account';

// If there is an available unlocked account, set as the user's sending address.
export const setLoginAccount = autoLogin => (dispatch, getState) => {

  // If autoLogin=true, use an unlocked local Ethereum node (if present)
  if (autoLogin) {
    dispatch(useUnlockedAccount(getState().coinbase));
  }
};
