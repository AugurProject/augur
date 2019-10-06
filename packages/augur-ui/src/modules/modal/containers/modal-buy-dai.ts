import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Onboarding } from 'modules/modal/onboarding';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  largeHeader: 'Finally, buy DAI & start betting',
  smallHeader: 'DAI is the currency Augur uses',
  daiGraphic: true,
  mediumHeader: 'What is DAI?',
  linkContent: [
    {
      content:
        'DAI is a pegged currency that mirrors the value of the US dollar. This means that 1 DAI is equivalent to 1 USD.',
    },
    {
      content: 'Learn more about DAI',
      link: 'https://docs.augur.net',
    },
  ],
  buttons: [
    {
      text: 'Buy DAI',
      action: () => {
        dP.closeModal();
      },
    },
    {
      text: 'Do it later',
      action: () => {
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
