import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { updateModal } from 'modules/modal/actions/update-modal';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { MODAL_BUY_DAI } from 'modules/common/constants';
import { OnboardingDollarDaiIcon } from 'modules/common/icons';
import { AUGUR_USES_DAI, track } from 'services/analytics/helpers';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  buyDaiModal: () => dispatch(updateModal({ type: MODAL_BUY_DAI })),
  track: (eventName, payload) => dispatch(track(eventName, payload))
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  icon: OnboardingDollarDaiIcon,
  largeHeader: 'Augur uses Dai for betting',
  currentStep: 2,
  analyticsEvent: () => dP.track(AUGUR_USES_DAI, {}),
  linkContent: [
    {
      content:
        'Dai is a pegged currency that mirrors the value of the US dollar. This means that ‘1 DAI’ is equivalent to ‘1 USD’. For ease of use we refer to Dai using the $ symbol.',
    },
    {
      content: 'Learn more about DAI',
      link: 'https://docs.augur.net',
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
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Onboarding)
);
