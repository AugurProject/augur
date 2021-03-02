import { useEffect } from 'react';
import { TransactionDetails } from '../types';
import { PARA_CONFIG } from './constants';
import { useUserStore } from './user';
import {
  getLegacyRepBalance,
  getRepBalance,
  isRepV2Approved,
} from '../../utils/contract-calls';
import { useAppStatusStore } from './app-status';

const isAsync = (obj) =>
  !!obj &&
  (typeof obj === 'object' || typeof obj === 'function') &&
  obj.constructor.name === 'AsyncFunction';

const isPromise = (obj) =>
  !!obj &&
  (typeof obj === 'object' || typeof obj === 'function') &&
  typeof obj.then === 'function';

export const middleware = (dispatch, action) => {
  if (action.payload && isAsync(action.payload)) {
    (async () => {
      const v = await action.payload();
      dispatch({ ...action, payload: v });
    })();
  } else if (action.payload && isPromise(action.payload)) {
    action.payload.then((v) => {
      dispatch({ ...action, payload: v });
    });
  } else {
    dispatch({ ...action });
  }
};

export const getSavedUserInfo = (account) =>
  JSON.parse(window.localStorage.getItem(account)) || null;

export const dispatchMiddleware = (dispatch) => (action) =>
  middleware(dispatch, action);

export async function getRepBalances(provider, address) {
  const rep = await getRepBalance(provider, address);
  const legacyRep = await getLegacyRepBalance(provider, address);
  return {
    rep: rep.toString(),
    legacyRep: legacyRep.toString(),
  };
}

export function useUserBalances() {
  const {
    loginAccount,
    actions: { updateUserBalances },
  } = useUserStore();
  const { timestamp } = useAppStatusStore();
  useEffect(() => {
    let isMounted = true;
    const fetchUserBalances = (library, account) =>
      getRepBalances(library, account);
    if (loginAccount?.library && loginAccount?.account) {
      fetchUserBalances(loginAccount.library, loginAccount.account).then(
        (userBalances) => isMounted && updateUserBalances(userBalances)
      );
    }

    return () => {
      isMounted = false;
    };
  }, [loginAccount?.account, loginAccount?.library, PARA_CONFIG, timestamp]);
}

export function useFinalizeUserTransactions() {
  const {
    loginAccount,
    transactions,
    actions: { finalizeTransaction },
  } = useUserStore();
  const { timestamp } = useAppStatusStore();
  useEffect(() => {
    if (loginAccount?.account && transactions?.length > 0) {
      transactions
        .filter((t) => !t.confirmedTime)
        .forEach((t: TransactionDetails) => {
          loginAccount.library.getTransactionReceipt(t.hash).then((receipt) => {
            if (receipt) finalizeTransaction(t.hash);
          });
        });
    }
  }, [loginAccount, timestamp, transactions]);
}

export function useUpdateApprovals() {
  const {
    loginAccount,
    actions: { updateApproval },
  } = useUserStore();
  const { timestamp } = useAppStatusStore();
  useEffect(() => {
    let isMounted = true;
    const checkApproval = (library, account) =>
      isRepV2Approved(library, account);
    if (loginAccount?.library && loginAccount?.account) {
      checkApproval(loginAccount.library, loginAccount.account).then(
        (isApproved) => isMounted && updateApproval(isApproved)
      );
    }
    return () => {
      isMounted = false;
    };
  }, [loginAccount?.account, loginAccount?.library, PARA_CONFIG, timestamp]);
}
