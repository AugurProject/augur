import { updateSdk } from 'modules/auth/actions/update-sdk';
import { toChecksumAddress } from 'ethereumjs-util';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { PersonalSigningWeb3Provider } from 'utils/personal-signing-web3-provider';
import Fortmatic from 'fortmatic';
import Web3 from 'web3';
import { ACCOUNT_TYPES, FORTMATIC_API_KEY, FORTMATIC_API_TEST_KEY, NETWORK_IDS, NETWORK_NAMES } from 'modules/common/constants';
import { windowRef } from 'utils/window-ref';
import { AppState } from 'store';
import { getNetwork } from 'utils/get-network-name';

export const loginWithFortmatic = () => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState,
) => {
  const useGnosis = getState().env['gnosis']?.enabled;
  const networkId: string = getState().env['networkId'];
  const supportedNetwork = getNetwork(networkId);

  if (supportedNetwork) {
    try {
      const fm = new Fortmatic(networkId === NETWORK_IDS.Kovan ? FORTMATIC_API_TEST_KEY : FORTMATIC_API_KEY, supportedNetwork);
      const web3 = new Web3(fm.getProvider());
      const provider = new PersonalSigningWeb3Provider(fm.getProvider());

      windowRef.fm = fm;

      const accounts = await web3.currentProvider.enable();
      const account = toChecksumAddress(accounts[0]);

      const accountObject = {
        address: account,
        mixedCaseAddress: account,
        meta: {
          address: account,
          signer: provider.getSigner(),
          openWallet: () => fm.user.settings(),
          accountType: ACCOUNT_TYPES.FORTMATIC,
          email: null,
          profileImage: null,
          isWeb3: true,
        },
      };

      dispatch(updateSdk(accountObject, undefined, useGnosis));
    }
    catch (error) {
      throw error;
    }
  } else {
    throw Error(`Network ${networkId} not supported.`)
  }
};
