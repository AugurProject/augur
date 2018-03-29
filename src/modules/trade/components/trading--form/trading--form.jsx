/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { BigNumber } from 'utils/wrapped-big-number'

import { MARKET, LIMIT } from 'modules/transactions/constants/types'
import { SCALAR } from 'modules/markets/constants/market-types'
import { isEqual } from 'lodash'

import Styles from 'modules/trade/components/trading--form/trading--form.styles'

class MarketTradingForm extends Component {
  static propTypes = {
    market: PropTypes.object.isRequired,
    marketType: PropTypes.string.isRequired,
    selectedNav: PropTypes.string.isRequired,
    orderType: PropTypes.string.isRequired,
    orderPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]).isRequired,
    orderQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]).isRequired,
    orderEstimate: PropTypes.string.isRequired,
    selectedOutcome: PropTypes.object.isRequired,
    nextPage: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
    minPrice: PropTypes.number.isRequired,
    maxPrice: PropTypes.number.isRequired,
    availableFunds: PropTypes.instanceOf(BigNumber).isRequired,
  }

  constructor(props) {
    super(props)

    this.INPUT_TYPES = {
      QUANTITY: 'orderQuantity',
      PRICE: 'orderPrice',
      MARKET_ORDER_SIZE: 'marketOrderTotal',
    }

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
      orderEstimate: nextProps.orderEstimate,
      selectedNav: nextProps.selectedNav,
      ...newStateInfo,
    }
    const currentOrderInfo = {
      orderEstimate: this.props.orderEstimate,
      selectedNav: this.props.selectedNav,
      ...currentStateInfo,
    }

    if (!isEqual(newOrderInfo, currentOrderInfo)) {
      // trade has changed, lets update trade.
      this.updateTrade(newStateInfo, nextProps)

      const nextTradePrice = nextProps.selectedOutcome.trade.limitPrice
      const prevTradePrice = this.props.selectedOutcome.trade.limitPrice
      // limitPrice is being defaulted and we had no value in the input box
      const priceChange = (prevTradePrice === null && nextTradePrice !== null)
      // limitPrice is being updated in the background, but we have no limitPrice input set.
      const forcePriceUpdate = (prevTradePrice === nextTradePrice) && (nextTradePrice !== null) && isNaN(this.state[this.INPUT_TYPES.PRICE] && new BigNumber(this.state[this.INPUT_TYPES.PRICE])) && isNaN(nextProps[this.INPUT_TYPES.PRICE] && new BigNumber(nextProps[this.INPUT_TYPES.PRICE]))

      if ((priceChange || forcePriceUpdate)) {
        // if limitPrice input hasn't been changed and we have defaulted the limitPrice, populate the field so as to not confuse the user as to where estimates are coming from.
        this.props.updateState(this.INPUT_TYPES.PRICE, new BigNumber(nextTradePrice))
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
    if (isNaN(value)) return { isOrderValid: false, errors, errorCount }
    if (value && value.lt(0)) {
      errorCount += 1
      passedTest = false
      errors[this.INPUT_TYPES.QUANTITY].push('Quantity must be greater than 0')
    }
    return { isOrderValid: passedTest, errors, errorCount }
  }

  testPrice(value, errors, isOrderValid) {
    let errorCount = 0
    let passedTest = !!isOrderValid
    if (isNaN(value)) return { isOrderValid: false, errors, errorCount }
    if (value && (value.lt(this.props.minPrice) || value.gt(this.props.maxPrice))) {
      errorCount += 1
      passedTest = false
      errors[this.INPUT_TYPES.PRICE].push(`Price must be between ${this.props.minPrice} - ${this.props.maxPrice}`)
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

    let value = order[this.INPUT_TYPES.QUANTITY] && new BigNumber(order[this.INPUT_TYPES.QUANTITY])
    const { isOrderValid: quantityValid, errors: quantityErrors, errorCount: quantityErrorCount } = this.testQuantity(value, errors, isOrderValid)
    isOrderValid = quantityValid
    errorCount += quantityErrorCount
    errors = { ...errors, ...quantityErrors }

    value = order[this.INPUT_TYPES.PRICE] && new BigNumber(order[this.INPUT_TYPES.PRICE])
    const { isOrderValid: priceValid, errors: priceErrors, errorCount: priceErrorCount } = this.testPrice(value, errors, isOrderValid)
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
    let value = rawValue
    if (!(value instanceof BigNumber) && value !== '') value = new BigNumber(value)
    const updatedState = {
      ...this.state,
      [property]: value,
    }
    const { isOrderValid, errors, errorCount } = this.orderValidation(updatedState, this.props)
    // update the state of the parent component to reflect new property/value
    // only update the trade if there were no errors detected.
    this.props.updateState(property, value)

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
    const p = this.props
    const s = this.state

    const tickSize = parseFloat(p.market.tickSize)
    const errors = Array.from(new Set([...s.errors[this.INPUT_TYPES.QUANTITY], ...s.errors[this.INPUT_TYPES.PRICE], ...s.errors[this.INPUT_TYPES.MARKET_ORDER_SIZE]]))

    return (
      <ul className={Styles['TradingForm__form-body']}>
        { !p.isMobile && p.market.marketType !== SCALAR &&
          <li>
            <label>Outcome</label>
            <div className={Styles['TradingForm__static-field']}>{ p.selectedOutcome.name }</div>
          </li>
        }
        { p.orderType === MARKET &&
          <li>
            <label htmlFor="tr__input--total-cost">Total Cost</label>
            <input
              className={classNames({ [`${Styles.error}`]: s.errors[this.INPUT_TYPES.MARKET_ORDER_SIZE].length })}
              id="tr__input--total-cost"
              type="number"
              step={tickSize}
              placeholder={`${p.marketType === SCALAR ? tickSize : '0.0001'} ETH`}
              value={s[this.INPUT_TYPES.MARKET_ORDER_SIZE] instanceof BigNumber ? s[this.INPUT_TYPES.MARKET_ORDER_SIZE].toNumber() : s[this.INPUT_TYPES.MARKET_ORDER_SIZE]}
              onChange={e => this.validateForm(this.INPUT_TYPES.MARKET_ORDER_SIZE, e.target.value)}
            />
          </li>
        }
        { p.orderType === LIMIT &&
          <li>
            <label htmlFor="tr__input--quantity">Quantity</label>
            <input
              className={classNames({ [`${Styles.error}`]: s.errors[this.INPUT_TYPES.QUANTITY].length })}
              id="tr__input--quantity"
              type="number"
              step={tickSize}
              placeholder={`${p.marketType === SCALAR ? tickSize : '0.0001'} Shares`}
              value={s[this.INPUT_TYPES.QUANTITY] instanceof BigNumber ? s[this.INPUT_TYPES.QUANTITY].toNumber() : s[this.INPUT_TYPES.QUANTITY]}
              onChange={e => this.validateForm(this.INPUT_TYPES.QUANTITY, e.target.value)}
            />
          </li>
        }
        { p.orderType === LIMIT &&
          <li>
            <label htmlFor="tr__input--limit-price">Limit Price</label>
            <input
              className={classNames({ [`${Styles.error}`]: s.errors[this.INPUT_TYPES.PRICE].length })}
              id="tr__input--limit-price"
              type="number"
              step={tickSize}
              placeholder={`${p.marketType === SCALAR ? tickSize : '0.0001'} ETH`}
              value={s[this.INPUT_TYPES.PRICE] instanceof BigNumber ? s[this.INPUT_TYPES.PRICE].toNumber() : s[this.INPUT_TYPES.PRICE]}
              onChange={e => this.validateForm(this.INPUT_TYPES.PRICE, e.target.value)}
            />
          </li>
        }
        { p.orderType === LIMIT &&
          <li>
            <label>Est. Cost</label>
            <div className={Styles['TradingForm__static-field']}>{ p.orderEstimate }</div>
          </li>
        }
        { p.orderType === MARKET &&
          <li>
            <label>Quantity</label>
            <div className={Styles['TradingForm__static-field']}>{ p.marketQuantity }</div>
          </li>
        }
        { errors.length > 0 &&
          <li className={Styles['TradingForm__error-message']}>
            { errors.map(error => <p key={error}>{error}</p>) }
          </li>
        }
        <li className={Styles['TradingForm__button--review']}>
          <button
            disabled={(!s.isOrderValid)}
            onClick={s.isOrderValid ? p.nextPage : undefined}
          >Review
          </button>
        </li>
      </ul>
    )
  }
}

export default MarketTradingForm
