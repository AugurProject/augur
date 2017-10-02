import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/create-market/components/create-market-form-outcome/create-market-form-outcome.styles'
import StylesForm from 'modules/create-market/components/create-market-form/create-market-form.styles'

export default class CreateMarketDefine extends Component {

  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    updateNewMarket: PropTypes.func.isRequired,
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <ul className={StylesForm.CreateMarketForm__fields}>
        <li>
          <label htmlFor="cm__radio--binary">
            <span>Market Type</span>
          </label>
          <ul className={Styles.CreateMarketOutcome__type}>
            <li>
              <input
                id="cm__radio--binary"
                name="outcome"
                type="radio"
                value="binary"
              />
              <label htmlFor="cm__input--type-binary">Yes/No</label>
            </li>
            <li>
              <input
                id="cm__radio--categorical"
                name="outcome"
                type="radio"
                value="categorical"
              />
              <label htmlFor="cm__radio--categorical">Multiple Choice</label>
            </li>
            <li>
              <input
                id="cm__radio--scalar"
                name="outcome"
                type="radio"
                value="scalar"
              />
              <label htmlFor="cm__radio--scalar">Numerical Range</label>
            </li>
          </ul>
        </li>
        <li>
          <label htmlFor="cm__input--outcome1">
            <span>Additional Details</span>
          </label>
          <div className={Styles.CreateMarketOutcome__categorical}>
            <input
              id="cm__input--outcome1"
              type="text"
              placeholder="Outcome"
            />
            <input
              id="cm__input--outcome1"
              type="text"
              placeholder="Outcome"
            />
            <input
              id="cm__input--outcome1"
              type="text"
              placeholder="Optional Outcome"
            />
            <input
              id="cm__input--outcome1"
              type="text"
              placeholder="Optional Outcome"
            />
            <input
              id="cm__input--outcome1"
              type="text"
              placeholder="Optional Outcome"
            />
            <input
              id="cm__input--outcome1"
              type="text"
              placeholder="Optional Outcome"
            />
            <input
              id="cm__input--outcome1"
              type="text"
              placeholder="Optional Outcome"
            />
            <input
              id="cm__input--outcome1"
              type="text"
              placeholder="Optional Outcome"
            />
          </div>
        </li>
        <li>
          <label htmlFor="cm__input--details">
            <span>Additional Details</span>
          </label>
          <input
            id="cm__input--details"
            type="text"
            placeholder="Optional - Include any additional information that traders should know about this market."
          />
        </li>
      </ul>
    )
  }
}
