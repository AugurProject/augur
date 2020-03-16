import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Message } from 'modules/modal/message';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'store';
import { createFundedGsnWallet } from 'modules/auth/actions/update-sdk';

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
});

const mapDispatchToProps = (dispatch: any) => ({
  closeModal: () => {
    dispatch(closeModal());
  },
  createFundedGsnWallet: () => dispatch(createFundedGsnWallet()),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: 'Initialize Account',
  description: [
    'Augur is a peer to peer network that requires an initial fee to join. This goes entirely to the network provider and Augur doesn’t collect any of these fees. \n Until the account is initialized you will be unable to place an order.',
  ],
  buttons: [
    {
      text: 'Initialize Account',
      action: () => {
        dP.closeModal();
        dP.createFundedGsnWallet();
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
  )(Message)
);
