import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ModalGlobalChat } from 'modules/modal/components/modal-global-chat';
import { closeModal } from 'modules/modal/actions/close-modal';

const mapStateToProps = ({authStatus, loginAccount, env, modal}) => {
  const signer = loginAccount.meta?.signer;

  const defaultChatProps = {
    whichChatPlugin: env.plugins?.chat,
    modal,
    isLogged: authStatus.isLogged,
  };

  return signer ? {
    ...defaultChatProps,
    provider: signer.provider?._web3Provider,
  } : defaultChatProps;
};

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ModalGlobalChat)
);
