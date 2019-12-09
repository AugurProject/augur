import { analytics } from './analytics';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';
import { createBigNumber } from 'utils/create-big-number';
import { Analytic } from 'modules/types';
import { isLocalHost } from 'utils/is-localhost';
import { BUY_INDEX, SELL_INDEX } from 'modules/common/constants';
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info';
import { selectMarket } from 'modules/markets/selectors/market';
import { getInfo } from 'modules/alerts/actions/set-alert-text';
import { TXEventName } from '@augurproject/sdk';

export const page = (eventName, payload): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(track(eventName, payload, ANALYTIC_EVENT_TYPES.PAGE));
};

export const track = (
  eventName,
  payload,
  type?
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { blockchain } = getState();
  const analytic = {
    eventName,
    payload: {
      ...payload,
      addedTimestamp: blockchain.currentAugurTimestamp,
    },
    type: type || ANALYTIC_EVENT_TYPES.TRACK,
  };

  dispatch(sendAnalytic(analytic));
};

export const sendAnalytic = (
  analytic: Analytic
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  try {
    if (!isLocalHost()) {
      if (analytic.type === ANALYTIC_EVENT_TYPES.TRACK) {
        analytics.track(analytic.eventName, {
          userAgent: window.navigator.userAgent,
          ...analytic.payload,
        });
      } else if (analytic.type === ANALYTIC_EVENT_TYPES.PAGE) {
        analytics.page({
          userAgent: window.navigator.userAgent,
          ...analytic.payload,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const addedDaiEvent = (dai: Number): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount } = getState();
  if (
    loginAccount.balances.dai &&
    createBigNumber(loginAccount.balances.dai).gt(createBigNumber(dai))
  ) {
    dispatch(track(ADDED_DAI, {}, null));
  }
};

export const marketLinkCopied = (
  marketId: string,
  location: string
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(
    track(MARKET_LINK_COPIED, { location: location, marketId: marketId }, null)
  );
};

export const sendFacebookShare = (
  marketAddress: string,
  marketDescription: string
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(
    track(MARKET_SHARED, {
      source: MARKET_PAGE,
      service: 'facebook',
      marketId: marketAddress,
      marketDescription: marketDescription,
    })
  );
};

export const sendTwitterShare = (
  marketAddress: string,
  marketDescription: string
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(
    track(MARKET_SHARED, {
      source: MARKET_PAGE,
      service: 'twitter',
      marketId: marketAddress,
      marketDescription: marketDescription,
    })
  );
};

export const marketCreationStarted = (
  templateName: string,
  isTemplate: boolean
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(
    track(MARKET_CREATION_STARTED, {
      templateName,
      isTemplate,
    })
  );
};

export const marketCreationSaved = (
  templateName: string,
  isTemplate: boolean
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(
    track(MARKET_CREATION_SAVED, {
      templateName,
      isTemplate,
    })
  );
};

export const marketCreationCreated = (
  marketId: string,
  extraInfo: string
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const info = JSON.parse(extraInfo);
  dispatch(
    track(MARKET_CREATION_CREATED, {
      marketId,
      isTemplate: info.template !== null,
      templateHash: info.template && info.template.hash,
      templateName: info.template && info.template.question,
    })
  );
};

export const marketListViewed = (
  search,
  selectedCategories,
  maxLiquiditySpread,
  marketFilter,
  marketSort,
  maxFee,
  templateFilter,
  includeInvalidMarkets,
  resultCount,
  pageNumber
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(
    track(MARKET_LIST_VIEWED, {
      search,
      selectedCategories,
      maxLiquiditySpread,
      marketFilter,
      marketSort,
      maxFee,
      templateFilter,
      includeInvalidMarkets,
      resultCount,
      pageNumber,
    })
  );
};

export const orderAmountEntered = (
  type: string,
  marketId: string
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(
    track(ORDER_AMOUNT_ENTERED, {
      marketId,
      type,
    })
  );
};

export const orderPriceEntered = (
  type: string,
  marketId: string
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(
    track(ORDER_PRICE_ENTERED, {
      marketId,
      type,
    })
  );
};

export const orderSubmitted = (
  type: string,
  marketId: string
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(
    track(ORDER_SUBMITTED, {
      marketId,
      type,
    })
  );
};

export const orderCreated = (
  marketId,
  order
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(
    track(ORDER_CREATED, {
      marketId,
      order: order,
    })
  );
};

export const orderFilled = (
  marketId,
  log,
  isCreator
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(
    loadMarketsInfoIfNotLoaded([marketId], () => {
      const marketInfo = selectMarket(marketId);
      if (marketInfo === null) return;

      let updatedOrderType = log.orderType;
      if (!isCreator) {
        updatedOrderType = log.orderType === BUY_INDEX ? SELL_INDEX : BUY_INDEX;
      }

      const params = {
        ...log,
        orderType: updatedOrderType,
        amount: log.amountFilled,
      };
      const orderInfo = getInfo(params, TXEventName.Success, marketInfo);

      dispatch(
        track(ORDER_FILLED, {
          marketId,
          order: orderInfo,
          isCreator,
        })
      );
    })
  );
};

// Basic analytic event types
export const ANALYTIC_EVENT_TYPES = {
  TRACK: 'TRACK',
  PAGE: 'PAGE',
};

// Onboarding event names
export const START_TEST_TRADE = 'Onboarding - Started Test Trade';
export const SKIPPED_TEST_TRADE = 'Onboarding - Skipped Test Trade';
export const FINISHED_TEST_TRADE = 'Onboarding - Finished Test Trade';
export const DO_A_TEST_BET = 'Onboarding - Do A Test Bet';
export const BUY_DAI = 'Onboarding - Buy Dai';
export const AUGUR_USES_DAI = 'Onboarding - Augur Uses Dai';
export const ADD_FUNDS = 'Add Funds Modal';
export const ACCOUNT_CREATED = 'Onboarding - Account Created';
export const ADDED_DAI = 'Added Dai';

// Modal event names
export const MODAL_CLOSED = 'Modal Closed';
export const MODAL_VIEWED = 'Modal Viewed';

// Market/ Market list events
export const MARKET_LINK_COPIED = 'Market Link Copied';
export const MARKET_SHARED = 'Market Shared';
export const MARKET_LIST_VIEWED = 'Market List Viewed';

// Market creation events
export const MARKET_CREATION_STARTED = 'Market Creation - Started';
export const MARKET_CREATION_SAVED = 'Market Creation - Saved';
export const MARKET_CREATION_CREATED = 'Market Creation - Created';

// Order Form Events
export const ORDER_AMOUNT_ENTERED = 'Order Form - Order Amount Entered';
export const ORDER_PRICE_ENTERED = 'Order Form - Order Price Entered';
export const ORDER_SUBMITTED = 'Order Form - Order Submitted';
export const ORDER_CREATED = 'Order Form - Order Created';
export const ORDER_FILLED = 'Order Form - Order Filled';

// Locations
export const MARKET_PAGE = 'Market page';
export const MARKET_LIST_CARD = 'Market List Card';
