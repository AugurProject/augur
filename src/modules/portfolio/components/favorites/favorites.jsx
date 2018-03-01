import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import Dropdown from 'modules/common/components/dropdown/dropdown'
import MarketsList from 'modules/markets/components/markets-list'
import Styles from 'modules/portfolio/components/favorites/favorites.styles'
import { TYPE_TRADE } from 'modules/market/constants/link-types'

class Favorites extends Component {
  static propTypes = {
    markets: PropTypes.array.isRequired,
    filteredMarkets: PropTypes.array.isRequired,
    isLogged: PropTypes.bool.isRequired,
    hasAllTransactionsLoaded: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    loadMarketsInfo: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
  }

  constructor(props) {
    super(props)

    this.state = {
      sortOptions: [
        { label: 'Volume', value: 'volume' },
        { label: 'Newest', value: 'newest' },
        { label: 'Fees', value: 'fees' },
        { label: 'Expiring Soon', value: 'expiring' },
      ],
      sortDefault: 'volume',
      sortType: 'volume',
      filterOptions: [
        { label: 'Cryptocurrency', value: 'cryptocurrency' },
        { label: 'Blockchain', value: 'blockchain' },
        { label: 'Bitcoin', value: 'bitcoin' },
        { label: 'Ethereum', value: 'ethereum' },
      ],
      filterDefault: 'cryptocurrency',
      filterType: 'cryptocurrency',
    }

    this.changeDropdown = this.changeDropdown.bind(this)
  }

  changeDropdown(value) {
    let { sortType } = this.state
    let { filterType } = this.state

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

    return (
      <section className={Styles.Favorites}>
        <Helmet>
          <title>Favorites</title>
        </Helmet>
        <div
          className={Styles.Favorites__SortBar}
        >
          <div
            className={Styles['Favorites__SortBar-title']}
          >
            Favorites
          </div>
          <div
            className={Styles['Favorites__SortBar-sort']}
          >
            <Dropdown default={s.sortDefault} options={s.sortOptions} onChange={this.changeDropdown} />
          </div>
          <div
            className={Styles['Favorites__SortBar-filter']}
          >
            <Dropdown default={s.filterDefault} options={s.filterOptions} onChange={this.changeDropdown} />
          </div>
        </div>
        <MarketsList
          isLogged={p.isLogged}
          markets={p.markets}
          filteredMarkets={p.filteredMarkets}
          location={p.location}
          history={p.history}
          toggleFavorite={p.toggleFavorite}
          loadMarketsInfo={p.loadMarketsInfo}
          linkType={TYPE_TRADE}
          isMobile={p.isMobile}
        />
      </section>
    )
  }
}

export default Favorites
