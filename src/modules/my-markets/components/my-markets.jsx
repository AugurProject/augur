import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import NullStateMessage from 'modules/common/components/null-state-message';
import MyMarket from 'modules/my-markets/components/my-market';
import Link from 'modules/link/components/link';
import TransactionsLoadingActions from 'modules/transactions/components/transactions-loading-actions';
import FilterSort from 'modules/filter-sort/container';

export default class MyMarkets extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    myMarkets: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);

    this.searchKeys = [
      'description',
      ['outcomes', 'name'],
      ['tags', 'name']
    ];

    this.state = {
      filteredMarkets: []
    };
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article className="my-markets">
        <Helmet>
          <title>My Markets</title>
        </Helmet>
        <div className="view-header">
          <div className="view-header-group" />
          <div className="view-header-group">
            <TransactionsLoadingActions
              loadMoreTransactions={p.loadMoreTransactions}
              loadAllTransactions={p.loadAllTransactions}
              transactionsLoading={p.transactionsLoading}
              hasAllTransactionsLoaded={p.hasAllTransactionsLoaded}
              triggerTransactionsExport={p.triggerTransactionsExport}
              registerBlockNumber={p.registerBlockNumber}
            />
          </div>
        </div>
        <FilterSort
          locaiton={p.location}
          history={p.history}
          items={p.myMarkets}
          updateFilteredItems={filteredMarkets => this.setState({ filteredMarkets })}
          searchPlaceholder="Search Created Markets"
          searchKeys={this.searchKeys}
          filterBySearch
          filterByMarketState
          sortByMarketParam
        />
        {s.filteredMarkets && s.filteredMarkets.length ?
          <div>
            {s.filteredMarkets.map(marketIndex => (
              <div
                key={p.myMarkets[marketIndex].id}
                className="portfolio-market"
              >
                <div
                  className="my-market-overview portfolio-market-overview"
                >
                  <Link
                    {...p.myMarkets[marketIndex].marketLink}
                  >
                    <span>{p.myMarkets[marketIndex].description}</span>
                  </Link>
                </div>
                <MyMarket
                  {...p.myMarkets[marketIndex]}
                />
              </div>
            ))}
          </div> :
          <NullStateMessage message="No Markets Created" />
        }
      </article>
    );
  }
}
