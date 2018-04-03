/* eslint react/no-array-index-key: 0 */ // It's OK in this specific instance as order remains the same

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import CreateMarketDefine from 'modules/create-market/components/create-market-form-define/create-market-form-define'
import CreateMarketOutcome from 'modules/create-market/components/create-market-form-outcome/create-market-form-outcome'
import CreateMarketResolution from 'modules/create-market/components/create-market-form-resolution/create-market-form-resolution'
import CreateMarketLiquidity from 'modules/create-market/components/create-market-form-liquidity/create-market-form-liquidity'
import CreateMarketReview from 'modules/create-market/components/create-market-form-review/create-market-form-review'

import Styles from 'modules/create-market/components/create-market-form/create-market-form.styles'

export default class CreateMarketForm extends Component {

  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    updateNewMarket: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    addOrderToNewMarket: PropTypes.func.isRequired,
    availableEth: PropTypes.string.isRequired,
    availableRep: PropTypes.string.isRequired,
    isMobileSmall: PropTypes.bool.isRequired,
    submitNewMarket: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    universe: PropTypes.object.isRequired,
    meta: PropTypes.object,
    isBugBounty: PropTypes.bool.isRequired,
    currentTimestamp: PropTypes.number,
  }

  constructor(props) {
    super(props)

    this.state = {
      pages: ['Define', 'Outcome', 'Resolution', 'Liquidity', 'Review'],
    }

    this.prevPage = this.prevPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.validateField = this.validateField.bind(this)
    this.validateNumber = this.validateNumber.bind(this)
    this.isValid = this.isValid.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.newMarket.currentStep !== nextProps.newMarket.currentStep && nextProps.newMarket.currentStep !== 4) {
      this.props.updateNewMarket({ isValid: this.isValid(nextProps.newMarket.currentStep) })
    }
  }

  prevPage() {
    const newStep = this.props.newMarket.currentStep <= 0 ? 0 : this.props.newMarket.currentStep - 1
    this.props.updateNewMarket({ currentStep: newStep })
  }

  nextPage() {
    const newStep = this.props.newMarket.currentStep >= (this.state.pages.length - 1) ? this.state.pages.length - 1 : this.props.newMarket.currentStep + 1
    this.props.updateNewMarket({ currentStep: newStep })
  }

  validateField(fieldName, value, maxLength) {
    const p = this.props
    const { currentStep } = p.newMarket

    const updatedMarket = { ...p.newMarket }

    switch (true) {
      case typeof value === 'string' && !value.length:
        updatedMarket.validations[currentStep][fieldName] = 'This field is required.'
        break
      case maxLength && value.length > maxLength:
        updatedMarket.validations[currentStep][fieldName] = `Maximum length is ${maxLength}.`
        break
      default:
        updatedMarket.validations[currentStep][fieldName] = true
    }

    updatedMarket[fieldName] = value
    updatedMarket.isValid = this.isValid(currentStep)

    p.updateNewMarket(updatedMarket)
  }

  validateNumber(fieldName, rawValue, humanName, min, max, decimals = 0, leadingZero = false) {
    const p = this.props
    const updatedMarket = { ...p.newMarket }
    const { currentStep } = p.newMarket

    let value = rawValue

    if (value !== '') {
      value = parseFloat(value)
      value = parseFloat(value.toFixed(decimals))
    }

    switch (true) {
      case value === '':
        updatedMarket.validations[currentStep][fieldName] = `The ${humanName} field is required.`
        break
      case (value > max || value < min):
        updatedMarket.validations[currentStep][fieldName] = `${humanName}`.charAt(0).toUpperCase()
        updatedMarket.validations[currentStep][fieldName] += `${humanName} must be between ${min} and ${max}.`.slice(1)
        break
      default:
        updatedMarket.validations[currentStep][fieldName] = true
        break
    }

    if (leadingZero && value < 10) {
      value = `0${value}`
    }

    updatedMarket[fieldName] = typeof value === 'number' ? value.toString() : value
    updatedMarket.isValid = this.isValid(currentStep)

    p.updateNewMarket(updatedMarket)
  }

  isValid(currentStep) {
    const validations = this.props.newMarket.validations[currentStep]
    const validationsArray = Object.keys(validations)
    return validationsArray.every(key => validations[key] === true)
  }

  render() {
    const p = this.props
    const s = this.state

    // TODO -- refactor this to derive route based on url path rather than state value
    //  (react-router-dom declarative routing)

    return (
      <article className={Styles.CreateMarketForm}>
        <div className={Styles['CreateMarketForm__form-outer-wrapper']}>
          <div className={Styles['CreateMarketForm__form-inner-wrapper']}>
            { p.newMarket.currentStep === 0 &&
              <CreateMarketDefine
                newMarket={p.newMarket}
                updateNewMarket={p.updateNewMarket}
                validateField={this.validateField}
                categories={p.categories}
                isValid={this.isValid}
                isBugBounty={p.isBugBounty}
              />
            }
            { p.newMarket.currentStep === 1 &&
              <CreateMarketOutcome
                newMarket={p.newMarket}
                updateNewMarket={p.updateNewMarket}
                validateField={this.validateField}
                isValid={this.isValid}
                isMobileSmall={p.isMobileSmall}
              />
            }
            { p.newMarket.currentStep === 2 &&
              <CreateMarketResolution
                newMarket={p.newMarket}
                updateNewMarket={p.updateNewMarket}
                validateField={this.validateField}
                validateNumber={this.validateNumber}
                isValid={this.isValid}
                isMobileSmall={p.isMobileSmall}
                currentTimestamp={p.currentTimestamp}
              />
            }
            { p.newMarket.currentStep === 3 &&
              <CreateMarketLiquidity
                newMarket={p.newMarket}
                updateNewMarket={p.updateNewMarket}
                validateNumber={this.validateNumber}
                addOrderToNewMarket={p.addOrderToNewMarket}
                removeOrderFromNewMarket={p.removeOrderFromNewMarket}
                availableEth={p.availableEth}
                isMobileSmall={p.isMobileSmall}
              />
            }
            { p.newMarket.currentStep === 4 &&
              <CreateMarketReview
                meta={p.meta}
                newMarket={p.newMarket}
                availableEth={p.availableEth}
                availableRep={p.availableRep}
                universe={p.universe}
              />
            }
          </div>
          <div className={Styles['CreateMarketForm__button-outer-wrapper']}>
            <div className={Styles['CreateMarketForm__button-inner-wrapper']}>
              <div className={Styles.CreateMarketForm__navigation}>
                <button
                  className={classNames(Styles.CreateMarketForm__prev, { [`${Styles['hide-button']}`]: p.newMarket.currentStep === 0 })}
                  onClick={this.prevPage}
                >Previous: {s.pages[p.newMarket.currentStep - 1]}
                </button>
                { p.newMarket.currentStep < 4 &&
                  <button
                    className={classNames(Styles.CreateMarketForm__next, { [`${Styles['hide-button']}`]: p.newMarket.currentStep === s.pages.length - 1 })}
                    disabled={!p.newMarket.isValid}
                    onClick={p.newMarket.isValid ? this.nextPage : null}
                  >Next: {s.pages[p.newMarket.currentStep + 1]}
                  </button>
                }
                { p.newMarket.currentStep === 4 &&
                  <button
                    className={Styles.CreateMarketForm__submit}
                    disabled={p.isBugBounty}
                    onClick={e => p.submitNewMarket(p.newMarket, p.history)}
                  >Submit
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  }
}
