import {
  getNetworkId,
} from 'modules/contracts/actions/contractCalls';
import isGlobalWeb3 from 'modules/auth/helpers/is-global-web3';
import { updateEnv } from 'modules/app/actions/update-env';
import { checkIfMainnet } from 'modules/app/actions/check-if-mainnet';
import { updateUniverse } from 'modules/universe/actions/update-universe';
import { updateModal } from 'modules/modal/actions/update-modal';
import { closeModal } from 'modules/modal/actions/close-modal';
import logError from 'utils/log-error';
import { JsonRpcProvider, Web3Provider } from 'ethers/providers';
import { isEmpty } from 'utils/is-empty';
import {
  MODAL_NETWORK_DISCONNECTED,
  MODAL_NETWORK_DISABLED,
  ACCOUNT_TYPES,
  MODAL_LOADING,
  MODAL_ERROR,
  SIGNIN_SIGN_WALLET,
} from 'modules/common/constants';
import { windowRef } from 'utils/window-ref';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { NodeStyleCallback, WindowApp } from 'modules/types';
import { augurSdk } from 'services/augursdk';
import { listenForStartUpEvents } from 'modules/events/actions/listen-to-updates';
import { loginWithInjectedWeb3 } from 'modules/auth/actions/login-with-injected-web3';
import { loginWithPortis } from 'modules/auth/actions/login-with-portis';
import { loginWithFortmatic } from 'modules/auth/actions/login-with-fortmatic';
import { loginWithTorus } from 'modules/auth/actions/login-with-torus';
import { toChecksumAddress } from 'ethereumjs-util';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import {
  updateAuthStatus,
  RESTORED_ACCOUNT,
} from 'modules/auth/actions/auth-status';
import { logout } from 'modules/auth/actions/logout';
import { updateCanHotload } from 'modules/app/actions/update-connection';
import { Augur, Provider } from '@augurproject/sdk';
import { getLoggedInUserFromLocalStorage } from 'services/storage/localStorage';
import { getFingerprint } from 'utils/get-fingerprint';
import { tryToPersistStorage } from 'utils/storage-manager';
import Torus from '@toruslabs/torus-embed';
import { isDevNetworkId, SDKConfiguration } from '@augurproject/artifacts';
import { getNetwork } from 'utils/get-network-name';
import { buildConfig } from '@augurproject/artifacts';

const NETWORK_ID_POLL_INTERVAL_DURATION = 10000;

async function loadAccountIfStored(dispatch: ThunkDispatch<void, any, Action>) {
  const loggedInUser = getLoggedInUserFromLocalStorage();
  const loggedInAccount = (loggedInUser && loggedInUser.address) || null;
  const loggedInAccountType = (loggedInUser && loggedInUser.type) || null;

  const errorModal = () => {
    dispatch(logout());
    dispatch(
      updateModal({
        type: MODAL_ERROR,
      })
    );
  };
  try {
    if (loggedInAccount) {
      if (isGlobalWeb3() && loggedInAccountType === ACCOUNT_TYPES.WEB3WALLET) {
        console.log('showMetaMaskHelper::', !windowRef.ethereum.selectedAddress);
        if (!windowRef.ethereum.selectedAddress) {
          // show metamask signer
          dispatch(
            updateModal({
              type: MODAL_LOADING,
              message: SIGNIN_SIGN_WALLET,
              showMetaMaskHelper: true,
              callback: () => dispatch(closeModal()),
            })
          );
        }

        await dispatch(loginWithInjectedWeb3());
      }
      if (loggedInAccountType === ACCOUNT_TYPES.PORTIS) {
        await dispatch(loginWithPortis(false));
      }

      if (loggedInAccountType === ACCOUNT_TYPES.FORTMATIC) {
        await dispatch(loginWithFortmatic());
      }

      if (loggedInAccountType === ACCOUNT_TYPES.TORUS) {
        await dispatch(loginWithTorus());
      }
    }
  } catch (error) {
    errorModal();
  }
}

function pollForNetwork(
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) {
  setInterval(() => {
    const { modal } = getState();
    if (!process.env.ENABLE_MAINNET) {
      const isMainnet = checkIfMainnet();
      if (isMainnet && isEmpty(modal)) {
        dispatch(
          updateModal({
            type: MODAL_NETWORK_DISABLED,
          })
        );
      } else if (!isMainnet && modal.type === MODAL_NETWORK_DISABLED) {
        dispatch(closeModal());
      }
    }
  }, NETWORK_ID_POLL_INTERVAL_DURATION);
}

