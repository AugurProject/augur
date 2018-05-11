/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import MarketPositionsListPosition from 'modules/market/components/market-positions-list--position/market-positions-list--position'
import MarketPositionsListOrder from 'modules/market/components/market-positions-list--order/market-positions-list--order'
import NullStateMessage from 'modules/common/components/null-state-message/null-state-message'
import { ChevronDown } from 'modules/common/components/icons'
import toggleHeight from 'utils/toggle-height/toggle-height'

import Styles from 'modules/market/components/market-positions-list/market-positions-list.styles'
import ToggleHeightStyles from 'utils/toggle-height/toggle-height.styles'

export default class MarketPositionsList extends Component {
  static propTypes = {
    openOrders: PropTypes.array,
    positions: PropTypes.array.isRequired,
    closePositionStatus: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
    }
  }

  render() {
    const {
      openOrders,
      positions,
      closePositionStatus,
    } = this.props
    const s = this.state

    return (
      <section className={Styles.MarketPositionsList}>
        <button
          className={Styles.MarketPositionsList__heading}
          onClick={() => { toggleHeight(this.outcomeList, s.isOpen, () => { this.setState({ isOpen: !s.isOpen }) }) }}
        >
          <h2>My Positions</h2>
          <span className={classNames({ [`${Styles['is-open']}`]: s.isOpen })}><ChevronDown /></span>
        </button>
        <div
          ref={(outcomeList) => { this.outcomeList = outcomeList }}
          className={classNames(ToggleHeightStyles['open-on-mobile'], ToggleHeightStyles['toggle-height-target'])}
        >
          <div className={Styles.MarketPositionsList__table}>
            { positions.length > 0 &&
              <ul className={Styles['MarketPositionsList__table-header']}>
                <li>Position</li>
                <li><span>Quantity</span></li>
                <li><span>Price</span></li>
                <li><span>Unrealized <span />P/L</span></li>
                <li><span>Realized <span />P/L</span></li>
                <li><span>Action</span></li>
              </ul>
            }
            { positions.length > 0 &&
              <div className={Styles['MarketPositionsList__table-body']}>
                { positions && positions.map((position, i) => (
                  <MarketPositionsListPosition
                    key={i}
                    outcomeName={position.name}
                    position={position}
                    openOrders={openOrders.filter(order => order.id === position.id && order.pending === true)}
                    isExtendedDisplay={false}
                    isMobile={false}
                    closePositionStatus={closePositionStatus}
                  />
                ))}
              </div>
            }
            { openOrders.length > 0 &&
              <ul className={Styles['MarketPositionsList__table-header']}>
                <li>Open Orders</li>
                <li><span>Quantity</span></li>
                <li><span>Average <span />Price</span></li>
                <li />
                <li />
                <li><span>Action</span></li>
              </ul>
            }
            { openOrders.length > 0 &&
              <div className={Styles['MarketPositionsList__table-body']}>
                { openOrders.map((order, i) => (
                  <MarketPositionsListOrder
                    key={i}
                    outcomeName={order.name}
                    order={order}
                    pending={order.pending}
                    isExtendedDisplay={false}
                    isMobile={false}
                  />
                ))}
              </div>
            }
          </div>
          { positions.length === 0 && openOrders.length === 0 &&
            <NullStateMessage className={Styles['MarketPositionsList__null-state']} message="No positions or open orders" />
          }
        </div>
      </section>
    )
  }
}
