import { analytics } from './analytics';
import { createBigNumber } from 'utils/create-big-number';
import { Analytic } from 'modules/types';
import { isLocalHost } from 'utils/is-localhost';
import { BUY_INDEX, SELL_INDEX } from 'modules/common/constants';
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info';
import { selectMarket } from 'modules/markets/selectors/market';
import { getInfo } from 'modules/alerts/actions/set-alert-text';
import { TXEventName } from '@augurproject/sdk-lite';
import { AppStatus } from 'modules/app/store/app-status';

export const page = (eventName, payload) => {
  track(eventName, payload, ANALYTIC_EVENT_TYPES.PAGE);
};

export const track = (eventName, payload, type?) => {
  const {
    blockchain: { currentAugurTimestamp: addedTimestamp },
  } = AppStatus.get();
  const analytic = {
    eventName,
    payload: {
      ...payload,
      addedTimestamp,
    },
    type: type || ANALYTIC_EVENT_TYPES.TRACK,
  };

  sendAnalytic(analytic);
};

export const sendAnalytic = (analytic: Analytic) => {
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

export const addedDaiEvent = (dai: string) => {
  const {
    loginAccount: { balances },
  } = AppStatus.get();
  if (balances.dai && createBigNumber(balances.dai).gt(createBigNumber(dai))) {
    track(ADDED_DAI, {}, null);
  }
};

export const marketLinkCopied = (
  marketId: string,
  location: string
) => track(MARKET_LINK_COPIED, { location: location, marketId: marketId }, null);


export const sendFacebookShare = (
  marketAddress: string,
  marketDescription: string
) => {
  const {
    loginAccount: { address: affiliate },
  } = AppStatus.get();
  track(MARKET_SHARED, {
    source: MARKET_PAGE,
    service: 'facebook',
    marketId: marketAddress,
    marketDescription: marketDescription,
    affiliate,
  });
};

export const sendTwitterShare = (
  marketAddress: string,
  marketDescription: string
) => {
  const {
    loginAccount: { address: affiliate },
  } = AppStatus.get();
  track(MARKET_SHARED, {
    source: MARKET_PAGE,
    service: 'twitter',
    marketId: marketAddress,
    marketDescription: marketDescription,
    affiliate,
  });
};

export const marketCreationStarted = (
  templateName: string,
  isTemplate: boolean
) =>
  track(MARKET_CREATION_STARTED, {
    templateName,
    isTemplate,
  });

export const marketCreationSaved = (
  templateName: string,
  isTemplate: boolean
) => {
  track(MARKET_CREATION_SAVED, {
    templateName,
    isTemplate,
  });
};

export const marketCreationCreated = (
  marketId: string,
  extraInfo: string
) => {
  const info = JSON.parse(extraInfo);
  track(MARKET_CREATION_CREATED, {
    marketId,
    isTemplate: info.template !== null,
    templateHash: info.template?.hash,
    templateName: info.template?.question,
  });
};

export const marketListViewed = (
  search,
  selectedCategories,
  maxLiquiditySpread,
  marketFilter,
  sortBy,
  maxFee,
  templateFilter,
  includeInvalidMarkets,
  resultCount,
  pageNumber
) => {
  track(MARKET_LIST_VIEWED, {
    search,
    selectedCategories,
    maxLiquiditySpread,
    marketFilter,
    sortBy,
    maxFee,
    templateFilter,
    includeInvalidMarkets,
    resultCount,
    pageNumber,
  });
};

export const orderAmountEntered = (
  type: string,
  marketId: string
) => {
  track(ORDER_AMOUNT_ENTERED, {
    marketId,
    type,
  });
};

export const orderPriceEntered = (
  type: string,
  marketId: string
) => {
  track(ORDER_PRICE_ENTERED, {
    marketId,
    type,
  });
};

export const orderSubmitted = (
  type: string,
  marketId: string
) => {
  track(ORDER_SUBMITTED, {
    marketId,
    type,
  });
};

export const orderCreated = (
  marketId,
  order
) => {
  track(ORDER_CREATED, {
    marketId,
    order: order,
  });
};

export const orderFilled = (
  marketId,
  log,
  isCreator
) => {
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

    track(ORDER_FILLED, {
      marketId,
      order: orderInfo,
      isCreator,
    });
  });
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
export const AUGUR_IS_P2P = 'Onboarding - Augur is p2p';
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
