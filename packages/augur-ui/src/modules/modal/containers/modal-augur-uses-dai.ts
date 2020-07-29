import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { updateModal } from 'modules/modal/actions/update-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  MODAL_BUY_DAI,
  HELP_CENTER_WHAT_IS_DAI,
} from 'modules/common/constants';
import { OnboardingDollarDaiIcon } from 'modules/common/icons';
import { AUGUR_USES_DAI, track } from 'services/analytics/helpers';
import { getOnboardingStep } from './modal-p2p-trading';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  buyDaiModal: () => dispatch(updateModal({ type: MODAL_BUY_DAI })),
  track: (eventName, payload) => dispatch(track(eventName, payload)),
  gotoOnboardingStep: step =>
    dispatch(updateModal({ type: getOnboardingStep(step) })),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  icon: OnboardingDollarDaiIcon,
  largeHeader: 'Augur uses DAI for betting',
  showAccountStatus: true,
  currentStep: 2,
  changeCurrentStep: step => {
    dP.gotoOnboardingStep(step);
  },
  analyticsEvent: () => dP.track(AUGUR_USES_DAI, {}),
  linkContent: [
    {
      content:
        'DAI is a pegged currency that mirrors the value of the US dollar. This means that ‘1 DAI’ is equivalent to ‘1 USD’. DAI is referred to with $ symbol.',
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
