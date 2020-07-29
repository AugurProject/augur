import { updateSdk } from 'modules/auth/actions/update-sdk';
import { toChecksumAddress } from 'ethereumjs-util';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { PersonalSigningWeb3Provider } from 'utils/personal-signing-web3-provider';
import { ACCOUNT_TYPES, FORTMATIC_API_KEY, FORTMATIC_API_TEST_KEY, NETWORK_IDS, NETWORK_NAMES } from 'modules/common/constants';
import { windowRef } from 'utils/window-ref';
import { AppState } from 'appStore';
import { getNetwork } from 'utils/get-network-name';

export const loginWithFortmatic = (withEmail = false) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState,
) => {
  const networkId: string = getState().env['networkId'];
  const supportedNetwork = getNetwork(networkId);

  if (supportedNetwork) {
    try {
      // Split point +_ dynamic load for fortmatic
      const {default: Fortmatic} = await import(/* webpackChunkName: "fortmatic" */ 'fortmatic');
      const fm = new Fortmatic(networkId === NETWORK_IDS.Kovan ? FORTMATIC_API_TEST_KEY : FORTMATIC_API_KEY, supportedNetwork);
      const provider = new PersonalSigningWeb3Provider(fm.getProvider());

      windowRef.fm = fm;

      if (withEmail) {
        await fm.configure({ primaryLoginOption: 'email' });
      } else {
        await fm.configure({ primaryLoginOption: 'phone' });
      }

      const accounts = await fm.user.login();

      const userInfo = await fm.user.getUser();
      const account = toChecksumAddress(accounts[0]);

      const accountObject = {
        address: account,
        mixedCaseAddress: account,
        meta: {
          address: account,
          provider,
          signer: provider.getSigner(),
          openWallet: () => fm.user.settings(),
          accountType: ACCOUNT_TYPES.FORTMATIC,
          email: userInfo.email ? userInfo.email : null,
          profileImage: null,
          isWeb3: true,
        },
      };

      dispatch(updateSdk(accountObject, undefined));
    }
    catch (error) {
      throw error;
    }
  } else {
    throw Error(`Network ${networkId} not supported.`)
  }
};
