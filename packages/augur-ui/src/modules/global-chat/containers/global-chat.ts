import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { GlobalChat } from 'modules/global-chat/components/global-chat.tsx';

const mapStateToProps = ({authStatus, env}) => {
  return {
    whichChatPlugin: env.plugins?.chat,
    isLogged: authStatus.isLogged,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
  )(GlobalChat)
);
