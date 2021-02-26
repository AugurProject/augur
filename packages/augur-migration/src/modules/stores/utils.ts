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
import { processGraphMarkets } from '../../utils/process-data';
import { getMarketsData } from '../apollo/client';
import { augurSdkLite } from '../../utils/augurlitesdk';
import {
  getLegacyRepBalance,
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

export const getCurrentAmms = (
  market: MarketInfo,
  markets: Array<MarketInfo>
) => getRelatedMarkets(market, markets).map((m) => m.amm.cash.name);

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

export function useGraphHeartbeat() {
  const {
    ammExchanges,
    cashes,
    markets,
    blocknumber,
    actions: { updateGraphHeartbeat },
  } = useGraphDataStore();
  useEffect(() => {
    let isMounted = true;
    // get data immediately, then setup interval
    getMarketsData((graphData, block, errors) => {
      isMounted && !!errors
        ? updateGraphHeartbeat(
            { ammExchanges, cashes, markets },
            blocknumber,
            errors
          )
        : updateGraphHeartbeat(processGraphMarkets(graphData), block, errors);
    });
    const intervalId = setInterval(() => {
      getMarketsData((graphData, block, errors) => {
        isMounted && !!errors
          ? updateGraphHeartbeat(
              { ammExchanges, cashes, markets },
              blocknumber,
              errors
            )
          : updateGraphHeartbeat(processGraphMarkets(graphData), block, errors);
      });
    }, NETWORK_BLOCK_REFRESH_TIME[PARA_CONFIG.networkId] || NETWORK_BLOCK_REFRESH_TIME[1]);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);
}

export function useUserBalances() {
  const {
    loginAccount,
    actions: { updateUserBalances },
  } = useUserStore();
  const { markets, cashes, ammExchanges } = useGraphDataStore();
  useEffect(() => {
    let isMounted = true;
    const createClient = (provider, config, account) => {
      augurSdkLite.makeLiteClient(provider, config, account);
    };
    if (loginAccount?.library && loginAccount?.account) {
      if (!augurSdkLite.ready())
        createClient(loginAccount.library, PARA_CONFIG, loginAccount?.account);
        getLegacyRepBalance(loginAccount.library, loginAccount.account);
    }

    return () => {
      isMounted = false;
    };
  }, [
    loginAccount?.account,
    loginAccount?.library,
    ammExchanges,
    cashes,
    markets,
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
