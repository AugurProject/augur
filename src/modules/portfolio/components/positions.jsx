import React, { PropTypes } from 'react';
import MyPositions from 'modules/my-positions/components/my-positions';
import PositionsMarketOverview from 'modules/my-positions/components/my-positions-market-overview';
import Link from 'modules/link/components/link';
import NullStateMessage from 'modules/common/components/null-state-message';

const PortfolioPositions = p => (
  <div className="positions-content" >
    {!!p.markets && p.markets.length ? p.markets.map(market => (
      <div key={market.id} className="positions-container" >
        <Link href={market.marketLink.href} onClick={market.marketLink.onClick} >
          <PositionsMarketOverview
            description={market.description}
            {...market.myPositionsSummary}
          />
        </Link>
        {!!market.myPositionOutcomes && !!market.myPositionOutcomes.length &&
          <MyPositions
            className="page-content positions-content"
            market={market}
            marketLink={market.marketLink}
          />
        }
      </div>
    )) :
    <NullStateMessage message="No Positions Held" />
  }
  </div>
);

PortfolioPositions.propTypes = {
  markets: PropTypes.array.isRequired
};

export default PortfolioPositions;
