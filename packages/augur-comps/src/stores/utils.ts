import { useEffect, useState, useRef } from 'react';
import {
  checkIsERC20Approved,
  checkIsERC1155Approved,
  checkAllowance,
  isERC1155ContractApproved,
} from './use-approval-callback';
import { Cash, MarketInfo, TransactionDetails, AmmExchange } from '../utils/types';
import { PARA_CONFIG } from './constants';
import { ETH, TX_STATUS, ApprovalAction, ApprovalState } from '../utils/constants';
import { useAppStatusStore } from './app-status';
import { useUserStore } from './user';
import { augurSdkLite } from '../utils/augurlitesdk';
import { getUserBalances } from '../utils/contract-calls';

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

export function useCanExitCashPosition(cash: Cash, refresh: any = null) {
  const { account, loginAccount } = useUserStore();
  const approvedAccount = useRef(null);
  const [canExitPosition, setCanExitPosition] = useState(false);
  const {
    addresses: { WethWrapperForAMMExchange, AMMFactory },
  } = PARA_CONFIG;
  useEffect(() => {
    const checkApproval = async ({ name, shareToken }: Cash) => {
      if (!name || !shareToken || !account) return setCanExitPosition(false);
      const isApproved = await checkIsERC1155Approved(
        shareToken,
        name === ETH ? WethWrapperForAMMExchange : AMMFactory,
        account,
        loginAccount?.library
      );
      setCanExitPosition(isApproved);
      if (isApproved || canExitPosition) {
        approvedAccount.current = account;
      }
    };

    if (!canExitPosition && account !== approvedAccount.current) {
      checkApproval(cash);
    }
  }, [refresh, cash.shareToken, account, loginAccount]);
  
  return canExitPosition;
}

export function useCanEnterCashPosition(
  { name, address }: Cash,
  refresh: any = null
) {
  const { account, loginAccount } = useUserStore();
  const approvedAccount = useRef(null);
  const [canEnterPosition, setCanEnterPosition] = useState(name === ETH);
  const {
    addresses: { AMMFactory },
  } = PARA_CONFIG;

  useEffect(() => {
    const checkApproval = async (address: string) => {
      if (!address || !account) return setCanEnterPosition(false);
      const isApproved = await checkIsERC20Approved(
        address,
        AMMFactory,
        account,
        loginAccount?.library
      );
      setCanEnterPosition(isApproved);
      if (isApproved || canEnterPosition) {
        approvedAccount.current = account;
      }
    };

    if (!canEnterPosition && account !== approvedAccount.current) {
      checkApproval(address);
    }
  }, [address, account, refresh, loginAccount]);

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

const {
  ADD_LIQUIDITY,
  REMOVE_LIQUIDITY,
  ENTER_POSITION,
  EXIT_POSITION,
  TRANSFER_LIQUIDITY,
} = ApprovalAction;
export const { UNKNOWN, PENDING, APPROVED } = ApprovalState;
export function useApprovalStatus({
  amm,
  cash,
  actionType,
}: {
  amm?: AmmExchange;
  cash: Cash;
  actionType: ApprovalAction;
}) {
  const {
    account,
    loginAccount,
    transactions,
  } = useUserStore();
  const [isApproved, setIsApproved] = useState(UNKNOWN);
  const forceCheck = useRef(false);
  const {
    addresses: { WethWrapperForAMMExchange, AMMFactory },
  } = PARA_CONFIG;
  const {
    name: marketCashType,
    address: tokenAddress,
    shareToken,
  } = cash;
  const invalidPoolId = amm?.invalidPool?.id;
  const ammId = amm?.id;
  const isETH = marketCashType === ETH;

  useEffect(() => {
    let isMounted = true;
    // if we switch make sure to check if we are approved.
    if (isApproved === APPROVED && isMounted) forceCheck.current = true;
    return () => {
      isMounted = false;
    };
  }, [marketCashType, tokenAddress, shareToken, ammId, invalidPoolId, actionType, account]);

  useEffect(() => {
    let isMounted = true;
    const checkIfApproved = async () => {
      let approvalCheck = UNKNOWN;
      let address = null;
      let spender = AMMFactory;
      let checkApprovalFunction = checkAllowance;
      switch (actionType) {
        case EXIT_POSITION: {
          checkApprovalFunction = isERC1155ContractApproved;
          address = shareToken;
          spender = isETH ? WethWrapperForAMMExchange : AMMFactory;
          break;
        }
        case REMOVE_LIQUIDITY: {
          address = invalidPoolId;
          break;
        }
        case TRANSFER_LIQUIDITY: {
          address = ammId;
          break;
        }
        case ENTER_POSITION:
        case ADD_LIQUIDITY: {
          address = isETH ? null : tokenAddress;
          checkApprovalFunction = isETH ? async () => APPROVED : checkAllowance;
          break;
        }
        default: {
          break;
        }
      }

      approvalCheck = await checkApprovalFunction(
        address,
        spender,
        loginAccount,
        transactions
      );
      
      (forceCheck.current || approvalCheck !== isApproved) && isMounted && setIsApproved(approvalCheck);
      if (forceCheck.current) forceCheck.current = false;
    };

    if ((forceCheck.current || isApproved !== APPROVED) && account) {
      checkIfApproved();
    }
    return () => {
      isMounted = false;
    };
  }, [
    account,
    isApproved,
    actionType,
    invalidPoolId,
    ammId,
    PARA_CONFIG,
    marketCashType,
    tokenAddress,
    shareToken
  ]);

  return isApproved;
}