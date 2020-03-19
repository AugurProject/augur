import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { updateModal } from 'modules/modal/actions/update-modal';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { MODAL_TEST_BET, HELP_CENTER_LEARN_ABOUT_ADDRESS } from 'modules/common/constants';
import { P2pNetwork } from 'modules/common/icons';
import { AUGUR_IS_P2P, track } from 'services/analytics/helpers';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  testBet: () => dispatch(updateModal({ type: MODAL_TEST_BET })),
  track: (eventName, payload) => dispatch(track(eventName, payload)),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  icon: P2pNetwork,
  largeHeader: 'Augur is a peer to peer network',
  currentStep: 4,
  analyticsEvent: () => dP.track(AUGUR_IS_P2P, {}),
  linkContent: [
    {
      content:
        'This requires an initial fee to join the network. This goes entirely to the network and Augur doesn’t collect any of these fees.',
    },
    {
      content: 'LEARN MORE',
      link: HELP_CENTER_LEARN_ABOUT_ADDRESS,
    },
  ],
  buttons: [
    {
      text: 'Continue',
      action: () => {
        dP.testBet();
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
