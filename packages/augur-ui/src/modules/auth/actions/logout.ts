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
      await windowRef.torus.cleanUp();
    }


    if (windowRef.portis) {
      await windowRef.portis.logout();
      document.querySelector('.por_portis-container').remove();
    }



    if (windowRef.fm) {
      await windowRef.fm.user.logout();
    }
  };
}
