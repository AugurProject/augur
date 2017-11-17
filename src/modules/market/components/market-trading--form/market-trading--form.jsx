/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import BigNumber from 'bignumber.js'

import { MARKET, LIMIT } from 'modules/transactions/constants/types'
import { SCALAR } from 'modules/markets/constants/market-types'

import Styles from 'modules/market/components/market-trading--form/market-trading--form.styles'

const PRECISION = 4

class MarketTradingForm extends Component {
  static propTypes = {
    market: PropTypes.object.isRequired,
    selectedNav: PropTypes.string.isRequired,
    orderType: PropTypes.string.isRequired,
    orderPrice: PropTypes.string.isRequired,
    orderQuantity: PropTypes.string.isRequired,
    orderEstimate: PropTypes.string.isRequired,
    isOrderValid: PropTypes.bool.isRequired,
    selectedOutcome: PropTypes.object.isRequired,
    nextPage: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    const p = this.props

    return (
      <ul className={Styles['TradingForm__form-body']}>
        <li>
          <label>Order Type</label>
          <div className={Styles.TradingForm__type}>
            <button
              className={classNames({ [`${Styles.active}`]: p.orderType === MARKET })}
              onClick={() => p.updateState('orderType', MARKET)}
            >Market</button>
            <button
              className={classNames({ [`${Styles.active}`]: p.orderType === LIMIT })}
              onClick={() => p.updateState('orderType', LIMIT)}
            >Limit</button>
          </div>
        </li>
        { !p.isMobile && p.market.marketType !== SCALAR &&
          <li>
            <label>Outcome</label>
            <div className={Styles['TradingForm__static-field']}>{ p.selectedOutcome.name }</div>
          </li>
        }
        <li>
          <label htmlFor="tr__input--quantity">Quantity</label>
          <input
            id="tr__input--quantity"
            type="number"
            step={10**-PRECISION}
            placeholder="0.0000 Shares"
            value={p.orderQuantity instanceof BigNumber ? p.orderQuantity.toNumber() : p.orderQuantity}
            onChange={e => p.updateState('orderQuantity', e.target.value)}
          />
        </li>
        <li>
          <label htmlFor="tr__input--limit-price">Limit Price</label>
          <input
            id="tr__input--limit-price"
            type="number"
            step={10**-PRECISION}
            placeholder="0.0000 ETH"
            value={p.orderPrice instanceof BigNumber ? p.orderPrice.toNumber() : p.orderPrice}
            onChange={e => p.updateState('orderPrice', e.target.value)}
          />
        </li>
        <li>
          <label>Est. Cost</label>
          <div className={Styles['TradingForm__static-field']}>{ p.orderEstimate }</div>
        </li>
        <li className={Styles['TradingForm__button--review']}>
          <button
            disabled={!p.isOrderValid}
            onClick={p.isOrderValid && p.nextPage}
          >Review</button>
        </li>
      </ul>
    )
  }
}

export default MarketTradingForm
