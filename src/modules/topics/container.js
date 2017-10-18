import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import TopicsView from 'modules/topics/components/topics-view/topics-view'

import { selectLoginAccount } from 'modules/auth/selectors/login-account'
import { selectTopics } from 'modules/topics/selectors/topics'

const mapStateToProps = state => ({
  universe: state.universe,
  topics: selectTopics(state),
  loginAccount: selectLoginAccount(state),
  isLogged: state.isLogged
})

const Topics = withRouter(connect(mapStateToProps)(TopicsView))

export default Topics
