import { updateSdk } from 'modules/auth/actions/update-sdk';
import { toChecksumAddress } from 'ethereumjs-util';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { updateModal } from 'modules/modal/actions/update-modal';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';
import { getNetwork } from 'utils/get-network-name';
import {
  MODAL_ERROR,
  SIGNIN_SIGN_WALLET,
} from 'modules/common/constants';
import WalletConnectProvider from "@walletconnect/web3-provider";

export const loginWithWalletConnect = () => async ( 
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  debugger
  try {
    const Web3 = require('web3');
    const useGSN = getState().env['gsn']?.enabled;
    const provider = new WalletConnectProvider({
      infuraId: "" 
    });
    await provider.enable();
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const address = toChecksumAddress(account);
    const accountObject = {
      address,
      mixedCaseAddress: address,
      meta: {
        address,
        signer: provider.getSigner(),
        email: null,
        profileImage: null,
        openWallet: null,
        accountType: ACCOUNT_TYPES.WEB3WALLET,
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
