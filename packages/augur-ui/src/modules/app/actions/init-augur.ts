import {
  checkIsKnownUniverse,
  getNetworkId,
} from 'modules/contracts/actions/contractCalls';
import isGlobalWeb3 from 'modules/auth/helpers/is-global-web3';
import { updateEnv } from 'modules/app/actions/update-env';
import { checkIfMainnet } from 'modules/app/actions/check-if-mainnet';
import { updateUniverse } from 'modules/universe/actions/update-universe';
import { updateModal } from 'modules/modal/actions/update-modal';
import { closeModal } from 'modules/modal/actions/close-modal';
import logError from 'utils/log-error';
import networkConfig from 'config/network.json';
import { JsonRpcProvider, Web3Provider } from 'ethers/providers';
import { isEmpty } from 'utils/is-empty';
import {
  MODAL_NETWORK_DISCONNECTED,
  MODAL_NETWORK_DISABLED,
  ACCOUNT_TYPES,
  MODAL_LOADING,
  MODAL_ERROR,
  MODAL_ACCOUNT_CREATED,
  MODAL_AUGUR_USES_DAI,
  MODAL_BUY_DAI,
  MODAL_TEST_BET,
  MODAL_TUTORIAL_INTRO,
  SIGNIN_LOADING_TEXT,
} from 'modules/common/constants';
import { windowRef } from 'utils/window-ref';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { EnvObject, NodeStyleCallback, WindowApp } from 'modules/types';
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
import { tryToPersistStorage } from 'utils/storage-manager';

const ACCOUNTS_POLL_INTERVAL_DURATION = 10000;
const NETWORK_ID_POLL_INTERVAL_DURATION = 10000;

function pollForAccount(
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) {
  let attemptedLogin = false;
  let intervalId = null;

  async function attemptLogin() {
    const { connection, modal } = getState();
    if (attemptedLogin) {
      clearInterval(intervalId);
    }

    if (!attemptedLogin && connection.isConnected) {
      attemptedLogin = true;

      const loggedInUser = getLoggedInUserFromLocalStorage();
      const loggedInAccount = loggedInUser && loggedInUser.address || null;
      const loggedInAccountType = loggedInUser && loggedInUser.type || null;

      const showModal = accountType => {
        const onboardingShown = [
          MODAL_ACCOUNT_CREATED,
          MODAL_AUGUR_USES_DAI,
          MODAL_BUY_DAI,
          MODAL_TEST_BET,
          MODAL_TUTORIAL_INTRO,
        ].includes(modal.type);
        if (!onboardingShown) {
          dispatch(
            updateModal({
              type: MODAL_LOADING,
              callback: () =>
                setTimeout(() => {
                  dispatch(closeModal());
                }),
              message: accountType === ACCOUNT_TYPES.WEB3WALLET ? SIGNIN_LOADING_TEXT : `Connecting to our partners at ${accountType} to create your secure account.`,
              showLearnMore: true,
              showCloseAfterDelay: true,
            })
          );
        }
      };

      const errorModal = () => {
        dispatch(logout());
        dispatch(
          updateModal({
            type: MODAL_ERROR,
          })
        );
      };

      if (loggedInAccount) {
        try {
          if (
            isGlobalWeb3() &&
            loggedInAccountType === ACCOUNT_TYPES.WEB3WALLET
          ) {
            showModal(ACCOUNT_TYPES.WEB3WALLET);
            await dispatch(loginWithInjectedWeb3());
          }
          if (loggedInAccountType === ACCOUNT_TYPES.PORTIS) {
            showModal(ACCOUNT_TYPES.PORTIS);
            await dispatch(loginWithPortis(false));
          }

          if (loggedInAccountType === ACCOUNT_TYPES.FORTMATIC) {
            showModal(ACCOUNT_TYPES.FORTMATIC);
            await dispatch(loginWithFortmatic());
          }

          if (loggedInAccountType === ACCOUNT_TYPES.TORUS) {
            showModal(ACCOUNT_TYPES.TORUS);
            await dispatch(loginWithTorus());
          }
        } catch (error) {
          errorModal();
        }
      }
    }
  }

  intervalId = setInterval(() => {
    attemptLogin();
  }, ACCOUNTS_POLL_INTERVAL_DURATION);
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
  env: any,
  isInitialConnection: boolean = false,
  callback: NodeStyleCallback = logError
) {
  return async (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    const { modal, loginAccount } = getState();
    let windowApp = windowRef as WindowApp;

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

    let provider;
    if (windowApp.web3) {
      provider = new Web3Provider(windowApp.web3.currentProvider);
    } else {
      provider = new JsonRpcProvider(env['ethereum'].http);
    }

    let sdk: Augur<Provider> = null;
    try {
      sdk = await augurSdk.makeClient(provider, env);
    } catch (e) {
      console.error(e);
      return callback('SDK could not be created', null);
    }

    let universeId = env.universe || sdk.contracts.universe.address;
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
    const known = await checkIsKnownUniverse(universeId);
    dispatch(updateUniverse({ id: universeId }));

    // If the network disconnected modal is being shown, but we are now
    // connected -- hide it.
    if (modal && modal.type === MODAL_NETWORK_DISCONNECTED) {
      dispatch(closeModal());
    }

    if (isInitialConnection) {
      pollForAccount(dispatch, getState);
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
    const env: EnvObject = networkConfig[`${process.env.ETHEREUM_NETWORK}`];

    // TODO: Make this flag a part of the `ethereum` key
    env.useWeb3Transport = useWeb3Transport;

    if (ethereumNodeHttp) {
      env['ethereum'].http = ethereumNodeHttp;
    }

    if (sdkEndpoint) {
      env['sdk'] = {
        http: sdkEndpoint
      };
    }

    console.log(
      "******** CONFIGURATION ***********\n" +
      JSON.stringify(env, null, 2) +
      "\n**********************************"
    );
    dispatch(updateEnv(env));
    tryToPersistStorage();
    connectAugur(history, env, true, callback)(dispatch, getState);
  };
}
