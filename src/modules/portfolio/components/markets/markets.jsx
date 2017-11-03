import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import Dropdown from 'modules/common/components/dropdown/dropdown'
// import MarketCard from 'modules/market/components/market-card/market-card'
import MarketsList from 'modules/markets/components/markets-list'
import Styles from 'modules/portfolio/components/markets/markets.styles'
import { TYPE_REPORT } from 'modules/market/constants/link-types'

class MyMarkets extends Component {
  static PropTypes = {

  }

  constructor(props) {
    super(props)

    this.state = {
      sortOptions: [
        { label: 'Volume', value: 'volume' },
        { label: 'Newest', value: 'newest' },
        { label: 'Fees', value: 'fees' },
        { label: 'Expiring Soon', value: 'expiring' }
      ],
      sortDefault: 'volume',
      sortType: 'volume',
      filterOptions: [
        { label: 'Reporting', value: 'reporting' },
        { label: 'Designated Reporting', value: 'designatedReporting' },
      ],
      filterDefault: 'reporting',
      filterType: 'reporting'
    }
    // filter stuff:
    // Status / Category
    // Open   / Sports
    // In Reporting / Environment
    // Closed / Animals
    // --     / Politics
    // --     / Finance
    // --     / Racing
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
    console.log(p, s)

    return (
      <section className={Styles.Markets}>
        <Helmet>
          <title>My Markets</title>
        </Helmet>
        <div
          className={Styles.Markets__SortBar}
        >
          <div
            className={Styles['Markets__SortBar-title']}
          >
            Reporting
          </div>
          <div
            className={Styles['Markets__SortBar-sort']}
          >
            <Dropdown default={s.sortDefault} options={s.sortOptions} onChange={this.changeDropdown} />
          </div>
          <div
            className={Styles['Markets__SortBar-filter']}
          >
             <Dropdown default={s.filterDefault} options={s.filterOptions} onChange={this.changeDropdown} />
          </div>
        </div>
        <MarketsList
          isLogged={p.isLogged}
          markets={p.myMarkets}
          filteredMarkets={[0, 1]}
          location={p.location}
          history={p.history}
          scalarShareDenomination={p.scalarShareDenomination}
          toggleFavorite={p.toggleFavorite}
          loadMarketsInfo={p.loadMarketsInfo}
          linkType={TYPE_REPORT}
          outstandingReturns
        />
      </section>
    )
  }
}

//
// <Dropdown default={s.graphPeriodDefault} options={s.graphPeriodOptions} onChange={this.changeDropdown} />

export default MyMarkets
