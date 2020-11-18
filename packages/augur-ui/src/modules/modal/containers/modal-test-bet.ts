import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { TRADING_TUTORIAL, MODAL_APPROVALS } from 'modules/common/constants';
import makePath from 'modules/routes/helpers/make-path';
import { MARKET } from 'modules/routes/constants/views';
import makeQuery from 'modules/routes/helpers/make-query';
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names';
import { TestBet } from 'modules/modal/common';
import { updateModal } from '../actions/update-modal';
import { updateLoginAccount } from 'modules/account/actions/login-account';

const mapStateToProps = (state: AppState) => ({
  isTablet: window.innerWidth <= 1280,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  goBack: () => dispatch(updateModal({ type: MODAL_APPROVALS })),
  setCurrentOnboardingStep: (currentOnboardingStep) => dispatch(updateLoginAccount({ currentOnboardingStep })),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  goBack: dP.goBack,
  title: 'Congratulations! You’re now ready to start trading',
  content: [
    {
      icon: TestBet,
      content: sP.isTablet
        ? ''
        : 'Learn how betting works on Augur by placing a pretend bet. Get tips and guidance and start betting for real today',
    },
  ],
  currentStep: 7,
  showTestBet: true,
  closeModal: dP.closeModal,
  skipAction: dP.closeModal,
  setCurrentOnboardingStep: dP.setCurrentOnboardingStep,
  buttons: [
    {
      text: sP.isTablet ? 'Continue' : 'Place test bet',
      action: () => {
        if (!sP.isTablet) {
          dP.closeModal();
          oP.history.push({
            pathname: makePath(MARKET),
            search: makeQuery({
              [MARKET_ID_PARAM_NAME]: TRADING_TUTORIAL,
            }),
          });
        } else {
          dP.closeModal();
        }
      },
    },
  ],
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(Onboarding)
);
