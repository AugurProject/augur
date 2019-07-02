import * as AugurJS from 'services/augurjs';
import {
  checkIsKnownUniverse,
  getNetworkId,
  getAccounts,
} from 'modules/contracts/actions/contractCalls';
import { updateEnv } from 'modules/app/actions/update-env';
import { updateConnectionStatus } from 'modules/app/actions/update-connection';
import { useUnlockedAccount } from 'modules/auth/actions/use-unlocked-account';
import { logout } from 'modules/auth/actions/logout';
import { checkIfMainnet } from 'modules/app/actions/check-if-mainnet';
import { updateUniverse } from 'modules/universe/actions/update-universe';
import { updateModal } from 'modules/modal/actions/update-modal';
import { closeModal } from 'modules/modal/actions/close-modal';
import logError from 'utils/log-error';
import networkConfig from 'config/network.json';
import { isEmpty } from 'utils/is-populated';
// TODO: do we need network mismatch? maybe for when users connect using MM and have wrong network id selected
import {
  MODAL_NETWORK_MISMATCH,
  MODAL_NETWORK_DISCONNECTED,
  MODAL_DISCLAIMER,
  MODAL_NETWORK_DISABLED,
  NETWORK_NAMES,
  ACCOUNT_TYPES,
  DISCLAIMER_SEEN,
} from 'modules/common/constants';
import { windowRef } from 'utils/window-ref';
import { setSelectedUniverse } from 'modules/auth/actions/selected-universe-management';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { NodeStyleCallback, WindowApp } from 'modules/types';
import { augurSdk } from 'services/augursdk';
import { listenToUpdates } from 'modules/events/actions/listen-to-updates';

const ACCOUNTS_POLL_INTERVAL_DURATION = 10000;
const NETWORK_ID_POLL_INTERVAL_DURATION = 10000;

function pollForAccount(
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState,
  callback: any
) {
  const { loginAccount } = getState();
  let accountType =
    loginAccount && loginAccount.meta && loginAccount.meta.accountType;

  loadAccount(dispatch, null, accountType, (err: any, loadedAccount: any) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    let account = loadedAccount;
    setInterval(() => {
      const { authStatus, loginAccount } = getState();
      accountType =
        loginAccount && loginAccount.meta && loginAccount.meta.accountType;

      if (authStatus.isLogged) {
        loadAccount(
          dispatch,
          account,
          accountType,
          (err: any, loadedAccount: any) => {
            if (err) console.error(err);
            account = loadedAccount;
          }
        );
      }
      const windowApp = windowRef as WindowApp;
      const disclaimerSeen =
        windowApp &&
        windowApp.localStorage &&
        windowApp.localStorage.getItem(DISCLAIMER_SEEN);
      if (!disclaimerSeen) {
        dispatch(
          updateModal({
            type: MODAL_DISCLAIMER,
          })
        );
      }
    }, ACCOUNTS_POLL_INTERVAL_DURATION);
  });
}

function loadAccount(
  dispatch: ThunkDispatch<void, any, Action>,
  existing: any,
  accountType: string,
  callback: NodeStyleCallback
) {
  let loggedInAccount: any = null;
  const windowApp = windowRef as WindowApp;
  const usingMetaMask = accountType === ACCOUNT_TYPES.METAMASK;
  if (windowApp.localStorage && windowApp.localStorage.getItem) {
    loggedInAccount = windowApp.localStorage.getItem('loggedInAccount');
  }
  getAccounts()
    .then((accounts: Array<string>) => {
      let account = existing;
      if (existing !== accounts[0]) {
        account = accounts[0];
        if (account && process.env.AUTO_LOGIN) {
          dispatch(useUnlockedAccount(account));
        } else if (
          loggedInAccount &&
          usingMetaMask &&
          loggedInAccount !== account &&
          account
        ) {
          // local storage does not match mm account and mm is signed in
          dispatch(useUnlockedAccount(account));
          loggedInAccount = account;
        } else if (loggedInAccount && loggedInAccount === account) {
          // local storage matchs mm account
          dispatch(useUnlockedAccount(loggedInAccount));
          account = loggedInAccount;
        } else if (
          !loggedInAccount &&
          usingMetaMask &&
          existing !== account &&
          account
        ) {
          // no local storage set and logged in account does not match mm account, they want to switch accounts
          dispatch(useUnlockedAccount(account));
        } else if (!account && usingMetaMask) {
          // no mm account signed in
          dispatch(logout());
          account = null;
        }
      }
      callback(null, account);
    })
    .catch((err: Error) => {
      callback(null);
    });
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
    const Augur = augurSdk.get();
    AugurJS.connect(
      env,
      async (err: any) => {
        if (err) {
          return callback(err, null);
        }
        dispatch(updateConnectionStatus(true));
        const windowApp = windowRef as WindowApp;
        let universeId =
          env.universe ||
          Augur.contracts.universe;
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

        const doIt = () => {
          dispatch(updateUniverse({ id: universeId }));
          if (modal && modal.type === MODAL_NETWORK_DISCONNECTED)
            dispatch(closeModal());
          if (isInitialConnection) {
            pollForAccount(dispatch, getState, null);
            pollForNetwork(dispatch, getState);
          }
          callback(null);
        };

        if (process.env.NODE_ENV === 'development') {
          if ((await checkIsKnownUniverse(universeId)) === false) {
            dispatch(setSelectedUniverse());
            location.reload();
          }
          doIt();
        } else {
          doIt();
        }

        // wire up events for sdk
        dispatch(listenToUpdates(Augur));
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
