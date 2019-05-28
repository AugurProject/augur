import * as AugurJS from "services/augurjs";
import { checkIsKnownUniverse, getNetworkId, getAccounts } from "modules/contracts/actions/contractCalls";
import { updateEnv } from "modules/app/actions/update-env";
import {
  updateConnectionStatus,
  updateAugurNodeConnectionStatus
} from "modules/app/actions/update-connection";
import { getAugurNodeNetworkId } from "modules/app/actions/get-augur-node-network-id";
import { useUnlockedAccount } from "modules/auth/actions/use-unlocked-account";
import { logout } from "modules/auth/actions/logout";
import { verifyMatchingNetworkIds } from "modules/app/actions/verify-matching-network-ids";
import { checkIfMainnet } from "modules/app/actions/check-if-mainnet";
import { updateUniverse } from "modules/universe/actions/update-universe";
import { updateModal } from "modules/modal/actions/update-modal";
import { closeModal } from "modules/modal/actions/close-modal";
import logError from "utils/log-error";
import networkConfig from "config/network";
import { version } from "version";
import { updateVersions } from "modules/app/actions/update-versions";
import { defaultTo, isEmpty } from "lodash";
import {
  MODAL_NETWORK_MISMATCH,
  MODAL_NETWORK_DISCONNECTED,
  MODAL_DISCLAIMER,
  MODAL_NETWORK_DISABLED,
  NETWORK_NAMES,
  ACCOUNT_TYPES,
  DISCLAIMER_SEEN
} from "modules/common-elements/constants";
import { windowRef } from "utils/window-ref";
import { setSelectedUniverse } from "modules/auth/actions/selected-universe-management";

const ACCOUNTS_POLL_INTERVAL_DURATION = 10000;
const NETWORK_ID_POLL_INTERVAL_DURATION = 10000;

function pollForAccount(
  dispatch: Function,
  getState: Function,
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
      const disclaimerSeen =
        windowRef &&
        windowRef.localStorage &&
        windowRef.localStorage.getItem(DISCLAIMER_SEEN);
      if (!disclaimerSeen) {
        dispatch(
          updateModal({
            type: MODAL_DISCLAIMER
          })
        );
      }
    }, ACCOUNTS_POLL_INTERVAL_DURATION);
  });
}

function loadAccount(
  dispatch: Function,
  existing: any,
  accountType: string,
  callback: Function
) {
  let loggedInAccount: any = null;
  const usingMetaMask = accountType === ACCOUNT_TYPES.METAMASK;
  if (windowRef.localStorage && windowRef.localStorage.getItem) {
    loggedInAccount = windowRef.localStorage.getItem("loggedInAccount");
  }
  getAccounts().then((accounts: Array<string>) => {
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
  }).catch((err: Error) => {
    callback(null);
  });
}

function pollForNetwork(dispatch: Function, getState: Function) {
  setInterval(() => {
    const { modal } = getState();
    dispatch(
      verifyMatchingNetworkIds((err: any, expectedNetworkId: string) => {
        if (err) return console.error("pollForNetwork failed", err);
        if (expectedNetworkId != null && isEmpty(modal)) {
          dispatch(
            updateModal({
              type: MODAL_NETWORK_MISMATCH,
              expectedNetwork:
                NETWORK_NAMES[expectedNetworkId] || expectedNetworkId
            })
          );
        } else if (
          expectedNetworkId == null &&
          modal.type === MODAL_NETWORK_MISMATCH
        ) {
          dispatch(closeModal());
        }
      })
    );
    if (!process.env.ENABLE_MAINNET) {
      dispatch(
        checkIfMainnet((err: any, isMainnet: Boolean) => {
          if (err) return console.error("pollForNetwork failed", err);
          if (isMainnet && isEmpty(modal)) {
            dispatch(
              updateModal({
                type: MODAL_NETWORK_DISABLED
              })
            );
          } else if (!isMainnet && modal.type === MODAL_NETWORK_DISABLED) {
            dispatch(closeModal());
          }
        })
      );
    }
  }, NETWORK_ID_POLL_INTERVAL_DURATION);
}

export function connectAugur(
  history: any,
  env: any,
  isInitialConnection: Boolean = false,
  callback: Function = logError
) {
  return (dispatch: Function, getState: Function) => {
    const { modal, loginAccount } = getState();
    AugurJS.connect(
      env,
      loginAccount,
      async (err: any, ConnectionInfo: any) => {
        if (err || !ConnectionInfo.augurNode || !ConnectionInfo.ethereumNode) {
          return callback(err, ConnectionInfo);
        }
        dispatch(updateConnectionStatus(true));
        dispatch(updateAugurNodeConnectionStatus(true));
        dispatch(getAugurNodeNetworkId());
        AugurJS.augur.augurNode.getSyncData((err: any, res: any) => {
          if (!err && res) {
            dispatch(
              updateVersions({
                augurjs: res.version,
                augurNode: res.augurNodeVersion,
                augurui: version
              })
            );
          }
        });
        let universeId =
          env.universe ||
          AugurJS.augur.contracts.addresses[getNetworkId()]
            .Universe;
        if (
          windowRef.localStorage &&
          windowRef.localStorage.getItem &&
          loginAccount.address
        ) {
          const storedUniverseId = JSON.parse(
            windowRef.localStorage.getItem(loginAccount.address)
          ).selectedUniverse[
            getState().connection.augurNodeNetworkId ||
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
          callback();
        };

        if (process.env.NODE_ENV === "development") {
          if ((await checkIsKnownUniverse(universeId)) === false) {
            dispatch(setSelectedUniverse());
            location.reload();
          }
          doIt();
        } else {
          doIt();
        }
      }
    );
  };
}

interface initAugurParams {
  augurNode: string | null;
  ethereumNodeHttp: string | null;
  ethereumNodeWs: string | null;
  useWeb3Transport: Boolean;
}

export function initAugur(
  history: any,
  { augurNode, ethereumNodeHttp, ethereumNodeWs, useWeb3Transport }: initAugurParams,
  callback = logError
) {
  return (dispatch: Function, getState: Function) => {
    const env = networkConfig[`${process.env.ETHEREUM_NETWORK}`];
    console.log(env);
    env.useWeb3Transport = useWeb3Transport;
    env["augur-node"] = defaultTo(augurNode, env["augur-node"]);
    env["ethereum-node"].http = defaultTo(
      ethereumNodeHttp,
      env["ethereum-node"].http
    );

    env["ethereum-node"].ws = defaultTo(
      ethereumNodeWs,
      // If only the http param is provided we need to prevent this "default from taking precedence.
      isEmpty(ethereumNodeHttp) ? env["ethereum-node"].ws : ""
    );

    dispatch(updateEnv(env));
    connectAugur(history, env, true, callback)(dispatch, getState);
  };
}
