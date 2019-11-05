import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  ONBOARDING_SEEN_KEY,
  TRADING_TUTORIAL,
} from 'modules/common/constants';
import { windowRef } from 'utils/window-ref';
import makePath from 'modules/routes/helpers/make-path';
import { MARKET } from 'modules/routes/constants/views';
import makeQuery from 'modules/routes/helpers/make-query';
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names';
import { TestBet } from 'modules/modal/common';

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
  icon: TestBet,
  largeHeader: sP.isMobile ? 'Learn how to bet on Augur' : 'Lastly, run a test bet!',
  currentStep: 4,
  linkContent: [
    {
      content:
        sP.isMobile
          ? 'Watch our quick start video to learn how to place a bet using our trading app.'
          : 'Learn how betting works on Augur by placing a quick test bet. Get guidance and tips and start betting for real today.',
    },
  ],
  buttons: [
    {
      text: sP.isMobile ? 'Watch video' : 'Place test bet',
      action: () => {
        oP.history.push({
          pathname: makePath(MARKET),
          search: makeQuery({
            [MARKET_ID_PARAM_NAME]: TRADING_TUTORIAL,
          }),
        });
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
