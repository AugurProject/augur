import { useEffect, useState, useRef } from 'react';
import {
  checkAllowance,
  isERC1155ContractApproved,
} from './use-approval-callback';
import { Cash, MarketInfo, TransactionDetails } from '../utils/types';
import { PARA_CONFIG } from './constants';
import { ApprovalState, ETH, TX_STATUS } from '../utils/constants';
import { useAppStatusStore } from './app-status';
import { useUserStore } from './user';
import { useGraphDataStore } from './graph-data';
import { augurSdkLite } from '../utils/augurlitesdk';
import { getUserBalances } from '../utils/contract-calls';
const { APPROVED } = ApprovalState;

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

function checkIsMobile(setIsMobile) {
  const isMobile =
    (
      window.getComputedStyle(document.body).getPropertyValue('--is-mobile') ||
      ''
    ).indexOf('true') !== -1;
  setIsMobile(isMobile);
}

// CUSTOM HOOKS
export function useHandleResize() {
  const {
    actions: { setIsMobile },
  } = useAppStatusStore();
  useEffect(() => {
    const handleResize = () => checkIsMobile(setIsMobile);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
}

export function useCanExitCashPosition(cash: Cash) {
  const { account, loginAccount, transactions } = useUserStore();
  const { blocknumber } = useGraphDataStore();
  const approvedAccount = useRef(null);
  const [canExitPosition, setCanExitPosition] = useState(false);
  const [calledBlocknumber, setCalledBlocknumber] = useState(blocknumber);
  const {
    addresses: { WethWrapperForAMMExchange, AMMFactory },
  } = PARA_CONFIG;

  useEffect(() => {
    const checkCanCashExit = async ({ name, shareToken }) => {
      if (!name || !shareToken) return setCanExitPosition(false);
      const approvalCheck = await isERC1155ContractApproved(
        shareToken,
        name === ETH ? WethWrapperForAMMExchange : AMMFactory,
        loginAccount,
        transactions
      );
      setCanExitPosition(Boolean(ApprovalState.APPROVED === approvalCheck));
      if (Boolean(approvalCheck))
        approvedAccount.current = loginAccount.account;
    };

    if (
      !!account &&
      !!cash &&
      (account !== approvedAccount.current || calledBlocknumber !== blocknumber)
    ) {
      checkCanCashExit(cash);
      setCalledBlocknumber(blocknumber);
    }
  }, [
    canExitPosition,
    setCanExitPosition,
    transactions,
    account,
    blocknumber,
    cash,
  ]);

  return canExitPosition;
}

export function useCanEnterCashPosition({ name, address }: Cash) {
  const { account, loginAccount, transactions } = useUserStore();
  const { blocknumber } = useGraphDataStore();
  const approvedAccount = useRef(null);
  const [canEnterPosition, setCanEnterPosition] = useState(name === ETH);
  const {
    addresses: { AMMFactory },
  } = PARA_CONFIG;
  useEffect(() => {
    const checkCanCashEnter = async () => {
      const approvalCheck = await checkAllowance(
        address,
        AMMFactory,
        loginAccount,
        transactions
      );
      setCanEnterPosition(approvalCheck === APPROVED || name === ETH);
      if (approvalCheck === APPROVED || name === ETH)
        approvedAccount.current = loginAccount.account;
    };
    if (!!account && !!address && account !== approvedAccount.current) {
      checkCanCashEnter();
    }
  }, [
    canEnterPosition,
    setCanEnterPosition,
    transactions,
    account,
    blocknumber,
  ]);

  return canEnterPosition;
}

export function useUserBalances(ammExchanges, cashes, markets) {
  const {
    loginAccount,
    actions: { updateUserBalances },
  } = useUserStore();
  useEffect(() => {
    const createClient = (provider, config, account) =>
      augurSdkLite.makeLiteClient(provider, config, account);
    const fetchUserBalances = (
      library,
      account,
      ammExchanges,
      cashes,
      markets
    ) => getUserBalances(library, account, ammExchanges, cashes, markets);
    if (loginAccount?.library && loginAccount?.account) {
      if (!augurSdkLite.ready())
        createClient(loginAccount.library, PARA_CONFIG, loginAccount?.account);
      fetchUserBalances(
        loginAccount.library,
        loginAccount.account,
        ammExchanges,
        cashes,
        markets
      ).then((userBalances) => updateUserBalances(userBalances));
    }
  }, [
    loginAccount?.account,
    loginAccount?.library,
    ammExchanges,
    cashes,
    markets,
    PARA_CONFIG,
  ]);
}

export function useFinalizeUserTransactions(refresh: any = null) {
  const {
    account,
    loginAccount,
    transactions,
    actions: { finalizeTransaction },
  } = useUserStore();
  useEffect(() => {
    transactions
      .filter((t) => t.status === TX_STATUS.PENDING)
      .forEach((t: TransactionDetails) => {
        loginAccount.library
          .getTransactionReceipt(t.hash)
          .then((receipt) => {
            if (receipt) {
              finalizeTransaction(t.hash, receipt);
            }
          })
          .catch((e) => {
            // for debugging to see if error occurs when MM drops tx
            console.log('transaction error', e);
          });
      });
  }, [loginAccount, refresh, transactions, account]);
}

export function useScrollToTopOnMount(...optionsTriggers) {
  useEffect(() => {
    // initial render only.
    document.getElementById('mainContent')?.scrollTo(0, 0);
    window.scrollTo(0, 1);
  }, [...optionsTriggers]);
}
