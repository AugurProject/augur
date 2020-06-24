import { updateSdk } from 'modules/auth/actions/update-sdk';
import { toChecksumAddress } from 'ethereumjs-util';
import { ThunkDispatch } from 'redux-thunk';
import { PersonalSigningWeb3Provider } from 'utils/personal-signing-web3-provider';
import { Action } from 'redux';
import { updateModal } from 'modules/modal/actions/update-modal';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';
import { getNetwork } from 'utils/get-network-name';
import { windowRef } from 'utils/window-ref';
import {
  ACCOUNT_TYPES,
  MODAL_ERROR,
  SIGNIN_SIGN_WALLET,
} from 'modules/common/constants';
import WalletConnectProvider from "@walletconnect/web3-provider";

export const loginWithWalletConnect = () => async ( 
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  try {
    const Web3 = require('web3');
    const useGSN = getState().env['gsn']?.enabled;
    const provider = new WalletConnectProvider({
      infuraId: "27e484dcd9e3efcfd25a83a78777cdf1" 
    });
    windowRef.walletConnect = provider;
    await provider.enable();
    const web3 = new Web3(provider);
    const networkId = getState().env['networkId'];
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const address = toChecksumAddress(account);
    const signingProvider = new PersonalSigningWeb3Provider(provider);
    debugger
    const accountObject = {
      address,
      mixedCaseAddress: address,
      meta: {
        address,
        signer: provider,
        email: null,
        profileImage: null,
        openWallet: null,
        accountType: ACCOUNT_TYPES.WALLETCONNECT,
        isWeb3: true,
      },
    };
    dispatch(updateSdk(accountObject, networkId, useGSN));
  } catch {
    dispatch(
      updateModal({
        type: MODAL_ERROR,
        title: 'WalletConnect Error',
        error:
          'An error occured logging into WalletConnect. Please check your network and try again.',
      })
    );

  }

};
