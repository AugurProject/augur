import type { SDKConfiguration } from '@augurproject/artifacts';
import { isDevNetworkId, mergeConfig } from '@augurproject/utils';
import { AppState } from 'appStore';
import { toChecksumAddress } from 'ethereumjs-util';
import { JsonRpcProvider, Web3Provider } from 'ethers/providers';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { checkIfMainnet } from 'modules/app/actions/check-if-mainnet';
import { updateCanHotload } from 'modules/app/actions/update-connection';
import { updateEnv } from 'modules/app/actions/update-env';
import {
  RESTORED_ACCOUNT,
  updateAuthStatus,
} from 'modules/auth/actions/auth-status';
import { loginWithFortmatic } from 'modules/auth/actions/login-with-fortmatic';
import {
  getWeb3Provider,
  loginWithInjectedWeb3,
} from 'modules/auth/actions/login-with-injected-web3';
import { loginWithTorus } from 'modules/auth/actions/login-with-torus';
import { logout } from 'modules/auth/actions/logout';
import isGlobalWeb3 from 'modules/auth/helpers/is-global-web3';
import {
  ACCOUNT_TYPES,
  MODAL_ERROR,
  MODAL_LOADING,
  MODAL_NETWORK_DISABLED,
  MODAL_NETWORK_DISCONNECTED,
  MODAL_NETWORK_MISMATCH,
  NETWORK_NAMES,
  SIGNIN_SIGN_WALLET,
} from 'modules/common/constants';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { listenForStartUpEvents } from 'modules/events/actions/listen-to-updates';
import { closeModal } from 'modules/modal/actions/close-modal';
import { updateModal } from 'modules/modal/actions/update-modal';
import { NodeStyleCallback, WindowApp } from 'modules/types';
import { updateUniverse } from 'modules/universe/actions/update-universe';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { augurSdk } from 'services/augursdk';
import { augurSdkLite } from 'services/augursdklite';
import { getLoggedInUserFromLocalStorage } from 'services/storage/localStorage';
import { getFingerprint } from 'utils/get-fingerprint';
import { getNetwork } from 'utils/get-network-name';
import { isEmpty } from 'utils/is-empty';
import { isGoogleBot } from 'utils/is-google-bot';
import { isMobileSafari } from 'utils/is-safari';
import logError from 'utils/log-error';
import { showIndexedDbSize } from 'utils/show-indexed-db-size';
import { tryToPersistStorage } from 'utils/storage-manager';
import { windowRef } from 'utils/window-ref';

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
        error: 'Please try logging in with your wallet provider again.',
      })
    );
  };
  try {
    if (loggedInAccount) {
      if (isGlobalWeb3() && loggedInAccountType === ACCOUNT_TYPES.WEB3WALLET) {
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
    const loggedInAccount = (loggedInUser && loggedInUser.address) || null;
    const loggedInAccountType = (loggedInUser && loggedInUser.type) || null;

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

    if (loggedInAccountType === ACCOUNT_TYPES.FORTMATIC) {
      preloadAccount(ACCOUNT_TYPES.FORTMATIC);
    }

    if (loggedInAccountType === ACCOUNT_TYPES.TORUS) {
      preloadAccount(ACCOUNT_TYPES.TORUS);
    }

    let provider = null;
    const networkId = config.networkId;

    if (networkId && !isDevNetworkId(networkId)) {
      // Unless DEV, use the provider on window if it exists, otherwise use torus provider
      if (windowRef.web3) {
        // Use window provider
        provider = getWeb3Provider(windowRef);
      } else {
        // Use torus provider

        // Use import instead of import for wallet SDK packages
        // to conditionally load web3 into the DOM.
        //
        // Note: This also creates a split point in webpack
        const { default: Torus } = await import(
          /* webpackChunkName: "torus" */ '@toruslabs/torus-embed'
        );
        const torus = new Torus({});

        const host = getNetwork(networkId);
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
    } else {
      // In DEV, use local ethereum node
      provider = new JsonRpcProvider(config.ethereum.http);
    }

    // Disable mesh/gsn for googleBot
    if (isGoogleBot()) {
      config = mergeConfig(config, {
        zeroX: { mesh: { enabled: false } },
        gsn: { enabled: false },
        useWarpSync: false,
      })
    }

    if (isMobileSafari()) {
      config = mergeConfig(config, {
        warpSync: {
          autoReport: false,
          enabled: false,
        },
      })
    }

    let Augur = null;
    try {
      await augurSdkLite.makeLiteClient(provider, config.addresses, config.networkId);
      dispatch(updateCanHotload(true)); // Hotload now!

      Augur = await augurSdk.makeClient(provider, config);
    } catch (e) {
      console.error(e);
      if (provider._network && config.networkId !== provider._network.chainId) {
        return dispatch(
          updateModal({
            type: MODAL_NETWORK_MISMATCH,
            expectedNetwork: NETWORK_NAMES[Number(config.networkId)],
          })
        );
      } else {
        return callback('SDK could not be created', { config });
      }
    }

    let universeId =
      config.addresses?.Universe || Augur.contracts.universe.address;
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
    dispatch(listenForStartUpEvents(Augur));

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
    ethereumNodeWs /* unused */,
    sdkEndpoint,
    useWeb3Transport,
  }: initAugurParams,
  callback: NodeStyleCallback = logError
) {
  return (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    const config: SDKConfiguration = process.env.CONFIGURATION;

    config.ethereum.useWeb3Transport = useWeb3Transport;

    if (ethereumNodeHttp) {
      config.ethereum.http = ethereumNodeHttp;
    }

    if (sdkEndpoint) {
      config.sdk.ws = sdkEndpoint;
    }

    // cache fingerprint
    getFingerprint();
    dispatch(updateEnv(config));
    tryToPersistStorage();
    connectAugur(history, config, true, callback)(dispatch, getState);

    windowRef.showIndexedDbSize = showIndexedDbSize;
  };
}
