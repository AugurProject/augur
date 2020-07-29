import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { TRADING_TUTORIAL, MODAL_TUTORIA_VIDEO } from 'modules/common/constants';
import makePath from 'modules/routes/helpers/make-path';
import { MARKET } from 'modules/routes/constants/views';
import makeQuery from 'modules/routes/helpers/make-query';
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names';
import { TestBet } from 'modules/modal/common';
import {
  track,
  START_TEST_TRADE,
  DO_A_TEST_BET,
  SKIPPED_TEST_TRADE,
} from 'services/analytics/helpers';
import { updateModal } from '../actions/update-modal';
import { getOnboardingStep } from './modal-p2p-trading';

const mapStateToProps = (state: AppState) => ({
  isTablet: window.innerWidth <= 1280,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  track: (eventName, payload) => dispatch(track(eventName, payload)),
  gotoOnboardingStep: step =>
    dispatch(updateModal({ type: getOnboardingStep(step) })),
  gotoTutorialModal: () => dispatch(updateModal({ type: MODAL_TUTORIA_VIDEO }))
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  icon: TestBet,
  analyticsEvent: () => dP.track(DO_A_TEST_BET, {}),
  largeHeader: sP.isTablet
    ? 'Learn how to bet on Augur'
    : 'Lastly, run a test bet!',
  showAccountStatus: true,
  currentStep: 5,
  changeCurrentStep: step => {
    dP.gotoOnboardingStep(step);
  },
  linkContent: [
    {
      content: sP.isTablet
        ? 'Watch our quick start video to learn how to place a bet using our trading app.'
        : 'Learn how betting works on Augur by placing a test bet. Get tips and guidance and start betting for real today.',
    },
  ],
  buttons: [
    {
      text: sP.isTablet ? 'Watch video' : 'Place test bet',
      action: () => {
        if (!sP.isTablet) {
          oP.history.push({
            pathname: makePath(MARKET),
            search: makeQuery({
              [MARKET_ID_PARAM_NAME]: TRADING_TUTORIAL,
            }),
          });
          dP.track(START_TEST_TRADE, {});
        } else {
          //dP.closeModal();
          dP.gotoTutorialModal();
        }
      },
    },
    {
      text: 'Finish',
      action: () => {
        !sP.isTablet && dP.track(SKIPPED_TEST_TRADE, {});
        dP.closeModal();
      },
    },
  ],
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(Onboarding)
);
