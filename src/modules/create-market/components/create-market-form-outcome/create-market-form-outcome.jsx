import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/create-market/components/create-market-form-outcome/create-market-form-outcome.styles'

export default class CreateMarketDefine extends Component {

  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    updateNewMarket: PropTypes.func.isRequired,
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <ul className={Styles.CreateMarketOutcome__fields}>
        <li>
          <label htmlFor="cm__input--type-binary">
            <span>Market Type</span>
          </label>
          <ul className={Styles.CreateMarketOutcome__type}>
            <li>
              <input
                id="cm__input--type-binary"
                name="outcome"
                type="radio"
                value="binary"
              />
              <label htmlFor="cm__input--type-binary">Yes/No</label>
            </li>
            <li>
              <input
                id="cm__input--type-categorical"
                name="outcome"
                type="radio"
                value="categorical"
              />
              <label htmlFor="cm__input--type-categorical">Multiple Choice</label>
            </li>
            <li>
              <input
                id="cm__input--type-scalar"
                name="outcome"
                type="radio"
                value="scalar"
              />
              <label htmlFor="cm__input--type-scalar">Numerical Range</label>
            </li>
          </ul>
        </li>
      </ul>
    )
  }
}
