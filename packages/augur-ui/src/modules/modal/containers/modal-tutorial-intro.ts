import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import makePath from 'modules/routes/helpers/make-path';
import { MARKETS } from 'modules/routes/constants/views';
import { TestBet } from 'modules/modal/common';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  icon: TestBet,
  largeHeader: 'Run a test bet!',
  condensed: true,
  smallHeader: "Learn how betting works on Augur by placing a test bet. Get tips and guidance and start betting for real today.",
  buttons: [
    {
      text: 'Lets go!',
      action: () => {
        oP.next();
        dP.closeModal();
      },
    },
    {
        text: 'Not now',
        action: () => {
          oP.history.push({
            pathname: makePath(MARKETS),
          });
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
