import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import NullStateMessage from 'modules/common/components/null-state-message'
import MyMarket from 'modules/my-markets/components/my-market'
import TransactionsLoadingActions from 'modules/transactions/components/transactions-loading-actions'
// import FilterSort from 'modules/filter-sort/container'

import makePath from 'modules/routes/helpers/make-path'
import makeQuery from 'modules/routes/helpers/make-query'
import getValue from 'utils/get-value'

import { MARKET } from 'modules/routes/constants/views'
import { MARKET_DESCRIPTION_PARAM_NAME, MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names'

export default class MyMarkets extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    myMarkets: PropTypes.array.isRequired
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
                    to={{
                      pathname: makePath(MARKET),
                      search: makeQuery({
                        [MARKET_DESCRIPTION_PARAM_NAME]: getValue(p, `myMarkets[${marketIndex}].formattedDescription`),
                        [MARKET_ID_PARAM_NAME]: getValue(p, `myMarkets[${marketIndex}].id`)
                      })
                    }}
                  >
                    <span>
                      {getValue(p, `myMarkets[${marketIndex}].description`)}
                    </span>
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
    )
  }
}

// <FilterSort
//   locaiton={p.location}
//   history={p.history}
//   items={p.myMarkets}
//   updateFilteredItems={filteredMarkets => this.setState({ filteredMarkets })}
//   searchPlaceholder="Search Created Markets"
//   searchKeys={this.searchKeys}
//   filterBySearch
//   filterByMarketState
//   sortByMarketParam
// />
