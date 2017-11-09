/* eslint-disable jsx-a11y/no-static-element-interactions */ // needed because <button> cannot take the place <ul> in the table structure

import React, { Component } from 'react'
import classNames from 'classnames'

import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'

import getValue from 'utils/get-value'
import setShareDenomination from 'utils/set-share-denomination'

import Styles from 'modules/market/components/market-positions-list--order/market-positions-list--order.styles'

export default class Order extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showConfirm: false,
      confirmHeight: 'auto',
    }

    this.toggleConfirm = this.toggleConfirm.bind(this)
  }

  toggleConfirm() {
    let confirmHeight = this.state.confirmHeight

    if (!this.state.showConfirm) {
      confirmHeight = `${this.order.clientHeight}px`
    }

    this.setState({
      confirmHeight,
      showConfirm: !this.state.showConfirm,
    })
  }

  render() {
    const s = this.state
    const p = this.props

    const confirmStyle = {
      height: s.confirmHeight,
    }

    return (
      <ul
        ref={order => { this.order = order }}
        className={Styles.Order}
      >
        <li>
          { getValue(p, 'name') }
          { p.pending &&
            <span className={Styles.Order__pending}>Pending</span>
          }
        </li>
        <li>
          { getValue(p, 'order.qtyShares.formatted') }
        </li>
        <li>
          { getValue(p, 'order.purchasePrice.formatted') }
        </li>
        <li></li>
        <li></li>
        <li>
          <button onClick={this.toggleConfirm}>Cancel</button>
        </li>
        <div
          className={classNames(Styles['Order__confirm'], { [`${Styles['is-open']}`] : s.showConfirm })}
          style={confirmStyle}
        >
          <div className={Styles['Order__confirm-details']}>
            <p>Cancel order for { getValue(p, 'order.qtyShares.formatted') } shares of &ldquo;{ getValue(p, 'name') }&rdquo; at { getValue(p, 'order.purchasePrice.formatted') } ETH?</p>
            <div className={Styles['Order__confirm-options']}>
              <button onClick={e => { p.order.cancelOrder(); this.toggleConfirm(); }}>Yes</button>
              <button onClick={this.toggleConfirm}>No</button>
            </div>
          </div>
        </div>
      </ul>
    )
  }
}
