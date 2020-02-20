import { windowRef } from 'utils/window-ref';
import { updateSdk } from 'modules/auth/actions/update-sdk';
import { toChecksumAddress } from 'ethereumjs-util';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { Web3Provider } from 'ethers/providers';
import {
  ACCOUNT_TYPES,
  MODAL_NETWORK_MISMATCH,
  NETWORK_NAMES,
  SIGNIN_LOADING_TEXT,
  SIGNIN_SIGN_WALLET,
  MODAL_LOADING,
} from 'modules/common/constants';
import { IS_LOGGED, updateAuthStatus } from 'modules/auth/actions/auth-status';
import { augurSdk } from 'services/augursdk';
import { updateModal } from 'modules/modal/actions/update-modal';
import { closeModal } from 'modules/modal/actions/close-modal';
import { logout } from 'modules/auth/actions/logout';
import { AppState } from 'appStore';

// MetaMask, dapper, Mobile wallets
export const loginWithInjectedWeb3 = () => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState,
) => {
  const failure = error => {
    dispatch(closeModal());
    throw error;
  };
  const success = async (account: string, refresh: boolean) => {
    if (!account) return failure('No Account');
    if (refresh) dispatch(updateAuthStatus(IS_LOGGED, false));

    dispatch(login(account));

    const web3 = windowRef.web3;
    if (
      web3.currentProvider.publicConfigStore &&
      web3.currentProvider.publicConfigStore.on
    ) {
      web3.currentProvider.publicConfigStore.on('update', config => {
        if (augurSdk.networkId !== config.networkVersion) {
          console.log(
            'web3 updated, network changed to',
            config.networkVersion
          );
          dispatch(
            updateModal({
              type: MODAL_NETWORK_MISMATCH,
              expectedNetwork: NETWORK_NAMES[Number(augurSdk.networkId)],
            })
          );
        }
      });
    }

    // Listen for MetaMask account switch
    if (windowRef.ethereum && windowRef.ethereum.on) {
      windowRef.ethereum.on('accountsChanged', async accounts => {
        const loginAccount = getState().loginAccount;
        if (loginAccount.address) {
          const initWeb3 = async account => {
            const message = account ? SIGNIN_LOADING_TEXT : SIGNIN_SIGN_WALLET;
            const showMetaMaskHelper = account ? false : true;
            dispatch(
              updateModal({
                type: MODAL_LOADING,
                message,
                showMetaMaskHelper,
                callback: () => dispatch(closeModal()),
              })
            );

            await dispatch(loginWithInjectedWeb3());
          };

          console.log('refreshing account to', accounts[0]);
          await dispatch(logout());

          initWeb3(accounts[0]);
        }
      });
    }
  };

  return windowRef.ethereum
    .enable()
    .then((resolve: string[]) => success(resolve[0], false), failure);
};

const login = (account: string) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState,
) => {
  const useGnosis = getState().env['gnosis']?.enabled;
  const provider = new Web3Provider(windowRef.web3.currentProvider);
  const networkId = windowRef.web3.currentProvider.networkVersion;
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
  dispatch(updateSdk(accountObject, networkId, useGnosis));
};
