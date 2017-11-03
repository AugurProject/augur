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
    isLogged: PropTypes.bool.isRequired,
    hasAllTransactionsLoaded: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    myMarkets: PropTypes.array.isRequired,
    scalarShareDenomination: PropTypes.object.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    loadMarketsInfo: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      sortOptionsReporting: [
        { label: 'Volume', value: 'volume' },
        { label: 'Newest', value: 'newest' },
        { label: 'Fees', value: 'fees' },
        { label: 'Expiring Soon', value: 'expiring' }
      ],
      sortDefaultReporting: 'volume',
      sortTypeReporting: 'volume',
      filterOptionsReporting: [
        { label: 'Sports', value: 'sports' },
        { label: 'Finance', value: 'finance' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Politics', value: 'politics' },
        { label: 'Environment', value: 'environment' },
      ],
      filterDefaultReporting: 'finance',
      filterTypeReporting: 'finance',
      sortOptionsDesignatedReporting: [
        { label: 'Volume', value: 'volume' },
        { label: 'Newest', value: 'newest' },
        { label: 'Fees', value: 'fees' },
        { label: 'Expiring Soon', value: 'expiring' }
      ],
      sortDefaultDesignatedReporting: 'volume',
      sortTypeDesignatedReporting: 'volume',
      filterOptionsDesignatedReporting: [
        { label: 'Sports', value: 'sports' },
        { label: 'Finance', value: 'finance' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Politics', value: 'politics' },
        { label: 'Environment', value: 'environment' },
      ],
      filterDefaultDesignatedReporting: 'sports',
      filterTypeDesignatedReporting: 'sports',
      filteredMarketsReporting: [0, 1],
      filteredMarketsDesignatedReporting: [2]
    }

    this.changeDropdown = this.changeDropdown.bind(this)
  }

  changeDropdown(value) {
    let sortTypeReporting = this.state.sortTypeReporting
    let filterTypeReporting = this.state.filterTypeReporting
    let sortTypeDesignatedReporting = this.state.sortTypeDesignatedReporting
    let filterTypeDesignatedReporting = this.state.filterTypeDesignatedReporting

    this.state.sortOptionsReporting.forEach((type, ind) => {
      if (type.value === value) {
        sortTypeReporting = value
      }
    })

    this.state.filterOptionsReporting.forEach((type, ind) => {
      if (type.value === value) {
        filterTypeReporting = value
      }
    })

    this.state.sortOptionsDesignatedReporting.forEach((type, ind) => {
      if (type.value === value) {
        sortTypeDesignatedReporting = value
      }
    })

    this.state.filterOptionsDesignatedReporting.forEach((type, ind) => {
      if (type.value === value) {
        filterTypeDesignatedReporting = value
      }
    })


    this.setState({
      sortTypeReporting,
      filterTypeReporting,
      sortTypeDesignatedReporting,
      filterTypeDesignatedReporting
    })
  }

  render() {
    const p = this.props
    const s = this.state

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
            <Dropdown default={s.sortDefaultReporting} options={s.sortOptionsReporting} onChange={this.changeDropdown} />
          </div>
          <div
            className={Styles['Markets__SortBar-filter']}
          >
            <Dropdown default={s.filterDefaultReporting} options={s.filterOptionsReporting} onChange={this.changeDropdown} />
          </div>
        </div>
        <MarketsList
          isLogged={p.isLogged}
          markets={p.myMarkets}
          filteredMarkets={s.filteredMarketsReporting}
          location={p.location}
          history={p.history}
          scalarShareDenomination={p.scalarShareDenomination}
          toggleFavorite={p.toggleFavorite}
          loadMarketsInfo={p.loadMarketsInfo}
          linkType={TYPE_REPORT}
          outstandingReturns
        />
        <div
          className={Styles.Markets__SortBar}
        >
          <div
            className={Styles['Markets__SortBar-title']}
          >
            Designated Reporting
          </div>
          <div
            className={Styles['Markets__SortBar-sort']}
          >
            <Dropdown default={s.sortDefaultDesignatedReporting} options={s.sortOptionsDesignatedReporting} onChange={this.changeDropdown} />
          </div>
          <div
            className={Styles['Markets__SortBar-filter']}
          >
            <Dropdown default={s.filterDefaultDesignatedReporting} options={s.filterOptionsDesignatedReporting} onChange={this.changeDropdown} />
          </div>
        </div>
        <MarketsList
          isLogged={p.isLogged}
          markets={p.myMarkets}
          filteredMarkets={s.filteredMarketsDesignatedReporting}
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

export default MyMarkets
