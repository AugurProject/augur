import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ModalGlobalChat } from 'modules/modal/components/modal-global-chat';
import { closeModal } from 'modules/modal/actions/close-modal';
import { initialize3box } from 'modules/global-chat/actions/initialize-3box';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = ({ initialized3box }) => {
  const { loginAccount, env, modal } = AppStatus.get();
  const signer = loginAccount.meta?.signer;

  const defaultChatProps = {
    whichChatPlugin: env.plugins?.chat,
    modal,
  };

  return signer ? {
    ...defaultChatProps,
    provider: signer.provider?._web3Provider,
    initialized3box,
  } : defaultChatProps;
};

const mapDispatchToProps = dispatch => ({
  closeModal: () => closeModal(),
  initialize3box: (address, box, profile) => dispatch(initialize3box(address, box, profile)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ModalGlobalChat)
);
