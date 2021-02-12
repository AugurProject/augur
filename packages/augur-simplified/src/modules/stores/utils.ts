import { useState, useEffect } from 'react';
import { APPROVED } from '../common/buttons';
import {
  checkAllowance,
  isERC1155ContractApproved,
} from '../hooks/use-approval-callback';
import { MarketInfo } from '../types';
import { PARA_CONFIG } from './constants';
import { useUserStore } from './user';

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

// CUSTOM HOOKS

export function useCanExitCashPosition(shareToken) {
  const {
    account,
    loginAccount,
    transactions,
    actions: { updateTransaction },
  } = useUserStore();
  const [canExitPosition, setCanExitPosition] = useState(false);
  const {
    addresses: { WethWrapperForAMMExchange },
  } = PARA_CONFIG;
  useEffect(() => {
    const checkCanCashExit = async () => {
      const approvalCheck = await isERC1155ContractApproved(
        shareToken,
        WethWrapperForAMMExchange,
        loginAccount,
        transactions,
        updateTransaction
      );
      setCanExitPosition(Boolean(approvalCheck));
    };
    if (!!account && !canExitPosition && !!shareToken) {
      checkCanCashExit();
    }
  }, [
    canExitPosition,
    setCanExitPosition,
    updateTransaction,
    transactions,
    account,
  ]);

  return canExitPosition;
}

export function useCanEnterCashPosition(cashAddress) {
  const {
    account,
    loginAccount,
    transactions,
    actions: { updateTransaction },
  } = useUserStore();
  const [canEnterPosition, setCanEnterPosition] = useState(false);
  const {
    addresses: { AMMFactory },
  } = PARA_CONFIG;
  useEffect(() => {
    const checkCanCashExit = async () => {
      const approvalCheck = await checkAllowance(
        cashAddress,
        AMMFactory,
        loginAccount,
        transactions,
        updateTransaction
      );
      setCanEnterPosition(approvalCheck === APPROVED);
    };
    if (!!account && !canEnterPosition && !!cashAddress) {
      checkCanCashExit();
    }
  }, [
    canEnterPosition,
    setCanEnterPosition,
    updateTransaction,
    transactions,
    account,
  ]);

  return canEnterPosition;
}
