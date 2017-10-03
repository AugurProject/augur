/* eslint react/no-array-index-key: 0 */  // It's OK in this specific instance as order remains the same

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { DESCRIPTION_MAX_LENGTH, TAGS_MAX_LENGTH } from 'modules/create-market/constants/new-market-constraints'

import Styles from 'modules/create-market/components/create-market-form-define/create-market-form-define.styles'
import StylesForm from 'modules/create-market/components/create-market-form/create-market-form.styles'

export default class CreateMarketDefine extends Component {

  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    updateNewMarket: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      suggestedCategories: this.filterCategories(this.props.newMarket.category),
      shownSuggestions: 2,
      requiredFields: Array(4).fill(false)
    }

    this.filterCategories = this.filterCategories.bind(this)
    this.validateField = this.validateField.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.newMarket.category !== nextProps.newMarket.category) {
      let filteredCategories = this.filterCategories(nextProps.newMarket.category)

      if (nextProps.newMarket.category === '') {
        filteredCategories = []
      }

      this.setState({
        suggestedCategories: filteredCategories,
        shownSuggestions: 2
      })
    }
  }

  filterCategories(category) {
    const userString = category.toLowerCase()
    return this.props.categories.filter(cat => cat.topic.toLowerCase().indexOf(userString) === 0)
  }

  validateField(fieldKey, fieldName, value, maxLength) {
    const requiredFields = this.state.requiredFields

    switch (true) {
      case !value.length:
        requiredFields[fieldKey] = 'This field is required.'
        break
      case value.length > maxLength:
        requiredFields[fieldKey] = `Maximum length is ${maxLength}`
        break
      default:
        requiredFields[fieldKey] = true
    }

    this.setState({ requiredFields })

    this.props.updateNewMarket({ [fieldName]: value })
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <ul className={StylesForm.CreateMarketForm__fields}>
        <li>
          <label htmlFor="cm__input--desc">
            <span>Market Question</span>
            { s.requiredFields[0].length && <span className={Styles.CreateMarketDefine__error}>{ s.requiredFields[0] }</span> }
          </label>
          <input
            id="cm__input--desc"
            type="text"
            value={p.newMarket.description}
            maxLength={DESCRIPTION_MAX_LENGTH}
            placeholder="What question do you want the world to predict?"
            onChange={e => this.validateField(0, 'description', e.target.value, DESCRIPTION_MAX_LENGTH)}
          />
        </li>
        <li className={StylesForm['field--50']}>
          <label htmlFor="cm__input--cat">
            <span>Category</span>
            { s.requiredFields[1].length && <span className={Styles.CreateMarketDefine__error}>{ s.requiredFields[1] }</span> }
          </label>
          <input
            ref={(catInput) => { this.catInput = catInput }}
            id="cm__input--cat"
            type="text"
            value={p.newMarket.category}
            maxLength={TAGS_MAX_LENGTH}
            placeholder="Help users find your market by defining its category"
            onChange={e => this.validateField(1, 'category', e.target.value, TAGS_MAX_LENGTH)}
          />
        </li>
        <li className={StylesForm['field--50']}>
          <label htmlFor="cm__suggested-categories">
            <span>Suggested Categories</span>
          </label>
          <ul className={Styles['CreateMarketDefine__suggested-categories']}>
            {p.newMarket.category && s.suggestedCategories.slice(0, s.shownSuggestions).map((cat, i) => (
              <li key={i}>
                <button onClick={() => { this.catInput.value = cat.topic; this.validateField(1, 'category', cat.topic, TAGS_MAX_LENGTH) }}>{cat.topic}</button>
              </li>
              )
            )}
            {p.newMarket.category && s.suggestedCategories.length > s.shownSuggestions &&
              <li>
                <button onClick={() => this.setState({ shownSuggestions: s.suggestedCategories.length })}>+ {s.suggestedCategories.length - 2} more</button>
              </li>
            }
          </ul>
        </li>
        <li className={Styles.CreateMarketDefine__tags}>
          <label htmlFor="cm__input--tag1">
            <span>Tags</span>
            { s.requiredFields[2].length &&
              <span className={Styles.CreateMarketDefine__error}>{ s.requiredFields[2] }</span>
            }
            { s.requiredFields[3].length &&
              <span className={classNames(Styles['CreateMarketDefine__error--tag2'], Styles.CreateMarketDefine__error)}>{ s.requiredFields[3] }</span>
            }
          </label>
          <input
            id="cm__input--tag1"
            type="text"
            value={p.newMarket.tag1}
            maxLength={TAGS_MAX_LENGTH}
            placeholder="Tag 1"
            onChange={e => this.validateField(2, 'tag1', e.target.value, TAGS_MAX_LENGTH)}
          />
          <input
            id="cm__input--tag2"
            type="text"
            value={p.newMarket.tag2}
            maxLength={TAGS_MAX_LENGTH}
            placeholder="Tag 2"
            onChange={e => this.validateField(3, 'tag2', e.target.value, TAGS_MAX_LENGTH)}
          />
        </li>
      </ul>
    )
  }
}
