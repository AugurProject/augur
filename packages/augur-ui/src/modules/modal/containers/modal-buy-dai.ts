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

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  addFunds: callback =>
    dispatch(updateModal({ type: MODAL_ADD_FUNDS, cb: callback })),
  testBet: () => dispatch(updateModal({ type: MODAL_TEST_BET })),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  icon: OnboardingPaymentIcon,
  largeHeader: 'Add DAI to your account',
  currentStep: 3,
  linkContent: [
    {
      content:
        'Buy DAI ($) directly or transfer DAI ($) to your Augur account address to start placing bets.',
    },
    {
      content: 'Learn more about adding funds',
      link: 'https://docs.augur.net',
    },
  ],
  buttons: [
    {
      text: 'Add DAI',
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