export function connectAugur(
  history: History,
  config: SDKConfiguration,
  isInitialConnection = false,
  callback: NodeStyleCallback = logError
) {
  return async (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    const { modal, loginAccount } = getState();
    const windowApp = windowRef as WindowApp;

    const loggedInUser = getLoggedInUserFromLocalStorage();
    const loggedInAccount = loggedInUser && loggedInUser.address || null;
    const loggedInAccountType = loggedInUser && loggedInUser.type || null;

    // Preload Account
    const preloadAccount = accountType => {
      const address = toChecksumAddress(loggedInAccount);
      const accountObject = {
        address,
        mixedCaseAddress: address,
        meta: {
          address,
          signer: null,
          email: null,
          profileImage: null,
          openWallet: null,
          accountType,
          isWeb3: true,
          preloaded: true,
        },
      };
      dispatch(updateAuthStatus(RESTORED_ACCOUNT, true));
      dispatch(updateLoginAccount(accountObject));
    };

    if (isGlobalWeb3() && loggedInAccountType === ACCOUNT_TYPES.WEB3WALLET) {
      preloadAccount(ACCOUNT_TYPES.WEB3WALLET);
    }

    if (loggedInAccountType === ACCOUNT_TYPES.PORTIS) {
      preloadAccount(ACCOUNT_TYPES.PORTIS);
    }

    if (loggedInAccountType === ACCOUNT_TYPES.FORTMATIC) {
      preloadAccount(ACCOUNT_TYPES.FORTMATIC);
    }

    if (loggedInAccountType === ACCOUNT_TYPES.TORUS) {
      preloadAccount(ACCOUNT_TYPES.TORUS);
    }

    let provider = null;
    const networkId = config.networkId;

    if (config.ethereum?.http) {
      // Use node provided in the ethereum_node_http param
      try {
        provider = new JsonRpcProvider(config.ethereum.http);
      } catch(error) {
        dispatch(
          updateModal({
            type: MODAL_NETWORK_DISABLED,
          })
        );
      }
    }
    else if (networkId && !isDevNetworkId(networkId)) {
      // Unless DEV, use the provider on window if it exists, otherwise use torus provider
      if (windowRef.web3) {
        // Use window provider
        provider = new Web3Provider(windowRef.web3.currentProvider);
      } else {
        // Use torus provider
        const host = getNetwork(networkId);
        const torus: any = new Torus({});

        await torus.init({
          network: { host },
          showTorusButton: false,
        });

        // Tor.us cleanup
        const torusWidget = document.querySelector('#torusWidget');
        if (torusWidget) {
          torusWidget.remove();
        }
        provider = new Web3Provider(torus.provider);
      }
    }
    else {
      // In DEV, use local ethereum node
      provider = new JsonRpcProvider(config.ethereum.http);
    }

    let sdk: Augur<Provider> = null;
    try {
      sdk = await augurSdk.makeClient(provider, config);
    } catch (e) {
      console.error(e);
      return callback('SDK could not be created', null);
    }

    let universeId = config.addresses?.Universe || sdk.contracts.universe.address;
    if (
      windowApp.localStorage &&
      windowApp.localStorage.getItem &&
      loginAccount.address
    ) {
      const loginAddress =
        (windowApp.localStorage.getItem &&
          windowApp.localStorage.getItem(loginAccount.address)) ||
        '';
      const storedUniverseId = JSON.parse(loginAddress).selectedUniverse[
        getNetworkId().toString()
      ];
      universeId = !storedUniverseId ? universeId : storedUniverseId;
    }
    dispatch(updateUniverse({ id: universeId }));

    // If the network disconnected modal is being shown, but we are now
    // connected -- hide it.
    if (modal?.type === MODAL_NETWORK_DISCONNECTED) {
      dispatch(closeModal());
    }

    if (isInitialConnection) {
      loadAccountIfStored(dispatch);
      pollForNetwork(dispatch, getState);
    }

    // wire up start up events for sdk
    dispatch(listenForStartUpEvents(sdk));
    dispatch(updateCanHotload(true));

    await augurSdk.connect();

    callback(null);
  };
}

interface initAugurParams {
  ethereumNodeHttp: string | null;
  ethereumNodeWs: string | null;
  sdkEndpoint: string | null;
  useWeb3Transport: boolean;
}

export function initAugur(
  history: History,
  {
    ethereumNodeHttp,
    ethereumNodeWs, /* unused */
    sdkEndpoint,
    useWeb3Transport,
  }: initAugurParams,
  callback: NodeStyleCallback = logError
) {
  return (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    // const config: SDKConfiguration = environments[`${process.env.ETHEREUM_NETWORK}`];
    const config = buildConfig(process.env.ETHEREUM_NETWORK || 'local');

    config.ethereum.useWeb3Transport = useWeb3Transport;

    if (ethereumNodeHttp) {
      config.ethereum.http = ethereumNodeHttp;
    }

    if (sdkEndpoint) {
      config.sdk.ws = sdkEndpoint;
    }

    console.log(
      '******** CONFIGURATION ***********\n' +
      JSON.stringify(config, null, 2) +
      '\n**********************************'
    );
    // cache fingerprint
    getFingerprint();
    dispatch(updateEnv(config));
    tryToPersistStorage();
    connectAugur(history, config, true, callback)(dispatch, getState);
  };
}
