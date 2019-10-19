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
} from 'modules/common/constants';
import { IS_LOGGED, updateAuthStatus } from 'modules/auth/actions/auth-status';
import { augurSdk } from 'services/augursdk';
import { updateModal } from 'modules/modal/actions/update-modal';
import { closeModal } from 'modules/modal/actions/close-modal';

// MetaMask, dapper, Mobile wallets
export const loginWithInjectedWeb3 = () => (dispatch: ThunkDispatch<void, any, Action>) => {
  const failure = (error) => {
    dispatch(closeModal());
    throw Error(error);
  };
  const success = async (account: string, refresh: boolean) => {
    if (!account) return failure();
    if (refresh) dispatch(updateAuthStatus(IS_LOGGED, false));

    dispatch(login(account));
    const web3 = windowRef.web3;
    if (web3.currentProvider.publicConfigStore && web3.currentProvider.publicConfigStore.on) {
      web3.currentProvider.publicConfigStore.on('update', config => {
        if (augurSdk.networkId !== config.networkVersion) {
          console.log('web3 updated, network changed to', config.networkVersion);
          dispatch(
            updateModal({
              type: MODAL_NETWORK_MISMATCH,
              expectedNetwork: NETWORK_NAMES[Number(augurSdk.networkId)]
            })
          );
        }
      });
    }
  };

  if (windowRef.ethereum && windowRef.ethereum.on) {
    windowRef.ethereum.on('accountsChanged', function(accounts) {
      console.log('refershing account to', accounts[0]);
      success(accounts[0], true);
    });
  }

  return windowRef.ethereum
    .enable()
    .then((resolve: string[]) => success(resolve[0], false), failure);

};

const login = (account: string) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  const provider = new Web3Provider(window.web3.currentProvider);
  const networkId = window.web3.currentProvider.networkVersion;

  const accountObject = {
    address: account,
    mixedCaseAddress: toChecksumAddress(account),
    meta: {
      address: account,
      signer: provider.getSigner(),
      email: null,
      profileImage: null,
      openWallet: null,
      accountType: ACCOUNT_TYPES.WEB3WALLET,
      isWeb3: true,
    },
  };
  dispatch(updateSdk(accountObject, networkId));
};
