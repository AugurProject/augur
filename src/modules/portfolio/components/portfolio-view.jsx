import React, { PropTypes } from 'react';

import MyPositions from 'modules/my-positions/components/my-positions';
import MyMarkets from 'modules/my-markets/my-markets-container';
import MyReports from 'modules/my-reports/my-reports-container';

import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from 'modules/app/constants/views';

const PortfolioView = p => (
  <section id="portfolio_view" >
    {p.activeView === MY_POSITIONS &&
      <MyPositions
        markets={p.positionsMarkets}
        closePositionStatus={p.closePositionStatus}
        isTradeCommitLocked={p.isTradeCommitLocked}
        scalarShareDenomination={p.scalarShareDenomination}
        orderCancellation={p.orderCancellation}
      />
    }
    {p.activeView === MY_MARKETS &&
      <MyMarkets />
    }
    {p.activeView === MY_REPORTS &&
      <MyReports />
    }
  </section>
);

PortfolioView.propTypes = {
  activeView: PropTypes.string.isRequired,
  branch: PropTypes.object.isRequired,
  navItems: PropTypes.array.isRequired,
  totals: PropTypes.object.isRequired,
  reports: PropTypes.object.isRequired,
  openOrders: PropTypes.array.isRequired,
  positionsMarkets: PropTypes.array.isRequired
};

export default PortfolioView;
