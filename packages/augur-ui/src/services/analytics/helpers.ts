import { analytics } from './analytics';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';
import { createBigNumber } from 'utils/create-big-number';
import { Analytic } from 'modules/types';
import { isLocalHost } from 'utils/is-localhost';
import { addAnalytic } from 'modules/app/actions/analytics-management';

export const track = (eventName, payload): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { blockchain } = getState();
  dispatch(
    addAnalytic(
      {
        eventName,
        payload,
        addedTimestamp: blockchain.currentAugurTimestamp,
        type: ANALYTIC_EVENT_TYPES.TRACK,
      },
      `${eventName}-${blockchain.currentAugurTimestamp}`
    )
  );
};

export const sendAnalytic = (
  analytic: Analytic
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  try {
    if (!isLocalHost()) {
      // todo: need to also have page here
      analytics.track(analytic.eventName, {
        userAgent: window.navigator.userAgent,
        ...analytic.payload,
      });
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
    track(ADDED_DAI, {});
  }
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
