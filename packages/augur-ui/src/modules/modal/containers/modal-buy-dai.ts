import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { closeModal } from 'modules/modal/actions/close-modal';
import { updateModal } from 'modules/modal/actions/update-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  MODAL_ADD_FUNDS,
  MODAL_AUGUR_P2P,
  HELP_CENTER_ADD_FUNDS,
  MODAL_BUY_DAI,
} from 'modules/common/constants';
import { OnboardingPaymentIcon } from 'modules/common/icons';
import { BUY_DAI, track } from 'services/analytics/helpers';
import { getOnboardingStep } from './modal-p2p-trading';

const mapStateToProps = (state: AppState) => ({
  authStatus: state.authStatus,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  addFunds: callback =>
    dispatch(updateModal({ type: MODAL_ADD_FUNDS, cb: callback })),
  showAugurP2PModal: () => dispatch(updateModal({ type: MODAL_AUGUR_P2P })),
  track: (eventName, payload) => dispatch(track(eventName, payload)),
  gotoOnboardingStep: step =>
    dispatch(updateModal({ type: getOnboardingStep(step) })),
  showBuyDaiModal: () => dispatch(updateModal({ type: MODAL_BUY_DAI })),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  icon: sP.authStatus?.signerHasDAI ? null : OnboardingPaymentIcon,
  largeHeader: 'Add Dai to your trading account',
  showAccountStatus: true,
  currentStep: 3,
  changeCurrentStep: step => {
    dP.gotoOnboardingStep(step);
  },
  analyticsEvent: () => dP.track(BUY_DAI, {}),
  showTransferMyDai: sP.authStatus?.signerHasDAI,
  showBuyDaiModal: () => dP.showBuyDaiModal(),
  linkContent: [
    {
      content:
        'Buy Dai ($) directly or transfer Dai ($) to your trading account to start placing bets.',
    },
    {
      content:
        'Adding more than 40 Dai ($) allows for 0.04 ETH will be converted for your ETH reserve resulting in cheaper transaction fees.',
    },
    {
      content: 'Your ETH reserve can easily be cashed out at anytime.',
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
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(Onboarding)
);
