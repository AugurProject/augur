import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import Dropdown from 'modules/common/components/dropdown/dropdown'
import MarketsList from 'modules/markets/components/markets-list'
import Styles from 'modules/portfolio/components/watchlist/watchlist.styles'
import { TYPE_TRADE } from 'modules/market/constants/link-types'

function createFilterObject(markets) {
  // NOTE: This should probably be a Util instead if we end up using it more often.
  // Used to generating the filter based on the markets passed tags. will only add each tag one time.
  let filterType = 'none'
  let defaultFilterType = 'none'
  let filterOptions = []

  markets.forEach((market) => {
    market.tags.forEach((tag) => {
      let taken = false
      filterOptions.forEach((filter) => {
        if (filter.value === tag) taken = true
      })
      // push a new tag/filter option to the filters Options
      if (!taken) {
        filterOptions.push({ label: tag, value: tag })
      }
      // as soon as we have a tag, replace none
      if (defaultFilterType === 'none' && filterOptions.length > 0) {
        defaultFilterType = tag
        filterType = tag
      }
    })
  })

  return {
    filterType,
    defaultFilterType,
    filterOptions
  }
}

class WatchList extends Component {
  static propTypes = {
    markets: PropTypes.array.isRequired,
    isLogged: PropTypes.bool.isRequired,
    hasAllTransactionsLoaded: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    scalarShareDenomination: PropTypes.object.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    loadMarketsInfo: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    const filter = createFilterObject(this.props.markets)

    this.state = {
      sortOptions: [
        { label: 'Volume', value: 'volume' },
        { label: 'Newest', value: 'newest' },
        { label: 'Fees', value: 'fees' },
        { label: 'Expiring Soon', value: 'expiring' }
      ],
      sortDefault: 'volume',
      sortType: 'volume',
      filterOptions: filter.filterOptions,
      filterDefault: filter.filterDefault,
      filterType: filter.filterType,
    }

    this.changeDropdown = this.changeDropdown.bind(this)
  }

  changeDropdown(value) {
    let sortType = this.state.sortType
    let filterType = this.state.filterType

    this.state.sortOptions.forEach((type, ind) => {
      if (type.value === value) {
        sortType = value
      }
    })

    this.state.filterOptions.forEach((type, ind) => {
      if (type.value === value) {
        filterType = value
      }
    })

    this.setState({ sortType, filterType })
  }

  render() {
    const p = this.props
    const s = this.state

    // create filtered Markets list, in this case all markets passed
    const filteredMarkets = []
    p.markets.forEach((market, ind) => {
      filteredMarkets.push(ind)
    })

    return (
      <section className={Styles.WatchList}>
        <Helmet>
          <title>Watching</title>
        </Helmet>
        <div
          className={Styles.WatchList__SortBar}
        >
          <div
            className={Styles['WatchList__SortBar-title']}
          >
            Watching
          </div>
          <div
            className={Styles['WatchList__SortBar-sort']}
          >
            <Dropdown default={s.sortDefault} options={s.sortOptions} onChange={this.changeDropdown} />
          </div>
          <div
            className={Styles['WatchList__SortBar-filter']}
          >
            <Dropdown default={s.filterDefault} options={s.filterOptions} onChange={this.changeDropdown} />
          </div>
        </div>
        <MarketsList
          isLogged={p.isLogged}
          markets={p.markets}
          filteredMarkets={filteredMarkets}
          location={p.location}
          history={p.history}
          scalarShareDenomination={p.scalarShareDenomination}
          toggleFavorite={p.toggleFavorite}
          loadMarketsInfo={p.loadMarketsInfo}
          linkType={TYPE_TRADE}
        />
      </section>
    )
  }
}

export default WatchList
