/* eslint react/no-array-index-key: 0 */  // It's OK in this specific instance as order remains the same

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import CreateMarketDefine from 'modules/create-market/components/create-market-form-define/create-market-form-define'
import CreateMarketOutcome from 'modules/create-market/components/create-market-form-outcome/create-market-form-outcome'
import CreateMarketResolution from 'modules/create-market/components/create-market-form-resolution/create-market-form-resolution'
// import CreateMarketFormDescription from 'modules/create-market/components/create-market-form-description/create-market-form-description'
// import CreateMarketFormOutcomes from 'modules/create-market/components/create-market-form-outcomes'
// import CreateMarketFormExpirySource from 'modules/create-market/components/create-market-form-expiry-source'
// import CreateMarketFormEndDate from 'modules/create-market/components/create-market-form-end-date'
// import CreateMarketFormDetails from 'modules/create-market/components/create-market-form-details'
// import CreateMarketFormTopic from 'modules/create-market/components/create-market-form-topic'
// import CreateMarketFormKeywords from 'modules/create-market/components/create-market-form-keywords'
// import CreateMarketFormFees from 'modules/create-market/components/create-market-form-fees'
// import CreateMarketFormOrderBook from 'modules/create-market/components/create-market-form-order-book'
// import CreateMarketReview from 'modules/create-market/components/create-market-review'

// import CreateMarketFormInputNotifications from 'modules/create-market/components/create-market-form-input-notifications'

// import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'
// import { NEW_MARKET_DESCRIPTION } from 'modules/create-market/constants/new-market-creation-steps'
// import { DESCRIPTION_MAX_LENGTH, TAGS_MAX_LENGTH } from 'modules/create-market/constants/new-market-constraints'

// import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'
// import {
//   NEW_MARKET_TYPE,
//   NEW_MARKET_DESCRIPTION,
//   NEW_MARKET_OUTCOMES,
//   NEW_MARKET_EXPIRY_SOURCE,
//   NEW_MARKET_END_DATE,
//   NEW_MARKET_DETAILS,
//   NEW_MARKET_TOPIC,
//   NEW_MARKET_KEYWORDS,
//   NEW_MARKET_FEES,
//   NEW_MARKET_ORDER_BOOK,
//   NEW_MARKET_REVIEW
// } from 'modules/create-market/constants/new-market-creation-steps'

// import debounce from 'utils/debounce'

import Styles from 'modules/create-market/components/create-market-form/create-market-form.styles'

