import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TopicsView from 'modules/topics/components/topics-view';

import { selectLoginAccount } from 'modules/auth/selectors/login-account';
import { selectCreateMarketLink } from 'modules/link/selectors/links';
import { selectTopics } from 'modules/topics/selectors/topics';

import getValue from 'utils/get-value';

const mapStateToProps = state => ({
  branch: state.branch,
  topics: selectTopics(state),
  loginAccount: selectLoginAccount(state),
  isLogged: !!getValue(state, 'loginAccount.address')
});

const mapDispatchToProps = dispatch => ({
  createMarketLink: selectCreateMarketLink(dispatch)
});

const Topics = withRouter(connect(mapStateToProps, mapDispatchToProps)(TopicsView));

export default Topics;
