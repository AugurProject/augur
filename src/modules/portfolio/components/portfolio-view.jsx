import React, { PropTypes } from 'react';

import Positions from 'modules/my-positions/components/my-positions';
import Markets from 'modules/portfolio/components/markets';
import Reports from 'modules/portfolio/components/reports';

import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from 'modules/app/constants/views';

const PortfolioView = p => (
  <section id="portfolio_view" >
    {p.activeView === MY_POSITIONS &&
      <Positions {...p.positions} />
    }
    {p.activeView === MY_MARKETS &&
      <Markets {...p.markets} />
    }
    {p.activeView === MY_REPORTS &&
      <Reports {...p.reports} branch={p.branch} />
    }
  </section>
);

PortfolioView.propTypes = {
  activeView: PropTypes.string.isRequired,
  branch: PropTypes.object.isRequired,
  navItems: PropTypes.array.isRequired,
  totals: PropTypes.object.isRequired,
  positions: PropTypes.object.isRequired,
  markets: PropTypes.object.isRequired,
  reports: PropTypes.object.isRequired
};

export default PortfolioView;
