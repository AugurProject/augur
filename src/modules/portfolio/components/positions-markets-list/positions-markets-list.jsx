import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Dropdown from 'modules/common/components/dropdown/dropdown'
import MarketPortfolioCard from 'modules/market/components/market-portfolio-card/market-portfolio-card'
import NullStateMessage from 'modules/common/components/null-state-message/null-state-message'

import Styles from 'modules/portfolio/components/positions-markets-list/positions-markets-list.styles'

class PositionsMarketsList extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    markets: PropTypes.array.isRequired,
    closePositionStatus: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    linkType: PropTypes.string,
    positionsDefault: PropTypes.bool,
    claimTradingProceeds: PropTypes.func,
    isMobile: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    // NOTE: didn't make this component a container because it is reused in 3 different ways, seemed easier to seperate markets in positions and pass market arrays and filter categories
    this.state = {
      sortType: 'volume',
      defaultSortType: 'volume',
      sortOptions: [
        { label: 'Volume', value: 'volume' },
        { label: 'Newest', value: 'newest' },
        { label: 'Expiring Soon', value: 'expiring' },
        { label: 'Fees', value: 'fees' }
      ],
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
      <div className={classNames(Styles.PositionsMarketsList, { [`${Styles.PositionMarketsListNullState}`]: p.markets.length === 0 })}>
        <div className={Styles.PositionsMarketsList__SortBar}>
          <div className={Styles['PositionsMarketsList__SortBar-title']}>
            {p.title}
          </div>
          <div className={Styles['PositionsMarketsList__SortBar-sort']}>
            <Dropdown default={s.defaultSortType} options={s.sortOptions} onChange={this.changeDropdown} />
          </div>
        </div>
        {p.markets.length ?
          p.markets.map(market =>
            (<MarketPortfolioCard
              key={market.id}
              market={market}
              closePositionStatus={p.closePositionStatus}
              location={p.location}
              history={p.history}
              linkType={p.linkType}
              positionsDefault={p.positionsDefault}
              claimTradingProceeds={p.claimTradingProceeds}
              isMobile={p.isMobile}
            />)):
          <NullStateMessage message="No Markets Available" />}
      </div>
    )
  }
}

export default PositionsMarketsList
