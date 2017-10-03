import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'

import Styles from 'modules/create-market/components/create-market-form-outcome/create-market-form-outcome.styles'
import StylesForm from 'modules/create-market/components/create-market-form/create-market-form.styles'

export default class CreateMarketOutcome extends Component {

  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    updateNewMarket: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      marketType: false,
    }
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <ul className={StylesForm.CreateMarketForm__fields}>
        <li>
          <label>
            <span>Market Type</span>
          </label>
          <ul className={Styles.CreateMarketOutcome__type}>
            <li>
              <label
                className={classNames({ [`${Styles.active}`]: s.marketType === BINARY })}
                onClick={(e) => { this.setState({ marketType: BINARY }); p.updateNewMarket({ type : BINARY }) }}
              >Yes/No</label>
            </li>
            <li>
              <label
                className={classNames({ [`${Styles.active}`]: s.marketType === CATEGORICAL })}
                onClick={(e) => { this.setState({ marketType: CATEGORICAL }); p.updateNewMarket({ type : CATEGORICAL }) }}
              >Multiple Choice</label>
            </li>
            <li>
              <label
                className={classNames({ [`${Styles.active}`]: s.marketType === SCALAR })}
                onClick={(e) => { this.setState({ marketType: SCALAR }); p.updateNewMarket({ type : SCALAR }) }}
              >Numerical Range</label>
            </li>
          </ul>
        </li>
        { s.marketType === CATEGORICAL &&
          <li>
            <label htmlFor="cm__input--outcome1">
              <span>Potential Outcomes</span>
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
        }
        { s.marketType === SCALAR &&
          <li>
            <label htmlFor="cm__input--min">
              <span>Range Values</span>
            </label>
            <div className={Styles.CreateMarketOutcome__scalar}>
              <input
                id="cm__input--min"
                type="number"
                placeholder="Min Value"
                onChange={(e) => { p.updateNewMarket({ scalarSmallNum : e.target.value }) }}
              />
              <input
                id="cm__input--max"
                type="number"
                placeholder="Max Value"
                onChange={(e) => { p.updateNewMarket({ scalarBigNum : e.target.value }) }}
              />
            </div>
          </li>
        }
        { s.marketType &&
          <li>
            <label htmlFor="cm__input--details">
              <span>Additional Details</span>
            </label>
            <input
              id="cm__input--details"
              type="text"
              placeholder="Optional - Include any additional information that traders should know about this market."
              onChange={(e) => { p.updateNewMarket({ detailsText : e.target.value }) }}
            />
          </li>
        }
      </ul>
    )
  }
}
