import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { MODAL_AUGUR_USES_DAI } from 'modules/common/constants';
import { updateModal } from '../actions/update-modal';
import { OnboardingCheckIcon } from 'modules/common/icons';
import { ACCOUNT_CREATED, track } from 'services/analytics/helpers';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  augurUsesDaiModal: () => dispatch(updateModal({ type: MODAL_AUGUR_USES_DAI })),
  track: (eventName, payload) => dispatch(track(eventName, payload)),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  icon: OnboardingCheckIcon,
  analyticsEvent: () => dP.track(ACCOUNT_CREATED, {}),
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
