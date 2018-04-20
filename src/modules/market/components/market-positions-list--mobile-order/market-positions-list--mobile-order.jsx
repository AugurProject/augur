/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Close } from 'modules/common/components/icons'

import getValue from 'utils/get-value'

import Styles from 'modules/market/components/market-positions-list--mobile-order/market-positions-list--mobile-order.styles'

export default class MobileOrders extends Component {
  static propTypes = {
    order: PropTypes.object.isRequired,
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
      confirmHeight = `${this.order.clientHeight}px`
    }

    if (this.order.offsetTop !== this.confirmMessage.offsetTop) {
      confirmMargin = `${this.order.offsetTop - this.confirmMessage.offsetTop}px`
    }

    this.setState({
      confirmHeight,
      confirmMargin,
      showConfirm: !this.state.showConfirm,
    })
  }

  render() {
    const { order } = this.props
    const s = this.state

    const confirmStyle = {
      height: s.confirmHeight,
      marginTop: s.confirmMargin,
    }

    return (
      <ul
        ref={(order) => { this.order = order }}
        className={classNames(Styles.MobileOrder, { [`${Styles.pending}`]: order.pending })}
      >
        <li>QTY</li>
        <li>{ getValue(order, 'unmatchedShares.formatted') }</li>
        <li>Price</li>
        <li>{ getValue(order, 'avgPrice.formatted') }</li>
        <li>
          { !order.pending &&
            <button
              className={Styles['MobileOrder__close-order']}
              onClick={this.toggleConfirm}
            >{ Close }
            </button>
          }
        </li>
        <div
          ref={(confirmMessage) => { this.confirmMessage = confirmMessage }}
          className={classNames(Styles.MobileOrder__confirm, { [`${Styles['is-open']}`]: s.showConfirm })}
          style={confirmStyle}
        >
          <div className={Styles['MobileOrder__confirm-details']}>
            <p>Cancel Open Order?</p>
            <div className={Styles['MobileOrder__confirm-options']}>
              <button
                onClick={(e) => {
                  order.cancelOrder()
                  this.toggleConfirm()
                }}
              >
                Yes
              </button>
              <button onClick={this.toggleConfirm}>No</button>
            </div>
          </div>
        </div>
      </ul>
    )
  }
}
