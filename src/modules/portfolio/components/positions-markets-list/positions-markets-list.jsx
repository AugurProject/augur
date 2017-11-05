import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { TYPE_DISPUTE } from 'modules/market/constants/link-types'
import Dropdown from 'modules/common/components/dropdown/dropdown'
import MarketPortfolioCard from 'modules/market/components/market-portfolio-card/market-portfolio-card'

import Styles from 'modules/portfolio/components/positions-markets-list/positions-markets-list.styles'

class PositionsMarketsList extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    markets: PropTypes.array.isRequired,
    closePositionStatus: PropTypes.object.isRequired,
    scalarShareDenomination: PropTypes.object.isRequired,
    orderCancellation: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    linkType: PropTypes.string,
  }

  constructor(props) {
    super(props)
    // TODO: the filter will most likely need to be props because it's going to change based on the market's tags.

    this.state = {
      sortType: 'volume',
      defaultSortType: 'volume',
      sortOptions: [
        { label: 'Volume', value: 'volume' },
        { label: 'Newest', value: 'newest' },
        { label: 'Expiring Soon', value: 'expiring' },
        { label: 'Fees', value: 'fees' }
      ],
      filterType: 'finance',
      defaultFilterType: 'finance',
      filterOptions: [
        { label: 'Finance', value: 'finance' },
        { label: 'Sports', value: 'sports' },
        { label: 'Politics', value: 'politics' },
        { label: 'Animals', value: 'animals' },
        { label: 'Environment', value: 'environment' },
      ]
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
    console.log(p, s, p.title)

    return(
      <div className={Styles.PositionsMarketsList}>
        <div className={Styles.PositionsMarketsList__SortBar}>
          <div className={Styles['PositionsMarketsList__SortBar-title']}>
            {p.title}
          </div>
          <div className={Styles['PositionsMarketsList__SortBar-sort']}>
            <Dropdown default={s.sortDefault} options={s.sortOptions} onChange={this.changeDropdown} />
          </div>
          <div className={Styles['PositionsMarketsList__SortBar-filter']}>
            <Dropdown default={s.filterDefault} options={s.filterOptions} onChange={this.changeDropdown} />
          </div>
        </div>
        {p.markets.map(market => (
          <MarketPortfolioCard
            key={market.id}
            market={market}
            closePositionStatus={p.closePositionStatus}
            scalarShareDenomination={p.scalarShareDenomination}
            orderCancellation={p.orderCancellation}
            location={p.location}
            history={p.history}
            linkType={p.linkType}
          />
        ))}
      </div>
    )
  }
}

export default PositionsMarketsList
