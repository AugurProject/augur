import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ModalGlobalChat } from 'modules/modal/components/modal-global-chat';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

const mapStateToProps = ({loginAccount, env, modal}) => {
  const signer = loginAccount.meta?.signer;

  const defaultChatProps = {
    whichChatPlugin: env.plugins?.chat,
    modal,
  };

  return signer ? {
    ...defaultChatProps,
    provider: signer.provider?._web3Provider,
  } : defaultChatProps
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ModalGlobalChat)
);
