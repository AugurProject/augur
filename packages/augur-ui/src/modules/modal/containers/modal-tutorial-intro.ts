import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import makePath from 'modules/routes/helpers/make-path';
import { MARKETS } from 'modules/routes/constants/views';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  largeHeader: 'Welcome to our test market',
  condensed: true,
  smallHeader: "Here we're going to take you through each step of placing a trade on Augur. You can exit this walkthrough at any time and access it again via the help menu",
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
