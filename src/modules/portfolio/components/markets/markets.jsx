import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import Dropdown from 'modules/common/components/dropdown/dropdown'
// import MarketCard from 'modules/market/components/market-card/market-card'
import MarketsList from 'modules/markets/components/markets-list'
import Styles from 'modules/portfolio/components/markets/markets.styles'
import { TYPE_REPORT } from 'modules/market/constants/link-types'
// export default () => (

class MyMarkets extends Component {
  static PropTypes = {

  }

  constructor(props) {
    super(props)

    this.state = {
      sortOptions: [
        { label: 'Volumne', value: 'volumne' },
        { label: 'Newest', value: 'newest' },
        { label: 'Fees', value: 'fees' },
        { label: 'Expiring Soon', value: 'expiring' }
      ],
      sortDefault: 'volumne',
      sortType: 'volume'
    }

    this.changeDropdown = this.changeDropdown.bind(this)
  }

  changeDropdown(value) {
    let newType = this.state.sortType
    // let newPeriod = this.state.graphPeriod

    this.state.sortOptions.forEach((type, ind) => {
      if (type.value === value) {
        newType = value
      }
    })

    // this.state.graphPeriodOptions.forEach((period, ind) => {
    //   if (period.value === value) {
    //     newPeriod = value
    //   }
    // })

    this.setState({ sortType: newType })
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
            Manual Reporting
          </div>
          <div
            className={Styles['Markets__SortBar-dropdowns']}
          >
             <Dropdown default={s.sortDefault} options={s.sortOptions} onChange={this.changeDropdown} />
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
        />
      </section>
    )
  }
}

//
// <Dropdown default={s.graphPeriodDefault} options={s.graphPeriodOptions} onChange={this.changeDropdown} />

export default MyMarkets
