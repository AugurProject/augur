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
} from 'modules/common/constants';
import { windowRef } from 'utils/window-ref';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { NodeStyleCallback, WindowApp } from 'modules/types';
import { augurSdk } from 'services/augursdk';
import { listenForStartUpEvents } from 'modules/events/actions/listen-to-updates';
import { forceLoginWithInjectedWeb3 } from 'modules/auth/actions/login-with-injected-web3';

const ACCOUNTS_POLL_INTERVAL_DURATION = 10000;
const NETWORK_ID_POLL_INTERVAL_DURATION = 10000;

function pollForAccount(
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) {
  const windowApp = windowRef as WindowApp;
  const { loginAccount } = getState();
  let accountType =
    loginAccount && loginAccount.meta && loginAccount.meta.accountType;
  let usingMetaMask = accountType === ACCOUNT_TYPES.WEB3WALLET;
  if (!accountType && isGlobalWeb3()) {
    usingMetaMask = true;
  }
  setInterval(() => {
    const { authStatus, connection } = getState();
    if (connection.isConnected) {
      let loggedInAccount: string = undefined;
      let loggedInAccountType: string = undefined;
      if (!loginAccount.address) {
        if (windowApp.localStorage && windowApp.localStorage.getItem) {
          loggedInAccount = windowApp.localStorage.getItem('loggedInAccount');
          loggedInAccountType = windowApp.localStorage.getItem('loggedInAccountType');
        }
      } else {
        loggedInAccount = loginAccount.address;
      }
      if (!authStatus.isLogged && usingMetaMask && loggedInAccount && loggedInAccountType === ACCOUNT_TYPES.WEB3WALLET) {
        autoLoginAccount(dispatch, loggedInAccount);
      }
    }
  }, ACCOUNTS_POLL_INTERVAL_DURATION);
}

async function autoLoginAccount(
  dispatch: ThunkDispatch<void, any, Action>,
  loggedInAccount: string,
) {
  const windowApp = windowRef as WindowApp;
  const accounts = await windowApp.ethereum.enable().catch((err: Error) => {
    console.log('could not auto login account', err);
  });
  let account = null;
  for (account of accounts) {
    if (account === loggedInAccount) {
      dispatch(forceLoginWithInjectedWeb3(account));
    }
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
  history: any,
  env: any,
  isInitialConnection: boolean = false,
  callback: NodeStyleCallback = logError
) {
  return (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    const { modal, loginAccount } = getState();
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
          const localUniverse =
            (windowApp.localStorage.getItem &&
              windowApp.localStorage.getItem(loginAccount.address)) ||
            '';
          const storedUniverseId = JSON.parse(localUniverse).selectedUniverse[
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
            })
          );
        } else {
          dispatch(updateUniverse({ id: universeId }));
          if (modal && modal.type === MODAL_NETWORK_DISCONNECTED)
            dispatch(closeModal());
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
  useWeb3Transport: Boolean;
}

export function initAugur(
  history: any,
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
