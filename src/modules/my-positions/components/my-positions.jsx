import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import NullStateMessage from 'modules/common/components/null-state-message'
import MyPositionsMarket from 'modules/my-positions/components/my-positions-market'
import TransactionsLoadingActions from 'modules/transactions/components/transactions-loading-actions'
// import FilterSort from 'modules/filter-sort/container'

export default class MyPositions extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    markets: PropTypes.array.isRequired,
    closePositionStatus: PropTypes.object.isRequired,
    scalarShareDenomination: PropTypes.object.isRequired,
    orderCancellation: PropTypes.object.isRequired
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
      <article className="my-positions">
        <Helmet>
          <title>My Positions</title>
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
          s.filteredMarkets.map(marketIndex => (
            <MyPositionsMarket
              key={p.markets[marketIndex].id}
              market={p.markets[marketIndex]}
              closePositionStatus={p.closePositionStatus}
              scalarShareDenomination={p.scalarShareDenomination}
              orderCancellation={p.orderCancellation}
              location={p.location}
              history={p.history}
            />
          )) :
          <NullStateMessage
            message="No Positions Held"
          />
        }
      </article>
    )
  }
}

// <FilterSort
//   locaiton={p.location}
//   history={p.history}
//   items={p.markets}
//   updateFilteredItems={filteredMarkets => this.setState({ filteredMarkets })}
//   searchPlaceholder="Search Traded Markets"
//   searchKeys={this.searchKeys}
//   filterBySearch
//   filterByMarketState
//   sortByMarketParam
// />
