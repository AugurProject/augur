/* eslint react/no-array-index-key: 0 */  // It's OK in this specific instance as order remains the same

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
      </ul>
    )
  }
}
