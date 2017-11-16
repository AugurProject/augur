import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import BigNumber from 'bignumber.js'

import makePath from 'modules/routes/helpers/make-path'

import getValue from 'utils/get-value'

import { BID, ASK, MARKET, LIMIT } from 'modules/transactions/constants/types'
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { ACCOUNT_DEPOSIT } from 'modules/routes/constants/views'

import FormStyles from 'modules/common/less/form'
import Styles from 'modules/market/components/market-trading--form/market-trading--form.styles'

const PRECISION = 4

class MarketTradingForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      orderType: LIMIT,
      orderPrice: '',
      orderQuantity: '',
      orderEstimate: '',
      selectedNav: BID,
      isOrderValide: false,
    }
  }

  render() {
    const s = this.state
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
        { p.market.marketType !== SCALAR &&
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
