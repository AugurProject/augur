import { analytics } from './analytics';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';
import { createBigNumber } from 'utils/create-big-number';
import { Analytic } from 'modules/types';
import { isLocalHost } from 'utils/is-localhost';
import {
  addAnalytic,
  removeAnalytic,
  SEND_DELAY_SECONDS,
} from 'modules/app/actions/analytics-management';

export const page = (eventName, payload): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(
    track(
      eventName,
      {
        ...payload,
        url: window.location.href,
        title: null,
        hash: window.location.hash,
        path: window.location.pathname,
        search: window.location.search,
      },
      ANALYTIC_EVENT_TYPES.PAGE
    )
  );
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
  const analyticId = `${eventName}-${blockchain.currentAugurTimestamp}`;
  const analytic = {
    eventName,
    payload: {
      ...payload,
      addedTimestamp: blockchain.currentAugurTimestamp,
    },
    type: type || ANALYTIC_EVENT_TYPES.TRACK,
  };
  dispatch(addAnalytic(analytic, analyticId));

  setTimeout(() => {
    dispatch(sendAnalytic(analytic));
    dispatch(removeAnalytic(analyticId));
  }, SEND_DELAY_SECONDS * 1000);
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
export const MODAL_CLOSED = 'Modal - Modal Closed';
export const MODAL_VIEWED = 'Modal - Modal Viewed';

// Market events
export const MARKET_LINK_COPIED = 'Market Link Copied';
export const MARKET_SHARED = 'Market Shared';

// Locations
export const MARKET_PAGE = 'Market page';
export const MARKET_LIST_CARD = 'Market List Card';