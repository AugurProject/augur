import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { GlobalChat } from 'modules/global-chat/components/global-chat.tsx';

const mapStateToProps = ({loginAccount, env}) => {
  const signer = loginAccount.meta?.signer;
  const accountType = loginAccount.meta?.accountType;

  return signer ? {
    accountType,
    initialChatVisibility: false,
    provider: signer.provider?._web3Provider,
    whichChatPlugin: env.plugins?.chat,
  } : {
    initialChatVisibility: false,
    whichChatPlugin: env.plugins?.chat,
  }
};

export default withRouter(
  connect(
    mapStateToProps,
  )(GlobalChat)
);
