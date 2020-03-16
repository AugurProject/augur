import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Onboarding } from 'modules/modal/onboarding';
import { closeModal } from 'modules/modal/actions/close-modal';
import { updateModal } from 'modules/modal/actions/update-modal';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { MODAL_BUY_DAI } from 'modules/common/constants';
import { OnboardingPaymentIcon } from 'modules/common/icons';
import { AUGUR_IS_P2P, track } from 'services/analytics/helpers';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  buyDaiModal: () => dispatch(updateModal({ type: MODAL_BUY_DAI })),
  track: (eventName, payload) => dispatch(track(eventName, payload)),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  icon: OnboardingPaymentIcon,
  largeHeader: 'Augur is Peer-to-peer',
  currentStep: 3,
  analyticsEvent: () => dP.track(AUGUR_IS_P2P, {}),
  linkContent: [
    {
      content:
        'In order to use Augur a small fee is required to initialize your account. These fees do not go to Augur.',
    },
    {
      content: 'LEARN MORE',
      link: 'https://docs.augur.net',
    },
  ],
  buttons: [
    {
      text: 'Next',
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
