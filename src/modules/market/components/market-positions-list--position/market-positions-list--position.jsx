/* eslint-disable jsx-a11y/no-static-element-interactions */ // needed because <button> cannot take the place <ul> in the table structure
/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import getValue from 'utils/get-value'

import Styles from 'modules/market/components/market-positions-list--position/market-positions-list--position.styles'

export default class Position extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    position: PropTypes.object.isRequired,
    openOrders: PropTypes.array.isRequired,
    isExtendedDisplay: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
  }

  static calcAvgDiff(position, order) {
    const positionAvg = getValue(position, 'avgPrice.formattedValue') || 0
    const positionShares = getValue(position, 'qtyShares.formattedValue') || 0

    const orderPrice = (getValue(order, 'order.purchasePrice.formattedValue') || 0)
    const orderShares = (getValue(order, 'order.qtyShares.formattedValue') || 0)

    const newAvg = ((positionAvg * positionShares) + (orderPrice * orderShares)) / (positionShares + orderShares)
    const avgDiff = (newAvg - positionAvg).toFixed(4)

    return avgDiff < 0 ? avgDiff : `+${avgDiff}`
  }

  constructor(props) {
    super(props)

    this.state = {
      showConfirm: false,
      confirmHeight: 'auto',
      confirmMargin: '0px',
    }

    this.toggleConfirm = this.toggleConfirm.bind(this)
  }

  toggleConfirm() {
    let {
      confirmHeight,
      confirmMargin,
    } = this.state

    if (!this.state.showConfirm) {
      confirmHeight = `${this.position.clientHeight}px`
    }

    if (this.position.offsetTop !== this.confirmMessage.offsetTop) {
      confirmMargin = `${this.position.offsetTop - this.confirmMessage.offsetTop}px`
    }

    this.setState({
      confirmHeight,
      confirmMargin,
      showConfirm: !this.state.showConfirm,
    })
  }

  render() {
    const s = this.state
    const p = this.props

    const confirmStyle = {
      height: s.confirmHeight,
      marginTop: s.confirmMargin,
    }

    return (
      <ul
        ref={(position) => { this.position = position }}
        className={!p.isMobile ? Styles.Position : Styles.PortMobile}
      >
        <li>
          { getValue(p, 'name') }
          { p.openOrders && p.openOrders.length > 0 && p.openOrders.map((order, i) => (
            <div key={i} className={Styles.Position__pending}>
              <span className={Styles['Position__pending-title']}>Pending</span>
              <span className={Styles['Position__pending-message']}>Bought { getValue(order, 'order.qtyShares.formatted') } at { getValue(order, 'order.purchasePrice.formatted') } ETH</span>
            </div>
          ))}
        </li>
        <li>
          { getValue(p, 'position.qtyShares.formatted') }
          { p.openOrders && p.openOrders.length > 0 && p.openOrders.map((order, i) => (
            <div key={i} className={Styles.Position__pending}>
              <span>+{ getValue(order, 'order.qtyShares.formatted') }</span>
            </div>
          ))}
        </li>
        <li>
          { getValue(p, 'position.purchasePrice.formatted') }
          { p.openOrders && p.openOrders.length > 0 && p.openOrders.map((order, i) => (
            <div key={i} className={Styles.Position__pending}>
              <span>{ Position.calcAvgDiff(p.position, order) }</span>
            </div>
          ))}
        </li>
        { p.isExtendedDisplay && !p.isMobile &&
          <li>
            {getValue(p, 'position.lastPrice.formatted') }
          </li>
        }
        { !p.isMobile && <li>{ getValue(p, 'position.unrealizedNet.formatted') }</li>}
        { !p.isMobile && <li>{ getValue(p, 'position.realizedNet.formatted')} </li> }
        { p.isExtendedDisplay &&
          <li>
            {getValue(p, 'position.totalNet.formatted') }
          </li>
        }
        <li>
          { getValue(p, 'position.qtyShares.value') > 0 ? <button onClick={this.toggleConfirm}>Close</button> : <span className={Styles.NotActive}>Close</span>}
        </li>
        <div
          ref={(confirmMessage) => { this.confirmMessage = confirmMessage }}
          className={classNames(Styles.Position__confirm, { [`${Styles['is-open']}`]: s.showConfirm })}
          style={confirmStyle}
        >
          { p.openOrders.length > 0 ?
            <div className={Styles['Position__confirm-details']}>
              <p>Positions cannot be closed while orders are pending.</p>
              <div className={Styles['Position__confirm-options']}>
                <button onClick={this.toggleConfirm}>Ok</button>
              </div>
            </div>
            :
            <div className={Styles['Position__confirm-details']}>
              <p>Close position by selling { getValue(p, 'position.qtyShares.formatted') } shares of “{ getValue(p, 'name') }” at { getValue(p, 'position.avgPrice.formatted') } ETH?</p>
              <div className={Styles['Position__confirm-options']}>
                <button onClick={(e) => { p.position.closePosition(p.position.marketId, p.position.outcomeId); this.toggleConfirm() }}>Yes</button>
                <button onClick={this.toggleConfirm}>No</button>
              </div>
            </div>
          }
        </div>
      </ul>
    )
  }
}
