import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Message } from 'modules/modal/message';
import { AppState } from 'store';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { fundGsnWallet } from 'modules/contracts/actions/contractCalls';

const mapStateToProps = (state: AppState) => {
  const { loginAccount } = state;
  const { meta, address } = loginAccount;
  const signingWallet = meta.signer._address;
  const gsnWallet = address;
  return {
    modal: state.modal,
    signingWallet,
    gsnWallet,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  fundGsnWallet: (address) => fundGsnWallet(address),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: 'Fund GSN Wallet',
  description: [
    'Get testnet DAI, it will be sent to your connected GSN wallet. Takes 2 transactions',
  ],
  closeAction: () => dP.closeModal(),
  buttons: [
    {
      text: 'Fund GSN Wallet',
      action: () => {
        dP.fundGsnWallet(sP.signingWallet, sP.gsnWallet);
        dP.closeModal();
      },
    },
    {
      text: 'Cancel',
      action: () => dP.closeModal(),
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
