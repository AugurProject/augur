import { connect } from 'react-redux'
import portfolioView from 'modules/portfolio/components/portfolio-view'

// TODO -- no longer need global state passed...can refactor out container for portfolio

const mapStateToProps = state => ({
  activeView: state.activeView
})

const Portfolio = connect(mapStateToProps)(portfolioView)

export default Portfolio
