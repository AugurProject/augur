import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppStatus } from 'modules/app/store/app-status';

import { Onboarding } from 'modules/modal/onboarding';
import { MODAL_AUGUR_USES_DAI } from 'modules/common/constants';
import { OnboardingCheckIcon } from 'modules/common/icons';
import { ACCOUNT_CREATED, track } from 'services/analytics/helpers';
import { getOnboardingStep } from 'modules/modal/containers/modal-p2p-trading';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  augurUsesDaiModal: () =>
    AppStatus.actions.setModal({ type: MODAL_AUGUR_USES_DAI }),
  track: (eventName, payload) => track(eventName, payload),
  gotoOnboardingStep: (step) => AppStatus.actions.setModal({ type: getOnboardingStep(step) }),
});

const mergeProps = (sP, dP, oP) => ({
  icon: OnboardingCheckIcon,
  analyticsEvent: () => dP.track(ACCOUNT_CREATED, {}),
  largeHeader: 'Log-in created',
  smallHeader:
    'The next two steps are adding funds and activating your account. Once done you can start betting!',
  showAccountStatus: true,
  currentStep: 1,
  changeCurrentStep: step => {
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
