/* eslint-disable jsx-a11y/no-static-element-interactions */ // needed because <button> cannot take the place <ul> in the table structure
/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import getValue from 'utils/get-value'
import { CLOSE_DIALOG_NO_ORDERS } from 'modules/market/constants/close-dialog-status'
import Styles from 'modules/market/components/market-positions-list--position/market-positions-list--position.styles'

export default class MarketPositionsListPosition extends Component {
  static propTypes = {
    outcomeName: PropTypes.string.isRequired,
    position: PropTypes.object.isRequired,
    openOrders: PropTypes.array.isRequired,
    isExtendedDisplay: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    closePositionStatus: PropTypes.object.isRequired,
  }

  static calcAvgDiff(position, order) {
    const positionAvg = getValue(position, 'avgPrice.formattedValue') || 0
    const positionShares = getValue(position, 'qtyShares.formattedValue') || 0

    const orderPrice = (getValue(order, 'purchasePrice.formattedValue') || 0)
    const orderShares = (getValue(order, 'qtyShares.formattedValue') || 0)

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
      positionStatus: null,
    }

    this.toggleConfirm = this.toggleConfirm.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    const { closePositionStatus, position } = prevProps
    const status = closePositionStatus[position.marketId]
    const positionStatus = status ? status[position.outcomeId] : null
    if (positionStatus !== this.state.positionStatus) {
      this.updateState(positionStatus, positionStatus !== null)
    }
  }

  updateState(positionStatus, showConfirm) {
    this.setState({
      positionStatus,
      showConfirm,
    })
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
    const {
      isExtendedDisplay,
      isMobile,
      outcomeName,
      openOrders,
      position,
    } = this.props
    const s = this.state

    const confirmStyle = {
      height: s.confirmHeight,
      marginTop: s.confirmMargin,
    }
    const positionShares = getValue(position, 'qtyShares.formatted')

    let message = null
    let onlyOkButton = true
    if (s.positionStatus === CLOSE_DIALOG_NO_ORDERS) {
      message = 'No Open Orders found, Position can not be closed.'
    } else if (openOrders.length > 0) {
      message = 'Positions cannot be closed while orders are pending.'
    } else if (s.showConfirm) {
      onlyOkButton = false
      message = `Close position by ${getValue(position, 'qtyShares.value') < 0 ? 'selling' : 'buying back'} ${positionShares.replace('-', '')} shares ${outcomeName ? `of "${outcomeName}"` : ''} at market price?`
    }

    return (
      <ul
        ref={(position) => { this.position = position }}
        className={!isMobile ?
          classNames(Styles.Position, { [Styles['Position-not_extended']]: isExtendedDisplay })
          : Styles.PortMobile
        }
      >
        <li>
          { outcomeName }
        </li>
        <li>
          { positionShares }
        </li>
        <li>
          { getValue(position, 'purchasePrice.formatted') }
        </li>
        { isExtendedDisplay && !isMobile &&
          <li>
            {getValue(position, 'lastPrice.formatted') }
          </li>
        }
        { !isMobile && <li>{ getValue(position, 'realizedNet.formatted')} </li> }
        { !isMobile && <li>{ getValue(position, 'unrealizedNet.formatted') }</li>}
        { isExtendedDisplay &&
          <li>
            {getValue(position, 'totalNet.formatted') }
          </li>
        }
        <li>
          {positionShares !== '0' ?
            <button onClick={this.toggleConfirm}>Close</button> :
            <span className={Styles.NotActive}>Close</span>
          }
        </li>
        <div
          ref={(confirmMessage) => { this.confirmMessage = confirmMessage }}
          className={classNames(Styles.Position__confirm, { [`${Styles['is-open']}`]: s.showConfirm })}
          style={confirmStyle}
        >
          { message &&
            <div className={Styles['Position__confirm-details']}>
              <p>{message}</p>
              { onlyOkButton &&
                <div className={Styles['Position__confirm-options']}>
                  <button onClick={this.toggleConfirm}>Ok</button>
                </div>
              }
              { !onlyOkButton &&
              <div className={Styles['Position__confirm-options']}>
                <button
                  onClick={(e) => {
                    position.closePosition(position.marketId, position.outcomeId)
                    this.toggleConfirm()
                  }}
                >
                Yes
                </button>
                <button onClick={this.toggleConfirm}>No</button>
              </div>
              }
            </div>
          }
        </div>
      </ul>
    )
  }
}
