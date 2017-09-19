import React, { Component } from 'react'
import PropTypes from 'prop-types'

import CreateMarketFormInputNotifications from 'modules/create-market/components/create-market-form-input-notifications'

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'
import { NEW_MARKET_DESCRIPTION } from 'modules/create-market/constants/new-market-creation-steps'
import { DESCRIPTION_MAX_LENGTH } from 'modules/create-market/constants/new-market-constraints'

import Styles from 'modules/create-market/components/create-market-form-description/create-market-form-description.styles'

export default class CreateMarketFormDescription extends Component {
  static propTypes = {
    currentStep: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    updateValidity: PropTypes.func.isRequired,
    updateNewMarket: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      warnings: []
    }

    this.validateForm = this.validateForm.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStep !== nextProps.currentStep &&
      nextProps.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_DESCRIPTION)
    ) {
      this.validateForm(nextProps.description)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentStep !== this.props.currentStep &&
      this.props.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_DESCRIPTION)
    ) {
      this.defaultFormToFocus.getElementsByTagName('input')[0].focus()
    }
  }

  validateForm(description = '') {
    const warnings = []

    // Error Check
    if (!description.length) {
      this.props.updateValidity(false)
    } else {
      this.props.updateValidity(true)
    }

    // Warning Check
    if (description.length === DESCRIPTION_MAX_LENGTH) {
      warnings.push(`Maximum length is ${DESCRIPTION_MAX_LENGTH}`)
    }

    this.setState({ warnings })

    this.props.updateNewMarket({ description })
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <article>
        <form
          ref={(defaultFormToFocus) => { this.defaultFormToFocus = defaultFormToFocus }}
          onSubmit={e => e.preventDefault()}
        >
          <label>Market Question</label>
          <input
            className={Styles.CreateMarketFormDesc__input}
            type="text"
            value={p.description}
            placeholder="What question do you want the world to predict?"
            maxLength={DESCRIPTION_MAX_LENGTH}
            debounceMS={0}
            onChange={description => this.validateForm(description)}
          />
          <CreateMarketFormInputNotifications
            warnings={s.warnings}
          />
        </form>
      </article>
    )
  }
}
