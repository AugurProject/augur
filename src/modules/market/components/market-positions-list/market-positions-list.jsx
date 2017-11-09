import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import MarketPositionsListPosition from 'modules/market/components/market-positions-list--position/market-positions-list--position'
import MarketPositionsListOrder from 'modules/market/components/market-positions-list--order/market-positions-list--order'
import { ChevronDown } from 'modules/common/components/icons/icons'
import toggleHeight from 'utils/toggle-height/toggle-height'

import Styles from 'modules/market/components/market-positions-list/market-positions-list.styles'
import ToggleHeightStyles from 'utils/toggle-height/toggle-height.styles'

export default class MarketPositionsList extends Component {
  static propTypes = {
    positions: PropTypes.array.isRequired,
    isMobile: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      isOpen: true,
    }
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <section className={Styles.MarketPositionsList}>
        <button
          className={Styles.MarketPositionsList__heading}
          onClick={() => { !p.isMobile && toggleHeight(this.outcomeList, s.isOpen, () => { this.setState({ isOpen: !s.isOpen }) }) }}
        >
          <h2>Positions</h2>
          { !p.isMobile &&
            <span className={classNames({ [`${Styles['is-open']}`]: s.isOpen })}>{ ChevronDown }</span>
          }
        </button>
        <div
          ref={(outcomeList) => { this.outcomeList = outcomeList }}
          className={classNames(ToggleHeightStyles['toggle-height-target'], ToggleHeightStyles['start-open'])}
        >
          <div className={Styles.MarketPositionsList__table}>
            <ul className={Styles['MarketPositionsList__table-header']}>
              <li>Position</li>
              <li><span>Quantity</span></li>
              <li><span>Average <span />Price</span></li>
              <li><span>Unrealized <span />P/L</span></li>
              <li><span>Realized <span />P/L</span></li>
              <li><span>Action</span></li>
            </ul>
            <div className={Styles['MarketPositionsList__table-body']}>
              { p.positions && p.positions.map((position, i) => (
                <MarketPositionsListPosition
                  key={i}
                  name={position.name}
                  position={position.position}
                  pending={position.pending}
                />
              ))}
            </div>
            <ul className={Styles['MarketPositionsList__table-header']}>
              <li>Open Orders</li>
              <li><span>Quantity</span></li>
              <li><span>Average <span />Price</span></li>
              <li></li>
              <li></li>
              <li><span>Action</span></li>
            </ul>
            <div className={Styles['MarketPositionsList__table-body']}>
              { p.orders && p.orders.map((order, i) => (
                <MarketPositionsListOrder
                  key={i}
                  name={order.name}
                  order={order.order}
                  pending={order.pending}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }
}
