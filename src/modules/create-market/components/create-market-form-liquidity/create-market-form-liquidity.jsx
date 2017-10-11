/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/create-market/components/create-market-form-liquidity/create-market-form-liquidity.styles'
import StylesForm from 'modules/create-market/components/create-market-form/create-market-form.styles'

export default class CreateMarketLiquidity extends Component {

  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    updateNewMarket: PropTypes.func.isRequired,
    validateNumber: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      orderEstimate: '15.366 ETH',
    }
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <ul className={StylesForm.CreateMarketForm__fields}>
        <li className={Styles.CreateMarketLiquidity__settlement}>
          <label htmlFor="cm__input--settlement">
            <span>Settlement Fee</span>
            { p.newMarket.validations[p.newMarket.currentStep].settlementFee.length &&
              <span className={StylesForm.CreateMarketForm__error}>{ p.newMarket.validations[p.newMarket.currentStep].settlementFee }</span>
            }
          </label>
          <input
            id="cm__input--settlement"
            type="number"
            value={p.newMarket.settlementFee}
            placeholder="0%"
            onChange={e => p.validateNumber('settlementFee', e.target.value, 'settlement fee', 0, 100, 1)}
          />
        </li>
        <li>
          <label>
            <span>Add Order for Initial Liquidity</span>
          </label>
          <p>Recommended for adding liquidity to market.</p>
        </li>
        <li className={Styles.CreateMarketLiquidity__order}>
          <div className={Styles['CreateMarketLiquidity__order-form']}>
            <ul className={Styles['CreateMarketLiquidity__order-form-header']}>
              <li className={Styles.active}>Buy</li>
              <li>Sell</li>
            </ul>
            <ul className={Styles['CreateMarketLiquidity__order-form-body']}>
              <li>
                <label>Order Type</label>
                <div className={Styles['CreateMarketLiquidity__order-type']}>
                  <span>Market</span>
                  <span className={Styles.active}>Limit</span>
                </div>
              </li>
              <li>
                <label htmlFor="cm__input--quantity">Quantity</label>
                <input
                  id="cm__input--quantity"
                  type="number"
                  placeholder="0.0000 Shares"
                />
              </li>
              <li>
                <label htmlFor="cm__input--limit-price">Limit Price</label>
                <input
                  id="cm__input--limit-price"
                  type="number"
                  placeholder="0.0000 ETH"
                />
              </li>
              <li>
                <label>Est. Cost</label>
                <div className={Styles['CreateMarketLiquidity__order-est']}>{ s.orderEstimate }</div>
              </li>
            </ul>
          </div>
          <div className={Styles['CreateMarketLiquidity__order-graph']}>
            <p>Order graph</p>
          </div>
        </li>
      </ul>
    )
  }
}
