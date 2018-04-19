/* eslint-disable jsx-a11y/no-static-element-interactions */ // needed because <button> cannot take the place <ul> in the table structure

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classNames from 'classnames'

import getValue from 'utils/get-value'
import { CLOSE_DIALOG_CLOSING } from 'modules/market/constants/close-dialog-status'
import { SELL } from 'modules/trade/constants/types'

import Styles from 'modules/market/components/market-positions-list--order/market-positions-list--order.styles'

export default class Order extends Component {
  static propTypes = {
    isExtendedDisplay: PropTypes.bool,
    isMobile: PropTypes.bool,
    outcomeName: PropTypes.string,
    order: PropTypes.object,
    pending: PropTypes.string,
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
    const {
      isExtendedDisplay,
      isMobile,
      outcomeName,
      order,
      pending,
    } = this.props
    const s = this.state

    const confirmStyle = {
      height: s.confirmHeight,
      marginTop: s.confirmMargin,
    }

    return (
      <ul
        ref={(order) => { this.order = order }}
        className={!isMobile ? Styles.Order : Styles.PortMobile}
      >
        <li>
          { outcomeName }
          { pending &&
            <span className={Styles.Order__pending}>
              { pending === CLOSE_DIALOG_CLOSING &&
                <span>Cancellation Pending</span>
              }
            </span>
          }
        </li>
        <li>
          { order.type === SELL ? <span>-</span> : <span>+</span> } { getValue(order, 'unmatchedShares.formatted') }
        </li>
        <li>
          { getValue(order, 'avgPrice.formatted') }
        </li>
        { isExtendedDisplay && !isMobile &&
          <li />
        }
        { !isMobile && <li /> }
        { !isMobile && <li /> }
        { isExtendedDisplay &&
          <li />
        }
        <li>
          { pending === CLOSE_DIALOG_CLOSING ?
            <span className={Styles.NotActive}>Cancel</span> :
            <button onClick={this.toggleConfirm}>Cancel</button>
          }
        </li>
        <div
          ref={(confirmMessage) => { this.confirmMessage = confirmMessage }}
          className={classNames(Styles.Order__confirm, { [`${Styles['is-open']}`]: s.showConfirm })}
          style={confirmStyle}
        >
          { pending ?
            <div className={Styles['Order__confirm-details']}>
              <p>Orders cannot be closed while they are pending.</p>
              <div className={Styles['Order__confirm-options']}>
                <button onClick={this.toggleConfirm}>Ok</button>
              </div>
            </div> :
            <div className={Styles['Order__confirm-details']}>
              <p>Cancel order for { getValue(order, 'unmatchedShares.formatted') } shares of &ldquo;{ outcomeName }&rdquo; at { getValue(order, 'avgPrice.formatted') } ETH?</p>
              <div className={Styles['Order__confirm-options']}>
                <button onClick={(e) => { order.cancelOrder(order.id, order.marketId, order.outcomeId, order.type); this.toggleConfirm() }}>Yes</button>
                <button onClick={this.toggleConfirm}>No</button>
              </div>
            </div>
          }
        </div>
      </ul>
    )
  }
}
