import { useState, useEffect, useRef } from 'react';
// import { APPROVED } from '../common/buttons';
import {
  checkAllowance,
  isERC1155ContractApproved,
} from '../hooks/use-approval-callback';
import { Cash, MarketInfo, TransactionDetails } from '../types';
import { NETWORK_BLOCK_REFRESH_TIME, PARA_CONFIG } from './constants';
// import { ApprovalState, ETH } from '../constants';
import { useUserStore } from './user';
import { useGraphDataStore } from './graph-data';
import {
  getLegacyRepBalance, getRepBalance, isRepV2Approved, convertV1ToV2, convertV1ToV2Approve
} from '../../utils/contract-calls';

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

export const getRelatedMarkets = (
  market: MarketInfo,
  markets: Array<MarketInfo>
) =>
  keyedObjToKeyArray(markets)
    .filter((mrkt) => mrkt.includes(market.marketId))
    .map((mid) => markets[mid]);

export const dispatchMiddleware = (dispatch) => (action) =>
  middleware(dispatch, action);

export const keyedObjToArray = (KeyedObject: object) =>
  Object.entries(KeyedObject).map((i) => i[1]);

export const keyedObjToKeyArray = (KeyedObject: object) =>
  Object.entries(KeyedObject).map((i) => i[0]);

export const arrayToKeyedObject = (ArrayOfObj: Array<{ id: string }>) =>
  arrayToKeyedObjectByProp(ArrayOfObj, 'id');

export const arrayToKeyedObjectByProp = (ArrayOfObj: any[], prop: string) =>
  ArrayOfObj.reduce((acc, obj) => {
    acc[obj[prop]] = obj;
    return acc;
  }, {});

export async function getRepBalances(provider, address) {
  const rep = await getRepBalance(provider, address);
  const legacyRep = await getLegacyRepBalance(provider, address);  
 return {
    rep: rep.toString(), 
    legacyRep: legacyRep.toString()
  }
}


export function useUserBalances() {
  const {
    loginAccount,
    actions: { updateUserBalances },
  } = useUserStore();
  useEffect(() => {
    let isMounted = true;
    const fetchUserBalances = (
      library,
      account,
    ) => getRepBalances(library, account);
    if (loginAccount?.library && loginAccount?.account) {
      fetchUserBalances(
        loginAccount.library,
        loginAccount.account
      ).then((userBalances) => isMounted && updateUserBalances(userBalances));
    }

    return () => {
      isMounted = false;
    };
  }, [
    loginAccount?.account,
    loginAccount?.library,
    PARA_CONFIG,
  ]);
}

export function useFinalizeUserTransactions() {
  const { blocknumber } = useGraphDataStore();
  const {
    loginAccount,
    transactions,
    actions: { finalizeTransaction },
  } = useUserStore();
  useEffect(() => {
    if (loginAccount?.account && blocknumber && transactions?.length > 0) {
      transactions
        .filter((t) => !t.confirmedTime)
        .forEach((t: TransactionDetails) => {
          loginAccount.library.getTransactionReceipt(t.hash).then((receipt) => {
            if (receipt) finalizeTransaction(t.hash);
          });
        });
    }
  }, [loginAccount, blocknumber, transactions]);
}

export function useScrollToTopOnMount(...optionsTriggers) {
  useEffect(() => {
    // initial render only.
    document.getElementById('mainContent')?.scrollTo(0, 0);
    window.scrollTo(0, 1);
  }, [...optionsTriggers]);
}
