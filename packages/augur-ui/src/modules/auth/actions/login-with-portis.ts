import { updateSdk } from 'modules/auth/actions/update-sdk';
import { toChecksumAddress } from 'ethereumjs-util';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { PersonalSigningWeb3Provider } from 'utils/personal-signing-web3-provider';
import Web3 from 'web3';
import {
  ACCOUNT_TYPES,
  PORTIS_API_KEY,
  MODAL_ERROR,
} from 'modules/common/constants';
import { windowRef } from 'utils/window-ref';
import { updateModal } from 'modules/modal/actions/update-modal';
import { AppState } from 'store';
import { getNetwork } from 'utils/get-network-name';

 export const loginWithPortis = (forceRegisterPage = false) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState,
) => {
  const useGnosis = getState().env['gnosis']?.enabled;
  const networkId: string = getState().env['networkId'];
  const portisNetwork = getNetwork(networkId);
  const localPortisNetwork = {
    nodeUrl: 'http://localhost:8545',
    chainId: networkId,
  };

  if (portisNetwork) {
    try {
      // Only inject Portis if we are using Portis
      const Portis = require('@portis/web3');
      const portis = new Portis(PORTIS_API_KEY, portisNetwork === 'localhost' ? localPortisNetwork : portisNetwork, {
        scope: ['email'],
        registerPageByDefault: forceRegisterPage,
      });

      const web3 = new Web3(portis.provider);
      const provider = new PersonalSigningWeb3Provider(portis.provider);

      windowRef.portis = portis;

      const initPortis = (portis, account, email = null) => {
        const address = toChecksumAddress(account);
        const accountObject = {
          address: address,
          mixedCaseAddress: address,
          meta: {
            address: address,
            email,
            profileImage: null,
            signer: provider.getSigner(),
            openWallet: () => portis.showPortis(),
            accountType: ACCOUNT_TYPES.PORTIS,
            isWeb3: true,
          },
        };

        dispatch(updateSdk(accountObject, undefined, useGnosis));
      };

      portis.onLogin((account, email) => {
          initPortis(portis, account, email);
      });

      portis.onError(error => {
        document.querySelector('.por_portis-container').remove();
        dispatch(
          updateModal({
            type: MODAL_ERROR,
            error: JSON.stringify(error && error.message ? error.message : 'Sorry, something went wrong.'),
          })
        );
      });

      await web3.eth.getAccounts();
    } catch (error) {
      document.querySelector('.por_portis-container').remove();
      throw error;
    }
  } else {
    throw Error('Network currently not supported with Portis');
  }
};
