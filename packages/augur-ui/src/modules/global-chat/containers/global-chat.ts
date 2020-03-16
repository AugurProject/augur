import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { GlobalChat } from 'modules/global-chat/components/global-chat.tsx';

const mapStateToProps = (state) => ({
  whichChatPlugin: state.env.plugins?.chat,
  initialChatVisibility: false,
});

export default withRouter(
  connect(
    mapStateToProps,
  )(GlobalChat)
);
