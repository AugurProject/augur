import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Message } from 'modules/modal/message';
import { AppState } from 'appStore';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { fundGsnWallet } from 'modules/contracts/actions/contractCalls';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const {
    loginAccount: {
      meta: {
        signer: { _address: signingWallet },
      },
      address: gsnWallet,
    },
    modal,
  } = AppStatus.get();
  return {
    modal,
    signingWallet,
    gsnWallet,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  fundGsnWallet: () => fundGsnWallet(),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: 'Fund GSN Wallet',
  description: [
    'Get testnet DAI, it will be sent to your connected GSN wallet',
  ],
  closeAction: () => dP.closeModal(),
  buttons: [
    {
      text: 'Fund GSN Wallet',
      action: () => {
        dP.fundGsnWallet();
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
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(Message)
);
