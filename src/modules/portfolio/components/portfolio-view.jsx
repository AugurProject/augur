import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import MyPositions from 'modules/my-positions/container';
import MyMarkets from 'modules/my-markets/container';
import MyReports from 'modules/my-reports/container';

import makePath from 'modules/app/helpers/make-path';

import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from 'modules/app/constants/views';

const PortfolioView = p => (
  <section id="portfolio_view" >
    <span>TEST</span>
    <Route path={makePath(MY_POSITIONS)} component={MyPositions} />
    <Route path={makePath(MY_MARKETS)} component={MyMarkets} />
    <Route path={makePath(MY_REPORTS)} component={MyReports} />
  </section>
);

PortfolioView.propTypes = {
  activeView: PropTypes.string.isRequired
};

export default PortfolioView;


// {p.activeView === MY_POSITIONS &&
//   <MyPositions />
// }
// {p.activeView === MY_MARKETS &&
//   <MyMarkets />
// }
// {p.activeView === MY_REPORTS &&
//   <MyReports />
// }
