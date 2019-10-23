import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { ONBOARDING_SEEN_KEY } from 'modules/common/constants';
import { windowRef } from 'utils/window-ref';

const mapStateToProps = (state: AppState) => ({
  isMobile: state.appStatus.isMobile,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  setOnboardingSeen: () => {
    if (windowRef && windowRef.localStorage.setItem) {
      windowRef.localStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
    }
  },
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  largeHeader: sP.isMobile ? '2. Learn how to bet on Augur' : '2. Run a test bet',
  smallHeader: sP.isMobile ? 'Watch a 30 second video' : 'Learn how to place a bet using Augur Trade',
  testBet: true,
  currentStep: 3,
  linkContent: [
    {
      content:
        sP.isMobile
          ? 'Watch our quick start video to learn how to place a bet using our trading app.'
          : 'See how betting works on Augur. You’ll get guidance and tips to help you get started.',
    },
  ],
  buttons: [
    {
      text: sP.isMobile ? 'Watch video' : 'Place test bet',
      disabled: true,
      action: () => {
        dP.setOnboardingSeen();
        dP.closeModal();
      },
    },
    {
      text: 'Finish',
      action: () => {
        dP.setOnboardingSeen();
        dP.closeModal();
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
