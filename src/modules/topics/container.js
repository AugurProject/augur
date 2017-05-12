import { connect } from 'react-redux';
import asyncComponent from 'modules/app/helpers/async-component';

import { selectLoginAccount } from 'modules/account/selectors/login-account';
import { selectTopicLink, selectCreateMarketLink } from 'modules/link/selectors/links';
import { selectTopics } from 'modules/topics/selectors/topics';

const mapStateToProps = state => ({
  branch: state.branch,
  topics: selectTopics(state),
  loginAccount: selectLoginAccount(state)
});

const mapDispatchToProps = dispatch => ({
  selectTopic: topic => selectTopicLink(topic, dispatch).onClick(),
  createMarketLink: selectCreateMarketLink(dispatch)
});

const Topics = asyncComponent(() => import(/* webpackChunkName: 'topics' */ 'modules/topics/components/topics-view')
    .then(module => connect(mapStateToProps, mapDispatchToProps)(module.default))
    .catch((err) => {
      console.error(`ERROR: Failed to load 'topics' module -- `, err);
    })
);

export default Topics;
