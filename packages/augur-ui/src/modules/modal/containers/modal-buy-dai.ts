import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Onboarding } from 'modules/modal/onboarding';
import { closeModal } from 'modules/modal/actions/close-modal';
import { updateModal } from 'modules/modal/actions/update-modal';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { MODAL_ADD_FUNDS, MODAL_TEST_BET } from 'modules/common/constants';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  addFunds: callback =>
    dispatch(updateModal({ type: MODAL_ADD_FUNDS, cb: callback })),
  testBet: () => dispatch(updateModal({ type: MODAL_TEST_BET })),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  largeHeader: 'Buy DAI to start betting',
  smallHeader: 'DAI is the currency Augur uses',
  daiGraphic: true,
  mediumHeader: 'What is DAI?',
  linkContent: [
    {
      content:
        'DAI is a pegged currency that mirrors the value of the US dollar. This means that 1 DAI is equivalent to 1 USD.',
    },
    {
      content: 'Learn more about DAI',
      link: 'https://docs.augur.net',
    },
  ],
  buttons: [
    {
      text: 'Buy DAI',
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
