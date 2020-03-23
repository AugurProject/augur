import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Onboarding } from 'modules/modal/onboarding';
import { closeModal } from 'modules/modal/actions/close-modal';
import { updateModal } from 'modules/modal/actions/update-modal';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { MODAL_ADD_FUNDS, MODAL_AUGUR_P2P, HELP_CENTER_ADD_FUNDS } from 'modules/common/constants';
import { OnboardingPaymentIcon } from 'modules/common/icons';
import { BUY_DAI, track } from 'services/analytics/helpers';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  addFunds: callback =>
    dispatch(updateModal({ type: MODAL_ADD_FUNDS, cb: callback })),
  showAugurP2PModal: () =>
    dispatch(updateModal({ type: MODAL_AUGUR_P2P })),
  track: (eventName, payload) => dispatch(track(eventName, payload))
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  icon: OnboardingPaymentIcon,
  largeHeader: 'Add Dai to your account',
  currentStep: 4,
  analyticsEvent: () => dP.track(BUY_DAI, {}),
  linkContent: [
    {
      content:
        'Buy Dai ($) directly or transfer Dai ($) to your Augur account address to start placing bets.',
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
