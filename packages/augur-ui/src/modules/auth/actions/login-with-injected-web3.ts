import { windowRef } from 'utils/window-ref';
import { updateSdk } from 'modules/auth/actions/update-sdk';
import { toChecksumAddress } from 'ethereumjs-util';
import { Web3Provider } from '@ethersproject/providers';
import {
  ACCOUNT_TYPES,
  MODAL_NETWORK_MISMATCH,
  NETWORK_NAMES,
  SIGNIN_LOADING_TEXT,
  SIGNIN_SIGN_WALLET,
  MODAL_LOADING,
} from 'modules/common/constants';
import { augurSdk } from 'services/augursdk';
import { logout } from 'modules/auth/actions/logout';
import { AppStatus } from 'modules/app/store/app-status';

// MetaMask, dapper, Mobile wallets
export const loginWithInjectedWeb3 = () => {
  (async () => {
    const { setModal, closeModal, setIsLogged } = AppStatus.actions;
    const failure = error => {
      closeModal();
      throw error;
    };
    const success = async (account: string, refresh: boolean) => {
      if (!account) return failure('No Account');

      if (refresh) setIsLogged(false);

      login(account);

      const web3 = windowRef.web3;

      if (web3 && web3.currentProvider?.publicConfigStore?.on) {
        web3.currentProvider.publicConfigStore.on('update', config => {
          if (augurSdk.networkId !== config.networkVersion) {
            console.log(
              'web3 updated, network changed to',
              config.networkVersion
            );
            setModal({
              type: MODAL_NETWORK_MISMATCH,
              expectedNetwork: NETWORK_NAMES[Number(augurSdk.networkId)],
            });
          }
        });
      }

      // Listen for MetaMask account switch
      if (windowRef.ethereum?.on) {
        windowRef.ethereum.on('accountsChanged', async accounts => {
          const { loginAccount } = AppStatus.get();
          if (loginAccount.address) {
            const initWeb3 = async account => {
              const message = account
                ? SIGNIN_LOADING_TEXT
                : SIGNIN_SIGN_WALLET;
              const showMetaMaskHelper = account ? false : true;
              setModal({
                type: MODAL_LOADING,
                message,
                showMetaMaskHelper,
                callback: () => closeModal(),
              });

              await loginWithInjectedWeb3();
            };

            console.log('refreshing account to', accounts[0]);
            await logout();

            initWeb3(accounts[0]);
          }
        });
      }
    };

    try {
      // This is equivalent to ethereum.enable()
      // Handle connecting, per EIP 1102
      const request = await windowRef.ethereum.send('eth_requestAccounts');
      const address = request.result[0];
      success(address, false);
    } catch (err) {
      return windowRef.ethereum
        .enable()
        .then((resolve: string[]) => success(resolve[0], false), failure);
    }
  })();
};

const login = (account: string) => {
  const provider = getWeb3Provider(windowRef);
  const networkId =
    windowRef.web3?.currentProvider?.networkVersion ||
    AppStatus.get().env['networkId'];
  const address = toChecksumAddress(account);
  const accountObject = {
    address,
    mixedCaseAddress: address,
    meta: {
      address,
      provider,
      signer: provider.getSigner(),
      email: null,
      profileImage: null,
      openWallet: null,
      accountType: ACCOUNT_TYPES.WEB3WALLET,
      isWeb3: true,
    },
  };
  updateSdk(accountObject, networkId);
};

export const getWeb3Provider = windowRef => {
  return new Web3Provider(
    'ethereum' in window ? windowRef.ethereum : windowRef.web3.currentProvider
  );
};
