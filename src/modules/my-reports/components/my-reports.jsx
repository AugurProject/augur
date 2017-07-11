import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import NullStateMessage from 'modules/common/components/null-state-message';
import MyReport from 'modules/my-reports/components/my-report';
import Link from 'modules/link/components/link';
import TransactionsLoadingActions from 'modules/transactions/components/transactions-loading-actions';

const MyReports = p => (
  <article className="my-reports">
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
    {p.reports && p.reports.length ?
      <div>
        {p.reports.map(market => (
          <div
            key={market.marketID}
            className="portfolio-market"
          >
            <div
              className="portfolio-market-overview"
            >
              <Link
                {...market.marketLink}
              >
                <span className="description">
                  {market.description}
                </span>
              </Link>
              {market.isChallenged &&
                <i
                  className="fa fa-gavel outcome-challenged"
                  data-tip="This outcome is currently being challenged"
                />
              }
              {!market.isChallenged && market.isChallengeable &&
                <i
                  className="fa fa-exclamation-circle outcome-challengeable"
                  data-tip="This outcome is eligible to be challenged"
                />
              }
            </div>
            <MyReport
              {...market}
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

MyReports.propTypes = {
  branch: PropTypes.object.isRequired,
  reports: PropTypes.array.isRequired,
  registerBlockNumber: PropTypes.number,
};

export default MyReports;
