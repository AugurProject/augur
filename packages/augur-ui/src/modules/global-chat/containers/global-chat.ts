import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { GlobalChat } from 'modules/global-chat/components/global-chat.tsx';
import { initialize3box } from 'modules/global-chat/actions/initialize-3box';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = () => {
  const { loginAccount, env, initialized3box } = AppStatus.get();
  const signer = loginAccount.meta?.signer;

  const defaultGlobalChatProps = {
    whichChatPlugin: env.plugins?.chat,
  };

  return signer ? {
    ...defaultGlobalChatProps,
    provider: signer.provider?._web3Provider,
    initialized3box,
  } : defaultGlobalChatProps;
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
