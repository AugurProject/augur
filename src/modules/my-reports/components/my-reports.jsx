import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { Helmet } from 'react-helmet'

import NullStateMessage from 'modules/common/components/null-state-message/null-state-message'
import MyReport from 'modules/my-reports/components/my-report'
import TransactionsLoadingActions from 'modules/transactions/components/transactions-loading-actions'
// import FilterSort from 'modules/filter-sort/container'

import makePath from 'modules/routes/helpers/make-path'
import makeQuery from 'modules/routes/helpers/make-query'
import getValue from 'utils/get-value'

import { MARKET } from 'modules/routes/constants/views'
import { MARKET_DESCRIPTION_PARAM_NAME, MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names'

export default class MyReports extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    universe: PropTypes.object.isRequired,
    reports: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)

    this.searchKeys = [
      'description',
      ['outcomes', 'name'],
      ['tags', 'name']
    ]

    this.state = {
      filteredMarkets: []
    }
  }

  render() {
    const p = this.props
    const s = this.state

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
            />
          </div>
        </div>

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
                    to={{
                      pathname: makePath(MARKET),
                      search: makeQuery({
                        [MARKET_DESCRIPTION_PARAM_NAME]: getValue(p, `reports[${marketIndex}].formattedDescription`),
                        [MARKET_ID_PARAM_NAME]: getValue(p, `reports[${marketIndex}].id`)
                      })
                    }}
                  >
                    <span className="description">
                      {getValue(p, `reports[${marketIndex}].description`)}
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
                  universe={p.universe}
                />
              </div>
            ))}
          </div> :
          <NullStateMessage message="No Reports Made" />
        }
        <ReactTooltip type="light" effect="solid" place="top" />
      </article>
    )
  }
}
//
// <FilterSort
//   locaiton={p.location}
//   history={p.history}
//   items={p.reports}
//   updateFilteredItems={filteredMarkets => this.setState({ filteredMarkets })}
//   searchPlaceholder="Search Created Markets"
//   searchKeys={this.searchKeys}
//   filterBySearch
//   filterByMarketState
//   sortByMarketParam
// />
