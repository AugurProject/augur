/* eslint-disable jsx-a11y/no-static-element-interactions */ // needed because <button> cannot take the place <ul> in the table structure

import React, { Component } from 'react'
import classNames from 'classnames'

import getValue from 'utils/get-value'
import { CLOSE_DIALOG_CLOSING } from 'modules/market/constants/close-dialog-status'
import Styles from 'modules/market/components/market-positions-list--order/market-positions-list--order.styles'

export default class Order extends Component {
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
      confirmMargin
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
    const s = this.state
    const p = this.props

    const confirmStyle = {
      height: s.confirmHeight,
      marginTop: s.confirmMargin,
    }

    return (
      <ul
        ref={(order) => { this.order = order }}
        className={!p.isMobile ? Styles.Order : Styles.PortMobile}
      >
        <li>
          { getValue(p, 'name') }
          { p.pending &&
            <span className={Styles.Order__pending}>
              { p.pending === CLOSE_DIALOG_CLOSING &&
                <span>Cancellation Pending</span>
              }
            </span>
          }
        </li>
        <li>
          { p.type === 'sell' ? <span>-</span> : <span>+</span> } { getValue(p, 'order.unmatchedShares.formatted') }
        </li>
        <li>
          { getValue(p, 'order.avgPrice.formatted') }
        </li>
        { p.isExtendedDisplay && !p.isMobile &&
          <li />
        }
        { !p.isMobile && <li /> }
        { !p.isMobile && <li /> }
        { p.isExtendedDisplay &&
          <li />
        }
        <li>
          { p.pending === CLOSE_DIALOG_CLOSING ?
            <span className={Styles.NotActive}>Cancel</span> :
            <button onClick={this.toggleConfirm}>Cancel</button>
          }
        </li>
        <div
          ref={(confirmMessage) => { this.confirmMessage = confirmMessage }}
          className={classNames(Styles.Order__confirm, { [`${Styles['is-open']}`]: s.showConfirm })}
          style={confirmStyle}
        >
          { p.pending ?
            <div className={Styles['Order__confirm-details']}>
              <p>Orders cannot be closed while they are pending.</p>
              <div className={Styles['Order__confirm-options']}>
                <button onClick={this.toggleConfirm}>Ok</button>
              </div>
            </div> :
            <div className={Styles['Order__confirm-details']}>
              <p>Cancel order for { getValue(p, 'order.unmatchedShares.formatted') } shares of &ldquo;{ getValue(p, 'name') }&rdquo; at { getValue(p, 'order.purchasePrice.formatted') } ETH?</p>
              <div className={Styles['Order__confirm-options']}>
                <button onClick={(e) => { p.order.cancelOrder(p.order.id, p.order.marketId, p.order.outcomeId, p.order.type); this.toggleConfirm() }}>Yes</button>
                <button onClick={this.toggleConfirm}>No</button>
              </div>
            </div>
          }
        </div>
      </ul>
    )
  }
}
