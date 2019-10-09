import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  largeHeader: 'Learn how to place a bet on Augur ',
  testBet: true,
  mediumHeader: 'Place a test bet',
  linkContent: [
    {
      content:
        'Want some guidance on how to place a bet on Augur? Place a test bet right now to see how it works. You’ll get guidance and tips to help you get started.',
    },
  ],
  buttons: [
    {
      text: 'Place test bet',
      disabled: true,
      action: () => {
        dP.closeModal();
      },
    },
    {
      text: 'Do it later',
      action: () => {
        dP.closeModal();
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
