import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Message } from 'modules/modal/message';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP, dP, oP) => {
  return {
    title: 'Something went wrong',
    buttons: [{ text: 'Close', action: () => dP.closeModal() }],
    description: ['Please try again.', sP.modal.error ? sP.modal.error : ''],
    showDiscordLink: true,
    closeAction: () => dP.closeModal(),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Message)
);
