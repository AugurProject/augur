import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppStatus } from 'modules/app/store/app-status';
import { Onboarding } from 'modules/modal/onboarding';
import {
  MODAL_BUY_DAI,
  HELP_CENTER_WHAT_IS_DAI,
} from 'modules/common/constants';
import { OnboardingDollarDaiIcon } from 'modules/common/icons';
import { AUGUR_USES_DAI, track } from 'services/analytics/helpers';
import { getOnboardingStep } from './modal-p2p-trading';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  buyDaiModal: () => AppStatus.actions.setModal({ type: MODAL_BUY_DAI }),
  track: (eventName, payload) => track(eventName, payload),
  gotoOnboardingStep: (step) => AppStatus.actions.setModal({ type: getOnboardingStep(step) })
});

const mergeProps = (sP, dP, oP) => ({
  icon: OnboardingDollarDaiIcon,
  largeHeader: 'Augur uses Dai for betting',
  showAccountStatus: true,
  currentStep: 2,
  changeCurrentStep: step => {
    dP.gotoOnboardingStep(step);
  },
  analyticsEvent: () => dP.track(AUGUR_USES_DAI, {}),
  linkContent: [
    {
      content:
        'Dai is a pegged currency that mirrors the value of the US dollar. This means that ‘1 Dai’ is equivalent to ‘1 USD’. We refer to Dai using the $ symbol.',
    },
    {
      content: 'Learn more about DAI',
      link: HELP_CENTER_WHAT_IS_DAI,
    },
  ],
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
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(Onboarding)
);
