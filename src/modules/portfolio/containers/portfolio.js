import { connect } from 'react-redux';
import portfolioView from 'modules/portfolio/components/portfolio-view';

const mapStateToProps = state => ({
  activeView: state.activeView
});

const Portfolio = connect(mapStateToProps)(portfolioView);

export default Portfolio;
