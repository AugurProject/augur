import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { Helmet } from 'react-helmet';

import NullStateMessage from 'modules/common/components/null-state-message';
import MyReport from 'modules/my-reports/components/my-report';
import Link from 'modules/link/components/link';
import TransactionsLoadingActions from 'modules/transactions/components/transactions-loading-actions';
import FilterSort from 'modules/filter-sort/container';

export default class MyReports extends Component {
  static propTypes = {
    branch: PropTypes.object.isRequired,
    reports: PropTypes.array.isRequired,
    registerBlockNumber: PropTypes.number,
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
      <article className="my-reports">
        <Helmet>
          <title>My Reports</title>
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
          items={p.reports}
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
                key={p.reports[marketIndex].marketID}
                className="portfolio-market"
              >
                <div
                  className="portfolio-market-overview"
                >
                  <Link
                    {...p.reports[marketIndex].marketLink}
                  >
                    <span className="description">
                      {p.reports[marketIndex].description}
                    </span>
                  </Link>
                  {p.reports[marketIndex].isChallenged &&
                    <i
                      className="fa fa-gavel outcome-challenged"
                      data-tip="This outcome is currently being challenged"
                    />
                  }
                  {!p.reports[marketIndex].isChallenged && p.reports[marketIndex].isChallengeable &&
                    <i
                      className="fa fa-exclamation-circle outcome-challengeable"
                      data-tip="This outcome is eligible to be challenged"
                    />
                  }
                </div>
                <MyReport
                  {...p.reports[marketIndex]}
                  branch={p.branch}
                />
              </div>
            ))}
          </div> :
          <NullStateMessage message="No Reports Made" />
        }
        <ReactTooltip type="light" effect="solid" place="top" />
      </article>
    );
  }
}
