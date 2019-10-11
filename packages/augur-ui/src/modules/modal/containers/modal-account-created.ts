import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { MODAL_BUY_DAI } from 'modules/common/constants';
import { updateModal } from '../actions/update-modal';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  buyDaiModal: () => dispatch(updateModal({ type: MODAL_BUY_DAI })),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  largeHeader: 'Account created 🎉',
  smallHeader: 'You’re almost ready to start betting!',
  currentStep: 1,
  buttons: [
    {
      text: 'Continue',
      disabled: false,
      action: () => {
        dP.buyDaiModal();
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
