import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Onboarding } from 'modules/modal/onboarding';
import { closeModal } from 'modules/modal/actions/close-modal';
import { updateModal } from 'modules/modal/actions/update-modal';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { MODAL_ADD_FUNDS, MODAL_TEST_BET } from 'modules/common/constants';
import { OnboardingPaymentIcon } from 'modules/common/icons';
import { BUY_DAI, track } from 'services/analytics/helpers';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  addFunds: callback =>
    dispatch(updateModal({ type: MODAL_ADD_FUNDS, cb: callback })),
  testBet: () => dispatch(updateModal({ type: MODAL_TEST_BET })),
  track: (eventName, payload) => dispatch(track(eventName, payload))
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  icon: OnboardingPaymentIcon,
  largeHeader: 'Add Dai to your account',
  currentStep: 3,
  analyticsEvent: () => dP.track(BUY_DAI, {}),
  linkContent: [
    {
      content:
        'Buy Dai ($) directly or transfer Dai ($) to your Augur account address to start placing bets.',
    },
    {
      content: 'LEARN MORE',
      link: 'https://docs.augur.net',
    },
  ],
  buttons: [
    {
      text: 'Add Dai',
      action: () => {
        dP.addFunds(() => setTimeout(() => dP.testBet()));
      },
    },
    {
      text: 'Do it later',
      action: () => {
        dP.testBet();
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
