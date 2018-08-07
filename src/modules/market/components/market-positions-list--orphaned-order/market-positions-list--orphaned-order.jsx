/* eslint-disable jsx-a11y/no-static-element-interactions */ // needed because <button> cannot take the place <ul> in the table structure

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classNames from 'classnames'

import getValue from 'utils/get-value'
import { SELL } from 'modules/trade/constants/types'

import OrphanedStyles from 'modules/market/components/market-positions-list--orphaned-order/market-positions-list--orphaned-order.styles'
import Styles from 'modules/market/components/market-positions-list--order/market-positions-list--order.styles'

export default class OrphanedOrder extends Component {
  static propTypes = {
    isExtendedDisplay: PropTypes.bool,
    isMobile: PropTypes.bool,
    outcomeName: PropTypes.string,
    order: PropTypes.object,
    pending: PropTypes.bool,
    outcome: PropTypes.object,
    cancelOrphanedOrder: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      showConfirm: false,
      confirmHeight: 'auto',
      confirmMargin: '0px',
    }

    this.orderStatusText = {
      CLOSE_DIALOG_CLOSING: '',
      CLOSE_DIALOG_FAILED: 'Failed to Cancel Order',
      CLOSE_DIALOG_PENDING: 'Cancellation Pending',
    }

    this.toggleConfirm = this.toggleConfirm.bind(this)
    this.cancelOrder = this.cancelOrder.bind(this)
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

  cancelOrder() {
    this.props.cancelOrphanedOrder(this.props.order)
  }

  render() {
    const {
      isExtendedDisplay,
      isMobile,
      outcomeName,
      order,
      pending,
      outcome,
    } = this.props
    const { orderCancellationStatus } = order
    const s = this.state
    const orderPrice = getValue(order, 'fullPrecisionPrice')
    const orderShares = getValue(order, 'amount')
    const orderType = getValue(order, 'type')
    const confirmStyle = {
      height: s.confirmHeight,
      marginTop: s.confirmMargin,
    }

    return (
      <ul
        ref={(order) => { this.order = order }}
        className={!isMobile ?
          classNames(Styles.Order, OrphanedStyles.Order, { [Styles['Order-not_extended']]: isExtendedDisplay })
          : Styles.PortMobile
        }
      >
        <li>
          { outcomeName || orderPrice}
          { pending &&
            <span className={Styles.Order__pending}>
              <span>{`${this.orderStatusText[orderCancellationStatus]}`}</span>
            </span>
          }
        </li>
        <li />
        <li>
          { order.type === SELL ? <span>-</span> : <span>+</span> } { orderShares }
        </li>
        <li>
          { orderPrice }
        </li>
        { isExtendedDisplay && !isMobile && outcome &&
          <li />
        }
        { !isMobile &&
          <li />
        }
        { !isMobile &&
          <li />
        }
        { isExtendedDisplay &&
          <li />
        }
        <li>
          { pending ?
            <span className={Styles.NotActive}>Cancel</span> :
            <button className={OrphanedStyles.Order__cancel} onClick={this.cancelOrder}>Cancel</button>
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
              <p>{`Cancel order to ${orderType} ${orderShares} shares ${outcomeName ? `of "${outcomeName}"` : ''} at ${orderPrice} ETH?`}</p>
              <div className={Styles['Order__confirm-options']}>
                <button onClick={(e) => { order.cancelOrder(order.id, order.marketId, order.outcomeId, order.type); this.toggleConfirm() }}>Yes</button>
                <button onClick={this.toggleConfirm}>No</button>
              </div>
            </div>
          }
        </div>
        <div className={classNames(OrphanedStyles.Order__learnMore, { [OrphanedStyles['Order__learnMore-extended']]: !isExtendedDisplay })}>
          This is an orphaned order. Please cancel it. <span className={OrphanedStyles.Order__link}><a href="http://docs.augur.net/#orphaned-order" target="_blank" rel="noopener noreferrer">Learn More</a></span>
        </div>
      </ul>
    )
  }
}
