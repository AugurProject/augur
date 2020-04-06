import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { GlobalChat } from 'modules/global-chat/components/global-chat.tsx';

const mapStateToProps = ({appStatus, loginAccount, env}) => {
  const signer = loginAccount.meta?.signer;

  const defaultGlobalChatProps = {
    whichChatPlugin: env.plugins?.chat,
    theme: appStatus.theme,
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
