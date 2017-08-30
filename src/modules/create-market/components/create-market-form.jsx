import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import CreateMarketFormType from 'modules/create-market/components/create-market-form-type'
import CreateMarketFormDescription from 'modules/create-market/components/create-market-form-description'
import CreateMarketFormOutcomes from 'modules/create-market/components/create-market-form-outcomes'
import CreateMarketFormExpirySource from 'modules/create-market/components/create-market-form-expiry-source'
import CreateMarketFormEndDate from 'modules/create-market/components/create-market-form-end-date'
import CreateMarketFormDetails from 'modules/create-market/components/create-market-form-details'
import CreateMarketFormTopic from 'modules/create-market/components/create-market-form-topic'
import CreateMarketFormKeywords from 'modules/create-market/components/create-market-form-keywords'
import CreateMarketFormFees from 'modules/create-market/components/create-market-form-fees'
import CreateMarketFormOrderBook from 'modules/create-market/components/create-market-form-order-book'
import CreateMarketReview from 'modules/create-market/components/create-market-review'

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'
import {
  NEW_MARKET_TYPE,
  NEW_MARKET_DESCRIPTION,
  NEW_MARKET_OUTCOMES,
  NEW_MARKET_EXPIRY_SOURCE,
  NEW_MARKET_END_DATE,
  NEW_MARKET_DETAILS,
  NEW_MARKET_TOPIC,
  NEW_MARKET_KEYWORDS,
  NEW_MARKET_FEES,
  NEW_MARKET_ORDER_BOOK,
  NEW_MARKET_REVIEW
} from 'modules/create-market/constants/new-market-creation-steps'

import debounce from 'utils/debounce'

export default class CreateMarketForm extends Component {
  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    updateNewMarket: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      lastStep: props.newMarket.currentStep,
      currentStep: props.newMarket.currentStep
    }

    this.updateFormHeight = debounce(this.updateFormHeight.bind(this))
    this.updateValidity = this.updateValidity.bind(this)
  }

  componentDidMount() {
    this.updateFormHeight()

    window.addEventListener('resize', this.updateFormHeight)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.newMarket.currentStep !== nextProps.newMarket.currentStep) {
      this.setState({
        lastStep: this.props.newMarket.currentStep,
        currentStep: nextProps.newMarket.currentStep
      }, () => {
        this.updateFormHeight()
      })
    }

    if (this.props.newMarket !== nextProps.newMarket) {
      this.updateFormHeight()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateFormHeight)
  }

  updateFormHeight() {
    if (this.createMarketForm) {
      let newHeight = 0

      if (this.state.currentStep === 0) { // Initial form height
        newHeight = this.createMarketForm.children[0].clientHeight
        this.createMarketForm.style.height = `${newHeight}px`
      } else {
        newHeight = this.createMarketForm.getElementsByClassName('display-form-part')[0].clientHeight
      }

      this.createMarketForm.style.height = `${newHeight}px`
    }
  }

  updateValidity(isValid, holdForUserAction = false) {
    // holdForUserAction will prevent the state from adding the form part to the validated forms array until both the form is valid + the user selects 'next'
    this.props.updateNewMarket({ isValid, holdForUserAction })
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <article
        ref={(createMarketForm) => { this.createMarketForm = createMarketForm }}
        className={classNames('create-market-form', {
          'no-preview': s.currentStep === 0
        })}
      >
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
        <CreateMarketFormDescription
          className={classNames({
            'display-form-part': s.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_DESCRIPTION),
            'hide-form-part': s.currentStep !== newMarketCreationOrder.indexOf(NEW_MARKET_DESCRIPTION) && s.lastStep === newMarketCreationOrder.indexOf(NEW_MARKET_DESCRIPTION)
          })}
          currentStep={p.newMarket.currentStep}
          description={p.newMarket.description}
          updateValidity={this.updateValidity}
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
          settlementFee={p.newMarket.settlementFee}
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
          endDate={p.newMarket.endDate}
          branch={p.branch}
          currentStep={p.newMarket.currentStep}
          settlementFee={p.newMarket.settlementFee}
          makerFee={p.newMarket.makerFee}
          initialLiquidityEth={p.newMarket.initialLiquidityEth}
          initialLiquidityGas={p.newMarket.initialLiquidityGas}
          initialLiquidityFees={p.newMarket.initialLiquidityFees}
        />
      </article>
    )
  }
}
