import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { GlobalChat } from 'modules/global-chat/components/global-chat.tsx';
import { initialize3box } from 'modules/global-chat/actions/initialize-3box';

const mapStateToProps = ({loginAccount, env, initialized3box}) => {
  const signer = loginAccount.meta?.signer;

  return signer ? {
    provider: signer.provider?._web3Provider,
    whichChatPlugin: env.plugins?.chat,
    initialized3box,
  } : {
    whichChatPlugin: env.plugins?.chat,
  }
};

const mapDispatchToProps = dispatch => ({
  initialize3box: (address, box, profile) => dispatch(initialize3box(address, box, profile)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(GlobalChat)
);
