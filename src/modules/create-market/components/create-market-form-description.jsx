import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Input from 'modules/common/components/input/input'
import CreateMarketFormInputNotifications from 'modules/create-market/components/create-market-form-input-notifications'

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'
import { NEW_MARKET_DESCRIPTION } from 'modules/create-market/constants/new-market-creation-steps'
import { DESCRIPTION_MAX_LENGTH } from 'modules/create-market/constants/new-market-constraints'

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
      <article className={`create-market-form-part ${p.className || ''}`}>
        <div className="create-market-form-part-content">
          <div className="create-market-form-part-input">
            <aside>
              <h3>Event Question</h3>
              <span>What is the question the market should attempt to answer?</span>
            </aside>
            <div className="vertical-form-divider" />
            <form
              ref={(defaultFormToFocus) => { this.defaultFormToFocus = defaultFormToFocus }}
              onSubmit={e => e.preventDefault()}
            >
              <Input
                type="text"
                value={p.description}
                maxLength={DESCRIPTION_MAX_LENGTH}
                debounceMS={0}
                onChange={description => this.validateForm(description)}
              />
              <CreateMarketFormInputNotifications
                warnings={s.warnings}
              />
            </form>
          </div>
        </div>
      </article>
    )
  }
}
