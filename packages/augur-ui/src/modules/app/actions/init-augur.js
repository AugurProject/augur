import * as AugurJS from "services/augurjs";
import { constants } from "services/constants";
import { updateEnv } from "modules/app/actions/update-env";
import {
  updateConnectionStatus,
  updateAugurNodeConnectionStatus
} from "modules/app/actions/update-connection";
import { getAugurNodeNetworkId } from "modules/app/actions/get-augur-node-network-id";
import { updateContractAddresses } from "modules/contracts/actions/update-contract-addresses";
import {
  updateFunctionsAPI,
  updateEventsAPI
} from "modules/contracts/actions/update-contract-api";
import { useUnlockedAccount } from "modules/auth/actions/use-unlocked-account";
import { logout } from "modules/auth/actions/logout";
import { verifyMatchingNetworkIds } from "modules/app/actions/verify-matching-network-ids";
import { checkIfMainnet } from "modules/app/actions/check-if-mainnet";
import { loadUniverse } from "modules/app/actions/load-universe";
import { registerTransactionRelay } from "modules/transactions/actions/register-transaction-relay";
import { updateModal } from "modules/modal/actions/update-modal";
import { closeModal } from "modules/modal/actions/close-modal";
import logError from "utils/log-error";
import networkConfig from "config/network";
import { version } from "src/version";
import { updateVersions } from "modules/app/actions/update-versions";

import { defaultTo, isEmpty } from "lodash";
import { NETWORK_NAMES } from "modules/app/constants/network";
import {
  MODAL_NETWORK_MISMATCH,
  MODAL_NETWORK_DISCONNECTED,
  MODAL_DISCLAIMER,
  MODAL_NETWORK_DISABLED
} from "modules/modal/constants/modal-types";
import { DISCLAIMER_SEEN } from "modules/modal/constants/local-storage-keys";
import { windowRef } from "utils/window-ref";
import { setSelectedUniverse } from "modules/auth/actions/selected-universe-management";

const { ACCOUNT_TYPES } = constants;
const ACCOUNTS_POLL_INTERVAL_DURATION = 10000;
const NETWORK_ID_POLL_INTERVAL_DURATION = 10000;

function pollForAccount(dispatch, getState, callback) {
  const { loginAccount } = getState();
  let accountType =
    loginAccount && loginAccount.meta && loginAccount.meta.accountType;

  loadAccount(dispatch, null, accountType, (err, loadedAccount) => {
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
        loadAccount(dispatch, account, accountType, (err, loadedAccount) => {
          if (err) console.error(err);
          account = loadedAccount;
        });
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

function loadAccount(dispatch, existing, accountType, callback) {
  let loggedInAccount = null;
  const usingMetaMask = accountType === ACCOUNT_TYPES.META_MASK;
  if (windowRef.localStorage && windowRef.localStorage.getItem) {
    loggedInAccount = windowRef.localStorage.getItem("loggedInAccount");
  }
  AugurJS.augur.rpc.eth.accounts((err, accounts) => {
    if (err) return callback(err);
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
  });
}

function pollForNetwork(dispatch, getState) {
  setInterval(() => {
    const { modal } = getState();
    dispatch(
      verifyMatchingNetworkIds((err, expectedNetworkId) => {
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
        checkIfMainnet((err, isMainnet) => {
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
  history,
  env,
  isInitialConnection = false,
  callback = logError
) {
  return (dispatch, getState) => {
    const { modal, loginAccount } = getState();
    AugurJS.connect(
      env,
      (err, ConnectionInfo) => {
        if (err || !ConnectionInfo.augurNode || !ConnectionInfo.ethereumNode) {
          return callback(err, ConnectionInfo);
        }
        const ethereumNodeConnectionInfo = ConnectionInfo.ethereumNode;
        dispatch(updateConnectionStatus(true));
        dispatch(updateContractAddresses(ethereumNodeConnectionInfo.contracts));
        dispatch(updateFunctionsAPI(ethereumNodeConnectionInfo.abi.functions));
        dispatch(updateEventsAPI(ethereumNodeConnectionInfo.abi.events));
        dispatch(updateAugurNodeConnectionStatus(true));
        dispatch(getAugurNodeNetworkId());
        dispatch(registerTransactionRelay());
        AugurJS.augur.augurNode.getSyncData((err, res) => {
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
          AugurJS.augur.contracts.addresses[AugurJS.augur.rpc.getNetworkID()]
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
              AugurJS.augur.rpc.getNetworkID()
          ];
          universeId = !storedUniverseId ? universeId : storedUniverseId;
        }

        const doIt = () => {
          dispatch(loadUniverse(universeId, history));
          if (modal && modal.type === MODAL_NETWORK_DISCONNECTED)
            dispatch(closeModal());
          if (isInitialConnection) {
            pollForAccount(dispatch, getState);
            pollForNetwork(dispatch, getState);
          }
          callback();
        };

        if (process.env.NODE_ENV === "development") {
          AugurJS.augur.api.Augur.isKnownUniverse(
            {
              _universe: universeId
            },
            (err, data) => {
              if (data === false) {
                dispatch(setSelectedUniverse());
                location.reload();
              }

              doIt();
            }
          );
        } else {
          doIt();
        }
      }
    );
  };
}

export function initAugur(
  history,
  { augurNode, ethereumNodeHttp, ethereumNodeWs, useWeb3Transport },
  callback = logError
) {
  return (dispatch, getState) => {
    const env = networkConfig[`${process.env.ETHEREUM_NETWORK}`];
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
