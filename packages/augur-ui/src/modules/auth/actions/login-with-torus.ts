import { updateSdk } from 'modules/auth/actions/update-sdk';
import { toChecksumAddress } from 'ethereumjs-util';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { PersonalSigningWeb3Provider } from 'utils/personal-signing-web3-provider';
import { ACCOUNT_TYPES } from 'modules/common/constants';
import { windowRef } from 'utils/window-ref';
import { LoginAccount } from 'modules/types';
import { AppState } from 'appStore';
import { getNetwork } from 'utils/get-network-name';

export const loginWithTorus = () => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState,
) => {
  const networkId: string = getState().env['networkId'];
  const torusNetwork = getNetwork(networkId);
  let accountObject: Partial<LoginAccount> = {};

  // Use import instead of import for wallet SDK packages
  // to conditionally load web3 into the DOM
  const { default: Torus } = await import( /*webpackChunkName: 'torus'*/ '@toruslabs/torus-embed');
  const torus = new Torus({});

  if (torusNetwork) {
    if (torusNetwork === 'localhost') {
      throw new Error('localhost currently not working for torus')
    }

    try {
      await torus.init({
        network: { host: torusNetwork },
        showTorusButton: false,
      });

      const accounts = await torus.login({verifier: 'google'});
      const provider = new PersonalSigningWeb3Provider(torus.provider);
      const isWeb3 = true;
      windowRef.torus = torus;

      const account = toChecksumAddress(accounts[0]);
      accountObject = {
        address: account,
        mixedCaseAddress: account,
        meta: {
          address: account,
          email: null,
          profileImage: null,
          openWallet: (goto = 'home') => torus.showWallet(goto),
          provider,
          signer: provider.getSigner(),
          accountType: ACCOUNT_TYPES.TORUS,
          isWeb3,
        },
      };

      // Torus just hides the button but its still clickable.
      // Setting styles to display none as to not trigger an error during Torus cleanup
      if (document.querySelector('#torusWidget')) {
        document
          .querySelector('#torusWidget')
          .setAttribute('style', 'display:none');
      }

    } catch (error) {
      if (document.querySelector('#torusWidget')) {
        document.querySelector('#torusWidget').remove();
      }
      // On error, we need to cleanup the second instance of the torus iframes
      const torusIframe = document.querySelectorAll('#torusIframe');
      if (torusIframe.length > 0 && torusIframe[1]) {
        torusIframe[1].remove();
      }

      throw error;
    }

    try {
      const userInfo = await torus.getUserInfo(
        'Augur would like to use this information to improve your user experience.'
      );
      accountObject.meta.email = userInfo.email;
      accountObject.meta.profileImage = userInfo.profileImage;
      dispatch(updateSdk(accountObject, undefined));
    } catch (error) {
      // User denied request
      dispatch(updateSdk(accountObject, undefined));
    }
  } else {
    throw Error('Network currently not supported with Torus');
  }
};
