import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Message } from 'modules/modal/message';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'appStore';
import { updateModal } from '../actions/update-modal';
import { MODAL_ADD_FUNDS, ETH } from 'modules/common/constants';

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  showAddFundsModal: () => dispatch(updateModal({ type: MODAL_ADD_FUNDS })),
});

const mergeProps = (sP, dP, oP) => {
  return {
    title: sP.modal.title ? sP.modal.title : 'Something went wrong',
    buttons: [{ text: 'Close', action: () => dP.closeModal() }],
    description: [sP.modal.error ? sP.modal.error : ''],
    showDiscordLink: sP.modal.showDiscordLink,
    showAddFundsHelp: sP.modal.showAddFundsHelp,
    walletType: sP.modal.walletType,
    closeAction: () => dP.closeModal(),
    showAddFundsModal: () => dP.showAddFundsModal(),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Message)
);
