import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Onboarding } from 'modules/modal/onboarding';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { MODAL_ADD_FUNDS, MODAL_AUGUR_P2P, HELP_CENTER_ADD_FUNDS } from 'modules/common/constants';
import { OnboardingPaymentIcon } from 'modules/common/icons';
import { BUY_DAI, track } from 'services/analytics/helpers';
import { AppStatus } from 'modules/app/store/app-status';
import { getOnboardingStep } from './modal-p2p-trading';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => {
  const { setModal } = AppStatus.actions;
  return ({
    closeModal: () => dispatch(closeModal()),
    addFunds: callback =>
      setModal({ type: MODAL_ADD_FUNDS, cb: callback }),
    showAugurP2PModal: () =>
      setModal({ type: MODAL_AUGUR_P2P }),
    track: (eventName, payload) => track(eventName, payload),
    gotoOnboardingStep: step => setModal({ type: getOnboardingStep(step) }),
  });
}
const mergeProps = (sP: any, dP: any, oP: any) => ({
  icon: OnboardingPaymentIcon,
  largeHeader: 'Add Dai to your account',
  currentStep: 3,
  changeCurrentStep: (step) => {
    dP.gotoOnboardingStep(step);
  },
  analyticsEvent: () => dP.track(BUY_DAI, {}),
  linkContent: [
    {
      content:
        'Buy Dai ($) directly or transfer Dai ($) to your User account address to start placing bets.',
    },
    {
      content: 'LEARN MORE',
      link: HELP_CENTER_ADD_FUNDS,
    },
  ],
  buttons: [
    {
      text: 'Add Dai',
      action: () => {
        dP.addFunds(() => setTimeout(() => dP.showAugurP2PModal()));
      },
    },
    {
      text: 'Do it later',
      action: () => {
        dP.showAugurP2PModal();
      },
    },
  ],
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Onboarding)
);
