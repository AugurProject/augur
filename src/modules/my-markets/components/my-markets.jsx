import React, { PropTypes } from 'react';

import NullStateMessage from 'modules/common/components/null-state-message';
import MyMarket from 'modules/my-markets/components/my-market';
import Link from 'modules/link/components/link';
import TransactionsLoadingActions from 'modules/transactions/components/transactions-loading-actions';

const MyMarkets = p => (
  <article className="my-markets">
    <div className="view-header">
      <div className="view-header-group" />
      <div className="view-header-group">
        <TransactionsLoadingActions
          loadMoreTransactions={p.loadMoreTransactions}
          loadAllTransactions={p.loadAllTransactions}
          transactionsLoading={p.transactionsLoading}
          hasAllTransactionsLoaded={p.hasAllTransactionsLoaded}
        />
      </div>
    </div>
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
