import { Augur, Provider } from '@augurproject/sdk';
import { connect } from 'services/initialize';
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
import { isEmpty } from 'utils/is-empty';
import {
  MODAL_NETWORK_MISMATCH,
  MODAL_NETWORK_DISCONNECTED,
  MODAL_NETWORK_DISABLED,
  ACCOUNT_TYPES,
  NETWORK_NAMES,
  MODAL_LOADING,
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


const ACCOUNTS_POLL_INTERVAL_DURATION = 10000;
const NETWORK_ID_POLL_INTERVAL_DURATION = 10000;

function pollForAccount(
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) {
  const windowApp = windowRef as WindowApp;

  let attemptedLogin = false;
  let intervalId = null;

  function attempLogin() {
    const { authStatus, connection, modal } = getState();

    if (attemptedLogin) {
      clearInterval(intervalId);
    }

    if (connection.isConnected) {
      const loggedInAccount = windowApp.localStorage.getItem('loggedInAccount');
      const loggedInAccountType = windowApp.localStorage.getItem('loggedInAccountType');

      const showModal = (accountType) => {
        attemptedLogin = true;
        dispatch(
          updateModal({
            type: MODAL_LOADING,
            callback: () => dispatch(closeModal()),
            message: `Loading ${accountType} account.`,
            showCloseAfterDelay: true,
          })
        );
      }

      if (!authStatus.isLogged && loggedInAccount) {
        const isLoading = modal && modal.type === MODAL_LOADING;
        if (isGlobalWeb3() && !isLoading && loggedInAccountType === ACCOUNT_TYPES.WEB3WALLET) {
          showModal(ACCOUNT_TYPES.WEB3WALLET);
          dispatch(loginWithInjectedWeb3());
        }
        if (!isLoading && loggedInAccountType === ACCOUNT_TYPES.PORTIS) {
          showModal(ACCOUNT_TYPES.PORTIS);
          dispatch(loginWithPortis(false, () => null));
        }

        if (!isLoading && loggedInAccountType === ACCOUNT_TYPES.FORTMATIC) {
          showModal(ACCOUNT_TYPES.FORTMATIC);
          dispatch(loginWithFortmatic(() => null));
        }

        if (!isLoading && loggedInAccountType === ACCOUNT_TYPES.TORUS) {
          showModal(ACCOUNT_TYPES.TORUS);
          dispatch(loginWithTorus(() => null));
        }
      }
    }
  }

  attempLogin();
  intervalId = setInterval(() => {
    attempLogin();
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
  return (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    const { modal, loginAccount } = getState();
    const windowApp = windowRef as WindowApp;

    connect(
      env,
      async (err: any, sdk:Augur<Provider> ) => {
        if (err) {
          return callback(err, null);
        }
        const windowApp = windowRef as WindowApp;
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
        const sameNetwork = augurSdk.sameNetwork();
        if ((!sameNetwork && sameNetwork !== undefined) || !known) {
          dispatch(
            updateModal({
              type: MODAL_NETWORK_MISMATCH,
              expectedNetwork: NETWORK_NAMES[Number(augurSdk.networkId)]
            })
          );
        } else {
          dispatch(updateUniverse({ id: universeId }));
          if (modal && modal.type === MODAL_NETWORK_DISCONNECTED) {
              dispatch(closeModal());
          }
          if (isInitialConnection) {
            pollForAccount(dispatch, getState);
            pollForNetwork(dispatch, getState);
          }
          callback(null);
        }
        // wire up start up events for sdk
        dispatch(listenForStartUpEvents(sdk));
      }
    );
  };
}

interface initAugurParams {
  ethereumNodeHttp: string | null;
  ethereumNodeWs: string | null;
  useWeb3Transport: boolean;
}

export function initAugur(
  history: History,
  { ethereumNodeHttp, ethereumNodeWs, useWeb3Transport }: initAugurParams,
  callback: NodeStyleCallback = logError
) {
  return (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    const env = networkConfig[`${process.env.ETHEREUM_NETWORK}`];
    console.log(env);
    env.useWeb3Transport = useWeb3Transport;
    env['ethereum-node'].http = ethereumNodeHttp
      ? ethereumNodeHttp
      : env['ethereum-node'].http;
    const defaultWS = isEmpty(ethereumNodeHttp) ? env['ethereum-node'].ws : '';
    // If only the http param is provided we need to prevent this "default from taking precedence.
    env['ethereum-node'].ws = ethereumNodeWs ? ethereumNodeWs : defaultWS;

    dispatch(updateEnv(env));
    connectAugur(history, env, true, callback)(dispatch, getState);
  };
}
