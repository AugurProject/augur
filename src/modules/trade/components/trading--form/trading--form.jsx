/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { BigNumber, createBigNumber } from 'utils/create-big-number'

import { MARKET, LIMIT } from 'modules/transactions/constants/types'
import { YES_NO, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { isEqual } from 'lodash'
import ReactTooltip from 'react-tooltip'
import TooltipStyles from 'modules/common/less/tooltip'
import { Hint } from 'modules/common/components/icons'

import Styles from 'modules/trade/components/trading--form/trading--form.styles'

class MarketTradingForm extends Component {
  static propTypes = {
    availableFunds: PropTypes.instanceOf(BigNumber).isRequired,
    isMobile: PropTypes.bool.isRequired,
    market: PropTypes.object.isRequired,
    marketQuantity: PropTypes.string.isRequired,
    marketType: PropTypes.string.isRequired,
    maxPrice: PropTypes.instanceOf(BigNumber).isRequired,
    minPrice: PropTypes.instanceOf(BigNumber).isRequired,
    nextPage: PropTypes.func.isRequired,
    orderEthEstimate: PropTypes.string.isRequired,
    orderShareEstimate: PropTypes.string.isRequired,
    orderPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]).isRequired,
    orderQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]).isRequired,
    orderType: PropTypes.string.isRequired,
    selectedNav: PropTypes.string.isRequired,
    selectedOutcome: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.INPUT_TYPES = {
      QUANTITY: 'orderQuantity',
      PRICE: 'orderPrice',
      MARKET_ORDER_SIZE: 'marketOrderTotal',
    }

    this.MINIMUM_TRADE_VALUE = createBigNumber(1, 10).dividedBy(10000)

    this.state = {
      [this.INPUT_TYPES.QUANTITY]: '',
      [this.INPUT_TYPES.PRICE]: '',
      [this.INPUT_TYPES.MARKET_ORDER_SIZE]: '',
      errors: {
        [this.INPUT_TYPES.QUANTITY]: [],
        [this.INPUT_TYPES.PRICE]: [],
        [this.INPUT_TYPES.MARKET_ORDER_SIZE]: [],
      },
      isOrderValid: false,
    }
    this.orderValidation = this.orderValidation.bind(this)
    this.testQuantity = this.testQuantity.bind(this)
    this.testPrice = this.testPrice.bind(this)
    this.updateTrade = this.updateTrade.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const {
      orderEthEstimate,
      orderShareEstimate,
      selectedNav,
      selectedOutcome,
      updateState,
    } = this.props
    const newStateInfo = {
      [this.INPUT_TYPES.QUANTITY]: nextProps[this.INPUT_TYPES.QUANTITY],
      [this.INPUT_TYPES.PRICE]: nextProps[this.INPUT_TYPES.PRICE],
      [this.INPUT_TYPES.MARKET_ORDER_SIZE]: nextProps[this.INPUT_TYPES.MARKET_ORDER_SIZE],
    }
    const currentStateInfo = {
      [this.INPUT_TYPES.QUANTITY]: this.state[this.INPUT_TYPES.QUANTITY],
      [this.INPUT_TYPES.PRICE]: this.state[this.INPUT_TYPES.PRICE],
      [this.INPUT_TYPES.MARKET_ORDER_SIZE]: this.state[this.INPUT_TYPES.MARKET_ORDER_SIZE],
    }
    const newOrderInfo = {
      orderEthEstimate: nextProps.orderEthEstimate,
      orderShareEstimate: nextProps.orderShareEstimate,
      selectedNav: nextProps.selectedNav,
      ...newStateInfo,
    }
    const currentOrderInfo = {
      orderEthEstimate,
      orderShareEstimate,
      selectedNav,
      ...currentStateInfo,
    }

    if (!isEqual(newOrderInfo, currentOrderInfo)) {
      // trade has changed, lets update trade.
      this.updateTrade(newStateInfo, nextProps)

      const nextTradePrice = nextProps.selectedOutcome.trade.limitPrice
      const prevTradePrice = selectedOutcome.trade.limitPrice
      // limitPrice is being defaulted and we had no value in the input box
      const priceChange = (prevTradePrice === null && nextTradePrice !== null)
      // limitPrice is being updated in the background, but we have no limitPrice input set.
      const forcePriceUpdate = (prevTradePrice === nextTradePrice) && (nextTradePrice !== null) && isNaN(this.state[this.INPUT_TYPES.PRICE] && createBigNumber(this.state[this.INPUT_TYPES.PRICE])) && isNaN(nextProps[this.INPUT_TYPES.PRICE] && createBigNumber(nextProps[this.INPUT_TYPES.PRICE]))

      if ((priceChange || forcePriceUpdate)) {
        // if limitPrice input hasn't been changed and we have defaulted the limitPrice, populate the field so as to not confuse the user as to where estimates are coming from.
        updateState(this.INPUT_TYPES.PRICE, createBigNumber(nextTradePrice))
      }

      // orderValidation
      const { isOrderValid, errors } = this.orderValidation(newStateInfo, nextProps)
      // update state
      this.setState({ ...newStateInfo, errors, isOrderValid })
    }
  }

  testQuantity(value, errors, isOrderValid) {
    let errorCount = 0
    let passedTest = !!isOrderValid
    if (!BigNumber.isBigNumber(value)) return { isOrderValid: false, errors, errorCount }
    if (value && value.lte(0)) {
      errorCount += 1
      passedTest = false
      errors[this.INPUT_TYPES.QUANTITY].push('Quantity must be greater than 0')
    }
    return { isOrderValid: passedTest, errors, errorCount }
  }

  testPrice(value, errors, isOrderValid) {
    const {
      maxPrice,
      minPrice,
      market,
    } = this.props
    const tickSize = createBigNumber(market.tickSize)
    let errorCount = 0
    let passedTest = !!isOrderValid
    if (!BigNumber.isBigNumber(value)) return { isOrderValid: false, errors, errorCount }
    if (value && (value.lte(minPrice) || value.gte(maxPrice))) {
      errorCount += 1
      passedTest = false
      errors[this.INPUT_TYPES.PRICE].push(`Price must be between ${minPrice} - ${maxPrice}`)
    }
    // removed this validation for now, let's let augur.js handle this.
    if (value && value.mod(tickSize).gt('0')) {
      errorCount += 1
      passedTest = false
      errors[this.INPUT_TYPES.PRICE].push(`Price must be a multiple of ${tickSize}`)
    }
    return { isOrderValid: passedTest, errors, errorCount }
  }

  orderValidation(order) {
    let errors = {
      [this.INPUT_TYPES.QUANTITY]: [],
      [this.INPUT_TYPES.PRICE]: [],
      [this.INPUT_TYPES.MARKET_ORDER_SIZE]: [],
    }
    let isOrderValid = true
    let errorCount = 0

    const quantity = order[this.INPUT_TYPES.QUANTITY] && createBigNumber(order[this.INPUT_TYPES.QUANTITY])
    const { isOrderValid: quantityValid, errors: quantityErrors, errorCount: quantityErrorCount } = this.testQuantity(quantity, errors, isOrderValid)
    isOrderValid = quantityValid
    errorCount += quantityErrorCount
    errors = { ...errors, ...quantityErrors }

    const price = order[this.INPUT_TYPES.PRICE] && createBigNumber(order[this.INPUT_TYPES.PRICE])
    const { isOrderValid: priceValid, errors: priceErrors, errorCount: priceErrorCount } = this.testPrice(price, errors, isOrderValid)
    isOrderValid = priceValid
    errorCount += priceErrorCount
    errors = { ...errors, ...priceErrors }

    return { isOrderValid, errors, errorCount }
  }

  updateTrade(updatedState, propsToUse) {
    let { props } = this
    if (propsToUse) props = propsToUse
    const side = props.selectedNav
    const limitPrice = updatedState[this.INPUT_TYPES.PRICE]
    let shares = updatedState[this.INPUT_TYPES.QUANTITY]
    if (shares === null || shares === undefined) {
      shares = '0'
    }
    props.selectedOutcome.trade.updateTradeOrder(shares, limitPrice, side, null)
  }

  validateForm(property, rawValue) {
    const { updateState } = this.props
    // since the order changed by user action, make sure we can place orders.
    updateState('doNotCreateOrders', false)
    let value = rawValue
    if (!(BigNumber.isBigNumber(value)) && value !== '') value = createBigNumber(value)
    const updatedState = {
      ...this.state,
      [property]: value,
    }
    const { isOrderValid, errors, errorCount } = this.orderValidation(updatedState, this.props)
    // update the state of the parent component to reflect new property/value
    // only update the trade if there were no errors detected.
    updateState(property, value)

    if (errorCount === 0) {
      this.updateTrade(updatedState)
    }
    // update the local state of this form
    this.setState({
      errors: {
        ...this.state.errors,
        ...errors,
      },
      [property]: value,
      isOrderValid,
    })
  }
  render() {
    const {
      isMobile,
      market,
      marketQuantity,
      marketType,
      nextPage,
      orderEthEstimate,
      orderShareEstimate,
      orderType,
      selectedOutcome,
      maxPrice,
      minPrice,
    } = this.props
    const s = this.state

    const tickSize = parseFloat(market.tickSize)
    const max = maxPrice.toString()
    const min = minPrice.toString()
    const errors = Array.from(new Set([...s.errors[this.INPUT_TYPES.QUANTITY], ...s.errors[this.INPUT_TYPES.PRICE], ...s.errors[this.INPUT_TYPES.MARKET_ORDER_SIZE]]))

    if (orderType === MARKET) {
      return (
        <ul className={Styles['TradingForm__form-body']}>
          { !isMobile && market.marketType === CATEGORICAL &&
            <li>
              <label>Outcome</label>
              <div className={Styles['TradingForm__static-field']}>{ selectedOutcome.name }</div>
            </li>
          }
          <li>
            <label htmlFor="tr__input--total-cost">Total Cost</label>
            <input
              className={classNames({ [`${Styles.error}`]: s.errors[this.INPUT_TYPES.MARKET_ORDER_SIZE].length })}
              id="tr__input--total-cost"
              type="number"
              step={tickSize}
              placeholder={`${marketType === SCALAR ? tickSize : '0.0001'} ETH`}
              value={BigNumber.isBigNumber(s[this.INPUT_TYPES.MARKET_ORDER_SIZE]) ? s[this.INPUT_TYPES.MARKET_ORDER_SIZE].toNumber() : s[this.INPUT_TYPES.MARKET_ORDER_SIZE]}
              onChange={e => this.validateForm(this.INPUT_TYPES.MARKET_ORDER_SIZE, e.target.value)}
            />
          </li>
          <li>
            <label>Quantity</label>
            <div className={Styles['TradingForm__static-field']}>{ marketQuantity }</div>
          </li>
          { errors.length > 0 &&
            <li className={Styles['TradingForm__error-message']}>
              { errors.map(error => <p key={error}>{error}</p>) }
            </li>
          }
          <li className={marketType === YES_NO ? Styles['TradingForm__button__yes_no--review'] : Styles['TradingForm__button--review']}>
            { marketType === YES_NO &&
              <label className={TooltipStyles.TooltipHint} data-tip data-for="tooltip--participation-tokens">{ Hint }</label>
            }
            <ReactTooltip
              id="tooltip--participation-tokens"
              className={TooltipStyles.Tooltip}
              effect="solid"
              place="left"
              type="light"
            >
              <h4>Don&apos;t think this event is going to happen?</h4>
              <p>Bet against this event occuring by selling shares of Yes (even though you don&apos;t own them). Learn more at docs.augur.net/#short-position</p>
            </ReactTooltip>
            <button
              disabled={(!s.isOrderValid)}
              onClick={s.isOrderValid ? nextPage : undefined}
            >Review
            </button>
          </li>
        </ul>
      )
    }

    if (orderType === LIMIT) {
      return (
        <div>
          <ul className={Styles['TradingForm__form-body']}>
            { !isMobile && market.marketType === CATEGORICAL &&
              <li>
                <label>Outcome</label>
                <div className={Styles['TradingForm__static-field']}>{ selectedOutcome.name }</div>
              </li>
            }
            <li className={Styles['TradingForm__limit-quantity']}>
              <label htmlFor="tr__input--quantity">Quantity</label>
              <input
                className={classNames({ [`${Styles.error}`]: s.errors[this.INPUT_TYPES.QUANTITY].length })}
                id="tr__input--quantity"
                type="number"
                step={tickSize}
                placeholder={`${marketType === SCALAR ? tickSize : '0.0001'} Shares`}
                value={BigNumber.isBigNumber(s[this.INPUT_TYPES.QUANTITY]) ? s[this.INPUT_TYPES.QUANTITY].toNumber() : s[this.INPUT_TYPES.QUANTITY]}
                onChange={e => this.validateForm(this.INPUT_TYPES.QUANTITY, e.target.value)}
              />
            </li>
            <li className={Styles['TradingForm__limit-price']}>
              <label htmlFor="tr__input--limit-price">Limit Price</label>
              <input
                className={classNames({ [`${Styles.error}`]: s.errors[this.INPUT_TYPES.PRICE].length })}
                id="tr__input--limit-price"
                type="number"
                step={tickSize}
                max={max}
                min={min}
                placeholder={`${marketType === SCALAR ? tickSize : '0.0001'} ETH`}
                value={BigNumber.isBigNumber(s[this.INPUT_TYPES.PRICE]) ? s[this.INPUT_TYPES.PRICE].toNumber() : s[this.INPUT_TYPES.PRICE]}
                onChange={e => this.validateForm(this.INPUT_TYPES.PRICE, e.target.value)}
              />
            </li>
          </ul>
          <ul className={Styles['TradingForm__form-estimated-cost']}>
            <li>
              <span>Est. Cost</span>
            </li>
            <li>
              <span>{ orderEthEstimate }</span>
              <span>{ orderShareEstimate }</span>
            </li>
          </ul>
          <ul className={Styles['TradingForm__form-body']}>
            { errors.length > 0 &&
              <li className={Styles['TradingForm__error-message']}>
                { errors.map(error => <p key={error}>{error}</p>) }
              </li>
            }
            <li className={marketType === YES_NO ? Styles['TradingForm__button__yes_no--review'] : Styles['TradingForm__button--review']}>
              { marketType === YES_NO &&
                <label className={TooltipStyles.TooltipHint} data-tip data-for="tooltip--participation-tokens">{ Hint }</label>
              }
              <ReactTooltip
                id="tooltip--participation-tokens"
                className={TooltipStyles.Tooltip}
                effect="solid"
                place="left"
                type="light"
              >
                <h4>Don&apos;t think this event is going to happen?</h4>
                <p>Bet against this event occuring by selling shares of Yes (even though you don&apos;t own them). Learn more at docs.augur.net/#short-position</p>
              </ReactTooltip>
              <button
                disabled={(!s.isOrderValid)}
                onClick={s.isOrderValid ? nextPage : undefined}
              >Review
              </button>
            </li>
          </ul>
        </div>
      )
    }
  }
}

export default MarketTradingForm
