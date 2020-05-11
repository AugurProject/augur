import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { updateModal } from 'modules/modal/actions/update-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  MODAL_TEST_BET,
  HELP_CENTER_LEARN_ABOUT_ADDRESS,
  MODAL_ACCOUNT_CREATED,
  MODAL_AUGUR_USES_DAI,
  MODAL_BUY_DAI,
  MODAL_AUGUR_P2P,
} from 'modules/common/constants';
import { P2pNetwork } from 'modules/common/icons';
import { AUGUR_IS_P2P, track } from 'services/analytics/helpers';

export const getOnboardingStep = (step: number): string => {
  if (step === 1) {
    return MODAL_ACCOUNT_CREATED;
  } else if (step === 2) {
    return MODAL_AUGUR_USES_DAI;
  } else if (step === 3) {
    return MODAL_BUY_DAI;
  } else if (step === 4) {
    return MODAL_AUGUR_P2P;
  } else {
    return MODAL_TEST_BET;
  }
};

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  testBet: () => dispatch(updateModal({ type: MODAL_TEST_BET })),
  track: (eventName, payload) => dispatch(track(eventName, payload)),
  gotoOnboardingStep: step =>
    dispatch(updateModal({ type: getOnboardingStep(step) })),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  icon: P2pNetwork,
  largeHeader: 'Augur is a peer to peer network',
  currentStep: 4,
  analyticsEvent: () => dP.track(AUGUR_IS_P2P, {}),
  changeCurrentStep: step => {
    dP.gotoOnboardingStep(step);
  },
  linkContent: [
    {
      content:
        'This requires an initial fee to join the network. This goes entirely to the network and Augur doesn’t collect any of these fees.',
    },
    {
      content: 'LEARN MORE',
      link: HELP_CENTER_LEARN_ABOUT_ADDRESS,
    },
  ],
  buttons: [
    {
      text: 'Continue',
      action: () => {
        dP.testBet();
      },
    },
  ],
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(Onboarding)
);
