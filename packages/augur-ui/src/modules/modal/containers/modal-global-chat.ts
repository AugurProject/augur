import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ModalGlobalChat } from 'modules/modal/components/modal-global-chat';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

const mapStateToProps = (state) => ({
  modal: state.modal,
  whichChatPlugin: state.env.plugins?.chat,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ModalGlobalChat)
);
