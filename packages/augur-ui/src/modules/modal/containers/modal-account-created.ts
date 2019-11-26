import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { MODAL_AUGUR_USES_DAI } from 'modules/common/constants';
import { updateModal } from '../actions/update-modal';
import { OnboardingCheckIcon } from 'modules/common/icons';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  augurUsesDaiModal: () => dispatch(updateModal({ type: MODAL_AUGUR_USES_DAI })),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  icon: OnboardingCheckIcon,
  largeHeader: 'Account created ',
  smallHeader: 'You’re almost ready to start betting!',
  currentStep: 1,
  buttons: [
    {
      text: 'Continue',
      disabled: false,
      action: () => {
        dP.augurUsesDaiModal();
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
