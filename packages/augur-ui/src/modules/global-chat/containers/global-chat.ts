import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { GlobalChat } from 'modules/global-chat/components/global-chat.tsx';

const mapStateToProps = ({authStatus, loginAccount, env}) => {
  const signer = loginAccount.meta?.signer;

  const defaultGlobalChatProps = {
    whichChatPlugin: env.plugins?.chat,
    isLogged: authStatus.isLogged,
  };

  return signer ? {
    ...defaultGlobalChatProps,
    provider: signer.provider?._web3Provider,
  } : defaultGlobalChatProps;
};

export default withRouter(
  connect(
    mapStateToProps,
  )(GlobalChat)
);
