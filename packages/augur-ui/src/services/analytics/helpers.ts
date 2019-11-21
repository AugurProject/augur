import { analytics } from './analytics';

export function track(eventName, payload) {
  try {
    analytics.track(eventName, {
      userAgent: window.navigator.userAgent,
      ...payload,
    });
  } catch (err) {
    console.log(err);
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