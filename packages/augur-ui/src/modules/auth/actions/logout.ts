import { clearLoginAccount } from 'modules/account/actions/login-account';
import { clearUserTx } from 'modules/contracts/actions/contractCalls';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { windowRef } from 'utils/window-ref';

export function logout() {
  return async (dispatch: ThunkDispatch<void, any, Action>) => {
    const localStorageRef =
      typeof window !== 'undefined' && window.localStorage;
    clearUserTx();
    if (localStorageRef && localStorageRef.removeItem) {
      localStorageRef.removeItem('airbitz.current_user');
      localStorageRef.removeItem('airbitz.users');
      localStorageRef.removeItem('loggedInAccount');
      localStorageRef.removeItem('loggedInAccountType');
    }
    dispatch(clearLoginAccount());

    // Clean up web3 wallets
    if (windowRef.torus) {
      windowRef.torus.cleanUp();
      windowRef.torus = undefined;
    }

    if (windowRef.portis) {
      windowRef.portis.logout();
      windowRef.portis.fm = undefined;
    }

    if (windowRef.fm) {
      windowRef.fm.user.logout();
      windowRef.fm = undefined;
    }
  };
}
