import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import TopicsView from 'modules/topics/components/topics-view/topics-view'

import { selectLoginAccount } from 'modules/auth/selectors/login-account'
import { selectTopics } from 'modules/topics/selectors/topics'

const mapStateToProps = state => ({
  universe: state.universe,
  topics: selectTopics(state),
  // TODO: please review using this dummy data, then remove this comment and the dummy data :)
  // topics: [
  //   { popularity: 1000, topic: 'Ethereum' },
  //   { popularity: 900, topic: 'Bitcoin' },
  //   { popularity: 800, topic: 'Sports' },
  //   { popularity: 700, topic: 'Stocks' },
  //   { popularity: 600, topic: 'Finance' },
  //   { popularity: 500, topic: 'Fashion' },
  //   { popularity: 400, topic: 'Art' },
  //   { popularity: 300, topic: 'Politics' },
  //   { popularity: 200, topic: 'News' },
  //   { popularity: 100, topic: 'Games' },
  // ],
  loginAccount: selectLoginAccount(state),
  isLogged: state.isLogged
})

const Topics = withRouter(connect(mapStateToProps)(TopicsView))

export default Topics
