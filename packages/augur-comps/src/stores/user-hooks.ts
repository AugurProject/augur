import { dispatchMiddleware, getSavedUserInfo } from './utils';
import { useReducer } from 'react';
import { windowRef } from '../utils/window-ref';
import { USER_ACTIONS, USER_KEYS, DEFAULT_USER_STATE } from './constants';
import { UserBalances, TransactionDetails } from '../utils/types';
import { augurSdkLite } from '../utils/augurlitesdk';
import { TX_STATUS } from '../utils/constants';

const {
  ADD_TRANSACTION,
  REMOVE_TRANSACTION,
  FINALIZE_TRANSACTION,
  UPDATE_SEEN_POSITION_WARNING,
  ADD_SEEN_POSITION_WARNINGS,
  SET_LOGIN_ACCOUNT,
  UPDATE_USER_BALANCES,
  UPDATE_TRANSACTION,
  LOGOUT,
} = USER_ACTIONS;
const {
  ACCOUNT,
  BALANCES,
  LOGIN_ACCOUNT,
  SEEN_POSITION_WARNINGS,
  TRANSACTIONS,
} = USER_KEYS;

const updateLocalStorage = (userAccount, updatedState) => {
  const userData = JSON.parse(window.localStorage.getItem(userAccount)) || null;
  if (userData) {
    window.localStorage.setItem(
      userAccount,
      JSON.stringify({
        ...userData,
        seenPositionWarnings: updatedState[SEEN_POSITION_WARNINGS],
        transactions: updatedState[TRANSACTIONS],
      })
    );
  } else if (!!userAccount) {
    window.localStorage.setItem(
      userAccount,
      JSON.stringify({
        account: userAccount,
        seenPositionWarnings: updatedState[SEEN_POSITION_WARNINGS],
        transactions: updatedState[TRANSACTIONS],
      })
    );
  }
};

export function UserReducer(state, action) {
  let updatedState = { ...state };
  const now = new Date().getTime();

  switch (action.type) {
    case LOGOUT: {
      augurSdkLite.destroy();
      window.localStorage.setItem('lastUser', null);
      updatedState = { ...DEFAULT_USER_STATE };
      break;
    }
    case SET_LOGIN_ACCOUNT: {
      const account = action?.account?.account;
      updatedState[LOGIN_ACCOUNT] = action?.account;
      const savedInfo = getSavedUserInfo(account);
      updatedState[ACCOUNT] = account || null;
      if (savedInfo) {
        updatedState[SEEN_POSITION_WARNINGS] =
          savedInfo?.seenPositionWarnings || state[SEEN_POSITION_WARNINGS];
        const accTransactions = savedInfo.transactions.map((t) => ({
          ...t,
          timestamp: now,
        }));
        updatedState[TRANSACTIONS] = accTransactions;
      } else if (!!account && action?.account?.library?.provider?.isMetamask) {
        // no saved info for this account, must be first login...
        window.localStorage.setItem(
          account,
          JSON.stringify({ account })
        );
      }
      break;
    }
    case UPDATE_USER_BALANCES: {
      updatedState[BALANCES] = action.userBalances;
      break;
    }
    case UPDATE_TRANSACTION: {
      const transactionIndex = updatedState[TRANSACTIONS].findIndex(
        (transaction) => transaction.hash === action.hash
      );
      if (transactionIndex >= 0) {
        updatedState[TRANSACTIONS][transactionIndex] = {
          ...updatedState[TRANSACTIONS][transactionIndex],
          ...action.updates,
          timestamp: now,
        };
      }
      break;
    }
    case ADD_TRANSACTION: {
      updatedState[TRANSACTIONS] = [
        ...updatedState[TRANSACTIONS],
        { ...action.transaction, timestamp: now },
      ];
      break;
    }
    case REMOVE_TRANSACTION: {
      if (action.hash) {
        updatedState[TRANSACTIONS] = updatedState[TRANSACTIONS].filter(
          (tx) => tx.hash !== action.hash
        );
      }
      break;
    }
    case FINALIZE_TRANSACTION: {
      updatedState[TRANSACTIONS].forEach((tx) => {
        if (tx.hash === action.hash) {
          tx.confirmedTime = now;
          tx.status = action.receipt.status ? TX_STATUS.CONFIRMED : TX_STATUS.FAILURE;
          tx.receipt = action.receipt;
        }
      });
      break;
    }
    case UPDATE_SEEN_POSITION_WARNING: {
      if (updatedState[SEEN_POSITION_WARNINGS][action.id]) {
        updatedState[SEEN_POSITION_WARNINGS][action.id][action.warningType] = action.seenPositionWarning;
      } else {
        updatedState[SEEN_POSITION_WARNINGS][action.id] = {
          [action.warningType]: action.seenPositionWarning
        }
      }
      break;
    }
    case ADD_SEEN_POSITION_WARNINGS: {
      updatedState[SEEN_POSITION_WARNINGS] = action.seenPositionWarnings;
      break;
    }
    default:
      console.log(`Error: ${action.type} not caught by Graph Data reducer`);
  }
  windowRef.user = updatedState;
  const userAccount = updatedState[LOGIN_ACCOUNT]?.account;
  if (userAccount) {
    updateLocalStorage(userAccount, updatedState);
  }
  return updatedState;
}

export const useUser = (defaultState = DEFAULT_USER_STATE) => {
  const [state, pureDispatch] = useReducer(UserReducer, defaultState);
  const dispatch = dispatchMiddleware(pureDispatch);
  windowRef.user = state;

  return {
    ...state,
    actions: {
      updateLoginAccount: (account) =>
        dispatch({ type: SET_LOGIN_ACCOUNT, account }),
      updateUserBalances: (userBalances: UserBalances) =>
        dispatch({ type: UPDATE_USER_BALANCES, userBalances }),
      updateTransaction: (hash, updates) =>
        dispatch({ type: UPDATE_TRANSACTION, hash, updates }),
      addTransaction: (transaction: TransactionDetails) =>
        dispatch({ type: ADD_TRANSACTION, transaction }),
      removeTransaction: (hash: string) =>
        dispatch({ type: REMOVE_TRANSACTION, hash }),
      finalizeTransaction: (hash, receipt) =>
        dispatch({ type: FINALIZE_TRANSACTION, hash, receipt }),
      updateSeenPositionWarning: (id, seenPositionWarning, warningType) =>
        dispatch({
          type: UPDATE_SEEN_POSITION_WARNING,
          id,
          seenPositionWarning,
          warningType
        }),
      addSeenPositionWarnings: (seenPositionWarnings) =>
        dispatch({ type: ADD_SEEN_POSITION_WARNINGS, seenPositionWarnings }),
      logout: () => dispatch({ type: LOGOUT }),
    },
  };
};
