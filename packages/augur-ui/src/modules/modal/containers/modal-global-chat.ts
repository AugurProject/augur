import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ModalGlobalChat } from 'modules/modal/components/modal-global-chat';
import { closeModal } from 'modules/modal/actions/close-modal';

const mapStateToProps = ({authStatus, env, modal}) => ({
  whichChatPlugin: env.plugins?.chat,
  modal,
  isLogged: authStatus.isLogged,
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ModalGlobalChat)
);
