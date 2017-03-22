// NOTE --  The following is mostly a half-step towards the ultimate implementation
//          of reselect (deferring work until the full-app refactor)

import { connect } from 'react-redux';
import portfolioView from 'modules/portfolio/components/portfolio-view';

import portfolio from 'modules/portfolio/selectors/portfolio';

const mapStateToProps = state => ({
  activeView: state.activeView,
  branch: state.branch,
  ...portfolio()
});

const portfolioNav = connect(mapStateToProps)(portfolioView);

export default portfolioNav;
