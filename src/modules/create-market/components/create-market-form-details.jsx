import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Input from 'modules/common/components/input'

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'
import { NEW_MARKET_DETAILS } from 'modules/create-market/constants/new-market-creation-steps'

export default class CreateMarketFormDetails extends Component {
  static propTypes = {
    isValid: PropTypes.bool.isRequired,
    currentStep: PropTypes.number.isRequired,
    detailsText: PropTypes.string.isRequired,
    validations: PropTypes.array.isRequired,
    updateValidity: PropTypes.func.isRequired,
    updateNewMarket: PropTypes.func.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStep !== nextProps.currentStep &&
      newMarketCreationOrder[nextProps.currentStep] === NEW_MARKET_DETAILS
    ) {
      if (nextProps.validations.indexOf(NEW_MARKET_DETAILS) === -1) {
        nextProps.updateValidity(true, true)
      } else {
        nextProps.updateValidity(true)
      }
    }

    if (this.props.detailsText !== nextProps.detailsText) nextProps.updateValidity(true)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentStep !== this.props.currentStep &&
      this.props.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_DETAILS)
    ) {
      this.defaultFormToFocus.getElementsByTagName('input')[0].focus()
    }
  }

  render() {
    const p = this.props

    return (
      <article className={`create-market-form-part ${p.className || ''}`}>
        <div className="create-market-form-part-content">
          <div className="create-market-form-part-input">
            <aside>
              <h3>Additional Details</h3>
              <h4>optional</h4>
              <span>Provide any additional details required to either understand or report on your market.</span>
            </aside>
            <div className="vertical-form-divider" />
            <form
              ref={(defaultFormToFocus) => { this.defaultFormToFocus = defaultFormToFocus }}
              onSubmit={e => e.preventDefault()}
            >
              <Input
                type="text"
                value={p.detailsText}
                onChange={detailsText => p.updateNewMarket({ detailsText })}
              />
            </form>
          </div>
        </div>
      </article>
    )
  }
}
