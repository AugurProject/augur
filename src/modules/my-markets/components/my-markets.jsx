import React, { PropTypes } from 'react';

import NullStateMessage from 'modules/common/components/null-state-message';

import MyMarket from 'modules/my-markets/components/my-market';
import Link from 'modules/link/components/link';

const MyMarkets = p => (
  <article className="my-markets">
    {p.myMarkets && p.myMarkets.length ?
      <div>
        {p.myMarkets.map(market => (
          <div
            key={market.id}
            className="portfolio-market"
          >
            <div
              className="my-market-overview portfolio-market-overview"
            >
              <Link
                {...market.marketLink}
              >
                <span>{market.description}</span>
              </Link>
            </div>
            <MyMarket
              {...market}
            />
          </div>
        ))}
      </div> :
      <NullStateMessage message="No Markets Created" />
    }
  </article>
);

MyMarkets.propTypes = {
  myMarkets: PropTypes.array.isRequired
};

export default MyMarkets;
