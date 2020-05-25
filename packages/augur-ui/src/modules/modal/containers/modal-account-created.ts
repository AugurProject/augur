import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { MODAL_AUGUR_USES_DAI } from 'modules/common/constants';
import { OnboardingCheckIcon } from 'modules/common/icons';
import { ACCOUNT_CREATED, track } from 'services/analytics/helpers';
import { AppStatus } from 'modules/app/store/app-status';
import { getOnboardingStep } from './modal-p2p-trading';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  augurUsesDaiModal: () =>
    AppStatus.actions.setModal({ type: MODAL_AUGUR_USES_DAI }),
  track: (eventName, payload) => track(eventName, payload),
  gotoOnboardingStep: (step) => AppStatus.actions.setModal({ type: getOnboardingStep(step) }),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  icon: OnboardingCheckIcon,
  analyticsEvent: () => dP.track(ACCOUNT_CREATED, {}),
  largeHeader: 'Account created ',
  smallHeader: 'You’re almost ready to start betting!',
  currentStep: 1,
  changeCurrentStep: (step) => {
    dP.gotoOnboardingStep(step);
  },
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
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(Onboarding)
);
