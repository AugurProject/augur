import { analytics } from './analytics';
import { ThunkDispatch, ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "store";
import { createBigNumber } from 'utils/create-big-number';

export const track = (eventName, payload): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {  try {
    analytics.track(eventName, {
      userAgent: window.navigator.userAgent,
      ...payload,
    });
  } catch (err) {
    console.log(err);
  }
}

export const addedDaiEvent = (dai: Number): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount } = getState();
  if (loginAccount.balances.dai && createBigNumber(loginAccount.balances.dai).gt(createBigNumber(dai))) {
    track(ADDED_DAI, {});
  }
}

// Onboarding event names
export const START_TEST_TRADE = 'Onboarding::StartTestTrade';
export const SKIPPED_TEST_TRADE = 'Onboarding::SkippedTestTrade';
export const FINISHED_TEST_TRADE = 'Onboarding::FinishedTestTrade';
export const DO_A_TEST_BET = 'Onboarding::DoATestBet';
export const BUY_DAI = 'Onboarding::BuyDai';
export const AUGUR_USES_DAI = 'Onboarding::AugurUsesDai';
export const ADD_FUNDS = 'AddFunds';
export const ACCOUNT_CREATED = 'Onboarding::AccountCreated';
export const ADDED_DAI = 'AddedDai';