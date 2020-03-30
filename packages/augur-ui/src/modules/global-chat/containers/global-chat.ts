import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { GlobalChat } from 'modules/global-chat/components/global-chat.tsx';

const mapStateToProps = ({loginAccount, env}) => {
  const signer = loginAccount.meta?.signer;

  return signer ? {
    provider: signer.provider?._web3Provider,
    whichChatPlugin: env.plugins?.chat,
  } : {
    whichChatPlugin: env.plugins?.chat,
  }
};

export default withRouter(
  connect(
    mapStateToProps,
  )(GlobalChat)
);
