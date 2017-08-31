import React, { Component } from 'react'
import PropTypes from 'prop-types'

import InputList from 'modules/common/components/input-list'

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'
import { NEW_MARKET_KEYWORDS } from 'modules/create-market/constants/new-market-creation-steps'
import { KEYWORDS_MAX_NUM, TAGS_MAX_LENGTH } from 'modules/create-market/constants/new-market-constraints'

export default class CreateMarketFormKeywords extends Component {
  static propTypes = {
    isValid: PropTypes.bool.isRequired,
    currentStep: PropTypes.number.isRequired,
    keywords: PropTypes.array.isRequired,
    topic: PropTypes.string.isRequired,
    validations: PropTypes.array.isRequired,
    updateValidity: PropTypes.func.isRequired,
    updateNewMarket: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      errors: [],
      warnings: []
    }

    this.validateForm = this.validateForm.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.currentStep !== nextProps.currentStep &&
      newMarketCreationOrder[nextProps.currentStep] === NEW_MARKET_KEYWORDS
    ) {
      if (nextProps.validations.indexOf(NEW_MARKET_KEYWORDS) === -1) {
        nextProps.updateValidity(true, true)
      } else {
        nextProps.updateValidity(true)
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentStep !== this.props.currentStep &&
      this.props.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_KEYWORDS)
    ) {
      this.defaultFormToFocus.getElementsByTagName('input')[0].focus()
    }
  }

  validateForm(keywords) {
    const errors = Array(keywords.length)
    errors.fill('')

    const warnings = Array(keywords.length)
    warnings.fill('')

    keywords.forEach((keyword, i) => {
      if (keyword === this.props.topic) {
        errors[i] = 'Keyword identical to topic'
      } else if (keywords.indexOf(keyword) > -1 && keywords.indexOf(keyword) !== i) {
        errors[i] = 'Keyword must be unique'
      } else if (keyword.length === TAGS_MAX_LENGTH) {
        warnings[i] = `Keyword max length is: ${TAGS_MAX_LENGTH}`
      }
    })

    if (errors.find(error => error.length)) {
      this.props.updateValidity(false)
    } else {
      this.props.updateValidity(true)
    }

    this.setState({ errors, warnings })

    this.props.updateNewMarket({ keywords })
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <article className={`create-market-form-part ${p.className || ''}`}>
        <div className="create-market-form-part-content">
          <div className="create-market-form-part-input">
            <aside>
              <h3>Keywords</h3>
              <h4>optional</h4>
              <span>Add up to <strong>two</strong> keywords to help with the categorization and indexing of your market.</span>
            </aside>
            <div className="vertical-form-divider" />
            <form
              ref={(defaultFormToFocus) => { this.defaultFormToFocus = defaultFormToFocus }}
              onSubmit={e => e.preventDefault()}
            >
              <InputList
                list={p.keywords}
                errors={s.errors}
                warnings={s.warnings}
                listMaxElements={KEYWORDS_MAX_NUM}
                itemMaxLength={TAGS_MAX_LENGTH}
                onChange={keywords => this.validateForm(keywords)}
              />
            </form>
          </div>
        </div>
      </article>
    )
  }
}
