/* eslint-disable jsx-a11y/no-static-element-interactions */ // needed because <button> cannot take the place <ul> in the table structure
/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Close } from 'modules/common/components/icons'
import getValue from 'utils/get-value'
import { CLOSE_DIALOG_NO_ORDERS, CLOSE_DIALOG_SUCCESS, CLOSE_DIALOG_PARTIALLY_FAILED, CLOSE_DIALOG_CLOSING, CLOSE_DIALOG_FAILED } from 'modules/market/constants/close-dialog-status'
import Styles from 'modules/market/components/market-positions-list--position/market-positions-list--position.styles'

export default class MarketPositionsListPosition extends Component {
  static propTypes = {
    outcomeName: PropTypes.string.isRequired,
    position: PropTypes.object.isRequired,
    openOrders: PropTypes.array.isRequired,
    isExtendedDisplay: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    closePositionStatus: PropTypes.object.isRequired,
    outcome: PropTypes.object,
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

    this.messageMap = {
      [CLOSE_DIALOG_NO_ORDERS]: 'Position cannot be closed. Create a new order to sell your shares.',
      [CLOSE_DIALOG_PARTIALLY_FAILED]: 'Position partially closed. Create a new order to sell your remaining shares.',
      [CLOSE_DIALOG_FAILED]: 'Position failed to closed. Try again',
    }

    this.state = {
      showConfirm: false,
      confirmHeight: 'auto',
      confirmMargin: '0px',
      positionStatus: null,
      closeOutcomeName: null,
    }

    this.toggleConfirm = this.toggleConfirm.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    const { closePositionStatus, position } = prevProps
    const status = closePositionStatus[position.marketId]
    const positionStatus = status && status[position.outcomeId] ? status[position.outcomeId] : null
    if (positionStatus !== this.state.positionStatus) {
      this.updateState(positionStatus, positionStatus !== null)
    }
  }

  updateState(positionStatus, showConfirm) {
    let confirmation = showConfirm
    if (positionStatus === CLOSE_DIALOG_SUCCESS) confirmation = false
    if (positionStatus === CLOSE_DIALOG_CLOSING) confirmation = false
    this.setState({
      positionStatus,
      showConfirm: confirmation,
    })
  }

  toggleConfirm() {
    const { outcomeName } = this.props
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
      closeOutcomeName: outcomeName,
    })
  }

  render() {
    const {
      isExtendedDisplay,
      isMobile,
      outcomeName,
      openOrders,
      position,
      outcome,
    } = this.props
    const s = this.state

    const confirmStyle = {
      height: s.confirmHeight,
      marginTop: s.confirmMargin,
    }
    const positionShares = getValue(position, 'qtyShares.formatted')
    const isClosable = getValue(position, 'isClosable')

    let message = this.messageMap[s.positionStatus]
    let cancelOnly = true
    if (!message && openOrders.length > 0 && isClosable && s.closeOutcomeName === position.name) {
      message = 'Positions cannot be closed while orders are pending.'
    } else if (!message && s.showConfirm && isClosable && s.closeOutcomeName === position.name) {
      cancelOnly = false
      message = `Close position by ${getValue(position, 'qtyShares.value') > 0 ? 'selling' : 'buying back'} ${positionShares.replace('-', '')} shares ${outcomeName ? `of "${outcomeName}"` : ''} at market price?`
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
          { outcomeName || getValue(position, 'purchasePrice.formatted')}
        </li>
        <li>
          { positionShares }
        </li>
        <li>
          { getValue(position, 'purchasePrice.formatted') }
        </li>
        { isExtendedDisplay && !isMobile &&
          <li>
            {getValue(outcome, 'lastPrice.formatted') }
          </li>
        }
        { !isMobile && <li>{ getValue(position, 'unrealizedNet.formatted') }</li>}
        { !isMobile && <li>{ getValue(position, 'realizedNet.formatted')} </li> }
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
          className={classNames(Styles.Position__confirm, { [`${Styles['is-open']}`]: (s.showConfirm && message) })}
          style={confirmStyle}
        >
          { message &&
            <div className={Styles['Position__confirm-details']}>
              <p>{message}</p>
              { cancelOnly && s.showConfirm &&
                <div className={Styles['Position__confirm-options']}>
                  <button onClick={this.toggleConfirm}>{Close}</button>
                </div>
              }
              { !cancelOnly &&
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
