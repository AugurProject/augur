import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Dropdown from 'modules/common/components/dropdown/dropdown'
import MarketPortfolioCard from 'modules/market/components/market-portfolio-card/market-portfolio-card'

import Styles from 'modules/portfolio/components/positions-markets-list/positions-markets-list.styles'

function createFilterObject(markets) {
  // Used to generating the filter based on the markets passed tags. will only add each tag one time.
  let filterType = 'none'
  let defaultFilterType = 'none'
  const filterOptions = []

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
    positionsDefault: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    // NOTE: didn't make this a container because it is reused in 3 different ways, seemed easier to seperate markets in positions and pass market arrays and filter categories

    // use the function above this class to calculate the filters for this group of markets
    const filter = createFilterObject(this.props.markets)

    this.state = {
      sortType: 'volume',
      defaultSortType: 'volume',
      sortOptions: [
        { label: 'Volume', value: 'volume' },
        { label: 'Newest', value: 'newest' },
        { label: 'Expiring Soon', value: 'expiring' },
        { label: 'Fees', value: 'fees' }
      ],
      filterType: filter.filterType,
      defaultFilterType: filter.defaultFilterType,
      filterOptions: filter.filterOptions
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

    return (
      <div className={Styles.PositionsMarketsList}>
        <div className={Styles.PositionsMarketsList__SortBar}>
          <div className={Styles['PositionsMarketsList__SortBar-title']}>
            {p.title}
          </div>
          <div className={Styles['PositionsMarketsList__SortBar-sort']}>
            <Dropdown default={s.defaultSortType} options={s.sortOptions} onChange={this.changeDropdown} />
          </div>
          <div className={Styles['PositionsMarketsList__SortBar-filter']}>
            <Dropdown default={s.defaultFilterType} options={s.filterOptions} onChange={this.changeDropdown} />
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
            positionsDefault={p.positionsDefault}
          />
        ))}
      </div>
    )
  }
}

export default PositionsMarketsList