export default class CreateMarketForm extends Component {

  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    updateNewMarket: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    isMobileSmall: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      pages: ['Define', 'Outcome', 'Resolution', 'Liquidity', 'Review'],
    }

    this.prevPage = this.prevPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.validateField = this.validateField.bind(this)
    this.isValid = this.isValid.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.newMarket.currentStep !== nextProps.newMarket.currentStep) {
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
    const currentStep = p.newMarket.currentStep

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

  isValid(currentStep) {
    const validations = this.props.newMarket.validations[currentStep]
    const validationsArray = Object.keys(validations)
    return validationsArray.every(key => validations[key] === true)
  }

  render() {
    const p = this.props
    const s = this.state

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
                isValid={this.isValid}
                isMobileSmall={p.isMobileSmall}
              />
            }
          </div>
          <div className={Styles['CreateMarketForm__button-outer-wrapper']}>
            <div className={Styles['CreateMarketForm__button-inner-wrapper']}>
              <div className={Styles.CreateMarketForm__navigation}>
                <button
                  className={classNames(Styles.CreateMarketForm__prev, { [`${Styles['hide-button']}`]: p.newMarket.currentStep === 0 })}
                  onClick={this.prevPage}
                >Previous: {s.pages[p.newMarket.currentStep - 1]}</button>
                <button
                  className={classNames(Styles.CreateMarketForm__next, { [`${Styles['hide-button']}`]: p.newMarket.currentStep === s.pages.length - 1 })}
                  disabled={!p.newMarket.isValid}
                  onClick={p.newMarket.isValid && this.nextPage}
                >Next: {s.pages[p.newMarket.currentStep + 1]}</button>
              </div>
            </div>
          </div>
        </div>
        {/* <CreateMarketFormDescription
          className={classNames({
            'display-form-part': s.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_DESCRIPTION),
            'hide-form-part': s.currentStep !== newMarketCreationOrder.indexOf(NEW_MARKET_DESCRIPTION) && s.lastStep === newMarketCreationOrder.indexOf(NEW_MARKET_DESCRIPTION)
          })}
          currentStep={p.newMarket.currentStep}
          description={p.newMarket.description}
          updateValidity={this.updateValidity}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormType
          className={classNames({
            'can-hide': s.currentStep >= newMarketCreationOrder.indexOf(NEW_MARKET_TYPE) + 1,
            display: s.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_TYPE) && s.lastStep > newMarketCreationOrder.indexOf(NEW_MARKET_TYPE),
            hide: s.currentStep > newMarketCreationOrder.indexOf(NEW_MARKET_TYPE) && s.lastStep === newMarketCreationOrder.indexOf(NEW_MARKET_TYPE),
          })}
          type={p.newMarket.type}
          addValidationToNewMarket={p.addValidationToNewMarket}
          removeValidationFromNewMarket={p.removeValidationFromNewMarket}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormOutcomes
          className={classNames({
            'display-form-part': s.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_OUTCOMES),
            'hide-form-part': s.currentStep !== newMarketCreationOrder.indexOf(NEW_MARKET_OUTCOMES) && s.lastStep === newMarketCreationOrder.indexOf(NEW_MARKET_OUTCOMES)
          })}
          type={p.newMarket.type}
          outcomes={p.newMarket.outcomes}
          scalarSmallNum={p.newMarket.scalarSmallNum}
          scalarBigNum={p.newMarket.scalarBigNum}
          currentStep={p.newMarket.currentStep}
          updateValidity={this.updateValidity}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormExpirySource
          className={classNames({
            'display-form-part': s.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_EXPIRY_SOURCE),
            'hide-form-part': s.currentStep !== newMarketCreationOrder.indexOf(NEW_MARKET_EXPIRY_SOURCE) && s.lastStep === newMarketCreationOrder.indexOf(NEW_MARKET_EXPIRY_SOURCE)
          })}
          currentStep={p.newMarket.currentStep}
          expirySourceType={p.newMarket.expirySourceType}
          expirySource={p.newMarket.expirySource}
          updateValidity={this.updateValidity}
          updateNewMarket={p.updateNewMarket}
        />
        {
          s.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_END_DATE) &&
            <CreateMarketFormEndDate
              className={classNames({
                'display-form-part': s.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_END_DATE),
                'hide-form-part': s.currentStep !== newMarketCreationOrder.indexOf(NEW_MARKET_END_DATE) && s.lastStep === newMarketCreationOrder.indexOf(NEW_MARKET_END_DATE)
              })}
              currentStep={p.newMarket.currentStep}
              isValid={p.newMarket.isValid}
              endDate={p.newMarket.endDate}
              updateFormHeight={this.updateFormHeight}
              updateValidity={this.updateValidity}
              updateNewMarket={p.updateNewMarket}
            />
        }
        <CreateMarketFormDetails
          className={classNames({
            'display-form-part': s.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_DETAILS),
            'hide-form-part': s.currentStep !== newMarketCreationOrder.indexOf(NEW_MARKET_DETAILS) && s.lastStep === newMarketCreationOrder.indexOf(NEW_MARKET_DETAILS)
          })}
          isValid={p.newMarket.isValid}
          currentStep={p.newMarket.currentStep}
          detailsText={p.newMarket.detailsText}
          validations={p.newMarket.validations}
          updateValidity={this.updateValidity}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormTopic
          className={classNames({
            'display-form-part': s.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_TOPIC),
            'hide-form-part': s.currentStep !== newMarketCreationOrder.indexOf(NEW_MARKET_TOPIC) && s.lastStep === newMarketCreationOrder.indexOf(NEW_MARKET_TOPIC)
          })}
          topic={p.newMarket.topic}
          keywords={p.newMarket.keywords}
          currentStep={p.newMarket.currentStep}
          updateValidity={this.updateValidity}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormKeywords
          className={classNames({
            'display-form-part': s.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_KEYWORDS),
            'hide-form-part': s.currentStep !== newMarketCreationOrder.indexOf(NEW_MARKET_KEYWORDS) && s.lastStep === newMarketCreationOrder.indexOf(NEW_MARKET_KEYWORDS)
          })}
          isValid={p.newMarket.isValid}
          currentStep={p.newMarket.currentStep}
          keywords={p.newMarket.keywords}
          topic={p.newMarket.topic}
          validations={p.newMarket.validations}
          updateValidity={this.updateValidity}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormFees
          className={classNames({
            'display-form-part': s.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_FEES),
            'hide-form-part': s.currentStep !== newMarketCreationOrder.indexOf(NEW_MARKET_FEES) && s.lastStep === newMarketCreationOrder.indexOf(NEW_MARKET_FEES)
          })}
          currentStep={p.newMarket.currentStep}
          takerFee={p.newMarket.takerFee}
          makerFee={p.newMarket.makerFee}
          updateValidity={this.updateValidity}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormOrderBook
          className={classNames({
            'display-form-part': s.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_ORDER_BOOK),
            'hide-form-part': s.currentStep !== newMarketCreationOrder.indexOf(NEW_MARKET_ORDER_BOOK) && s.lastStep === newMarketCreationOrder.indexOf(NEW_MARKET_ORDER_BOOK)
          })}
          isValid={p.newMarket.isValid}
          availableEth={p.availableEth}
          type={p.newMarket.type}
          currentStep={p.newMarket.currentStep}
          outcomes={p.newMarket.outcomes}
          orderBook={p.newMarket.orderBook}
          orderBookSorted={p.newMarket.orderBookSorted}
          orderBookSeries={p.newMarket.orderBookSeries}
          scalarBigNum={p.newMarket.scalarBigNum}
          scalarSmallNum={p.newMarket.scalarSmallNum}
          makerFee={p.newMarket.makerFee}
          initialLiquidityEth={p.newMarket.initialLiquidityEth}
          initialLiquidityGas={p.newMarket.initialLiquidityGas}
          initialLiquidityFees={p.newMarket.initialLiquidityFees}
          addOrderToNewMarket={p.addOrderToNewMarket}
          removeOrderFromNewMarket={p.removeOrderFromNewMarket}
          updateValidity={this.updateValidity}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketReview
          className={classNames({
            'display-form-part': s.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_REVIEW),
            'hide-form-part': s.currentStep !== newMarketCreationOrder.indexOf(NEW_MARKET_REVIEW) && s.lastStep === newMarketCreationOrder.indexOf(NEW_MARKET_ORDER_BOOK)
          })}
          isValid={p.newMarket.isValid}
          creationError={p.newMarket.creationError}
          branch={p.branch}
          currentStep={p.newMarket.currentStep}
          takerFee={p.newMarket.takerFee}
          makerFee={p.newMarket.makerFee}
          initialLiquidityEth={p.newMarket.initialLiquidityEth}
          initialLiquidityGas={p.newMarket.initialLiquidityGas}
          initialLiquidityFees={p.newMarket.initialLiquidityFees}
        /> */}
      </article>
    )
  }
}
