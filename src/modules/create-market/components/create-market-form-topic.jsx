import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Input from 'modules/common/components/input/input'
import CreateMarketFormInputNotifications from 'modules/create-market/components/create-market-form-input-notifications'

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'
import { NEW_MARKET_TOPIC } from 'modules/create-market/constants/new-market-creation-steps'
import { TAGS_MAX_LENGTH } from 'modules/create-market/constants/new-market-constraints'

export default class CreateMarketFormTopic extends Component {
  static propTypes = {
    currentStep: PropTypes.number.isRequired,
    topic: PropTypes.string.isRequired,
    keywords: PropTypes.array.isRequired,
    updateValidity: PropTypes.func.isRequired,
    updateNewMarket: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      errors: [],
      warnings: [],
      topic: ''
    }

    this.validateForm = this.validateForm.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStep !== nextProps.currentStep && newMarketCreationOrder[nextProps.currentStep] === NEW_MARKET_TOPIC) this.validateForm(nextProps.topic)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentStep !== this.props.currentStep &&
      this.props.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_TOPIC)
    ) {
      this.defaultFormToFocus.getElementsByTagName('input')[0].focus()
    }
  }

  validateForm(topic) {
    const errors = []
    const warnings = []

    if (this.props.keywords.indexOf(topic) !== -1) {
      errors.push('Topic cannot be the same as a keyword')
    }

    // Error Check
    if (!topic.length || errors.length) {
      this.props.updateValidity(false)
      this.props.updateNewMarket({ topic: '' })
    } else {
      this.props.updateValidity(true)
      this.props.updateNewMarket({ topic })
    }

    // Warnings Check
    if (topic.length === TAGS_MAX_LENGTH) warnings.push(`Maximum tag length is: ${TAGS_MAX_LENGTH}`)

    this.setState({ errors, warnings, topic })
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <article className={`create-market-form-part ${p.className || ''}`}>
        <div className="create-market-form-part-content">
          <div className="create-market-form-part-input">
            <aside>
              <h3>Event Topic</h3>
              <span>Specify the general category of the event the market is for.</span>
            </aside>
            <div className="vertical-form-divider" />
            <form
              ref={(defaultFormToFocus) => { this.defaultFormToFocus = defaultFormToFocus }}
              onSubmit={e => e.preventDefault()}
            >
              <Input
                type="text"
                value={s.topic}
                debounceMS={0}
                maxLength={TAGS_MAX_LENGTH}
                onChange={topic => this.validateForm(topic)}
              />
              <CreateMarketFormInputNotifications
                errors={s.errors}
                warnings={s.warnings}
              />
            </form>
          </div>
        </div>
      </article>
    )
  }
}
