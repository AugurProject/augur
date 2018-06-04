/* eslint jsx-a11y/label-has-for: 0 */
/* eslint react/no-array-index-key: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { BigNumber, createBigNumber } from 'utils/create-big-number'
import { augur } from 'services/augurjs'

import InputDropdown from 'modules/common/components/input-dropdown/input-dropdown'
import { ExclamationCircle as InputErrorIcon } from 'modules/common/components/icons'
import CreateMarketFormLiquidityCharts from 'modules/create-market/containers/create-market-form-liquidity-charts'

import { BID, ASK } from 'modules/transactions/constants/types'
import { CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'

import getValue from 'utils/get-value'

import Styles from 'modules/create-market/components/create-market-form-liquidity/create-market-form-liquidity.styles'
import StylesForm from 'modules/create-market/components/create-market-form/create-market-form.styles'

const PRECISION = 4
const NEW_ORDER_GAS_ESTIMATE = createBigNumber(700000)

export default class CreateMarketLiquidity extends Component {

  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    updateNewMarket: PropTypes.func.isRequired,
    validateNumber: PropTypes.func.isRequired,
    addOrderToNewMarket: PropTypes.func.isRequired,
    availableEth: PropTypes.string.isRequired,
    isMobileSmall: PropTypes.bool.isRequired,
    keyPressed: PropTypes.func.isRequired,
    liquidityState: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    const defaultOutcome = this.props.newMarket.type === CATEGORICAL ? '' : 1
    this.state = {
      errors: {
        quantity: [],
        price: [],
      },
      isOrderValid: false,
      orderPrice: props.liquidityState && props.liquidityState.orderPrice ? props.liquidityState.orderPrice : '',
      orderQuantity: props.liquidityState && props.liquidityState.orderQuantity ? props.liquidityState.orderQuantity : '',
      orderEstimate: props.liquidityState && props.liquidityState.orderEstimate ? props.liquidityState.orderEstimate : '',
      minPrice: createBigNumber(0),
      maxPrice: createBigNumber(1),
      selectedNav: props.liquidityState && props.liquidityState.selectedNav ? props.liquidityState.selectedNav : BID,
      selectedOutcome: props.liquidityState && props.liquidityState.selectedOutcome ? props.liquidityState.selectedOutcome : defaultOutcome,
    }

    this.handleAddOrder = this.handleAddOrder.bind(this)
    this.updatePriceBounds = this.updatePriceBounds.bind(this)
    this.updateSeries = this.updateSeries.bind(this)
    this.sortOrderBook = this.sortOrderBook.bind(this)
    this.updateInitialLiquidityCosts = this.updateInitialLiquidityCosts.bind(this)
    this.validateForm = this.validateForm.bind(this)
    this.updateOrderEstimate = this.updateOrderEstimate.bind(this)
  }

  componentWillMount() {
    const { newMarket } = this.props
    this.updatePriceBounds(newMarket.type, this.state.selectedOutcome, this.state.selectedNav, newMarket.orderBookSorted, newMarket.scalarSmallNum, newMarket.scalarBigNum)
  }

  componentDidMount() {
    if (Object.keys(this.props.liquidityState).length > 0) {
      this.validateForm()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { newMarket } = this.props
    if (newMarket.orderBook !== nextProps.newMarket.orderBook) this.sortOrderBook(nextProps.newMarket.orderBook)
    if (newMarket.orderBookSorted !== nextProps.newMarket.orderBookSorted) this.updateSeries(nextProps.newMarket.orderBookSorted)
  }

  componentWillUpdate(nextProps, nextState) {
    const { newMarket } = this.props
    if (newMarket.type !== nextProps.newMarket.type ||
      newMarket.scalarSmallNum !== nextProps.newMarket.scalarSmallNum ||
      newMarket.scalarBigNum !== nextProps.newMarket.scalarBigNum ||
      newMarket.orderBookSorted !== nextProps.newMarket.orderBookSorted ||
      this.state.selectedNav !== nextState.selectedNav ||
      this.state.selectedOutcome !== nextState.selectedOutcome
    ) {
      this.updatePriceBounds(nextProps.newMarket.type, nextState.selectedOutcome, nextState.selectedNav, nextProps.newMarket.orderBookSorted, nextProps.newMarket.scalarSmallNum, nextProps.newMarket.scalarBigNum)
    }
  }

  componentWillUnmount() {
    const liquidityState = {
      orderPrice: this.state.orderPrice,
      orderQuantity: this.state.orderQuantity,
      orderEstimate: this.state.orderEstimate,
      selectedOutcome: this.state.selectedOutcome,
      selectedNav: this.state.selectedNav,
    }
    this.props.updateState({
      liquidityState,
    })
  }

  handleAddOrder() {
    const { addOrderToNewMarket } = this.props
    if (this.state.isOrderValid) {
      addOrderToNewMarket({
        outcome: this.state.selectedOutcome,
        type: this.state.selectedNav,
        price: this.state.orderPrice,
        quantity: this.state.orderQuantity,
      })

      this.updateInitialLiquidityCosts({
        type: this.state.selectedNav,
        price: this.state.orderPrice,
        quantity: this.state.orderQuantity,
      })

      this.setState({
        orderPrice: '',
        orderQuantity: '',
      }, this.validateForm)
    }
  }

  updatePriceBounds(type, selectedOutcome, selectedSide, orderBook, scalarSmallNum, scalarBigNum) {
    const oppositeSide = selectedSide === BID ? ASK : BID
    const ZERO = createBigNumber(0)
    const ONE = createBigNumber(1)
    const precision = createBigNumber(10**-PRECISION)
    let minPrice
    let maxPrice

    if (selectedOutcome != null) {
      if (type === SCALAR) {
        if (selectedSide === BID) {
          // Minimum Price
          minPrice = scalarSmallNum

          // Maximum Price
          if (orderBook[selectedOutcome] && orderBook[selectedOutcome][oppositeSide] && orderBook[selectedOutcome][oppositeSide].length) {
            maxPrice = orderBook[selectedOutcome][oppositeSide][0].price.minus(precision)
          } else {
            maxPrice = scalarBigNum
          }
        } else {
          // Minimum Price
          if (orderBook[selectedOutcome] && orderBook[selectedOutcome][oppositeSide] && orderBook[selectedOutcome][oppositeSide].length) {
            minPrice = orderBook[selectedOutcome][oppositeSide][0].price.plus(precision)
          } else {
            minPrice = scalarSmallNum
          }

          // Maximum Price
          maxPrice = scalarBigNum
        }
      } else if (selectedSide === BID) {
        // Minimum Price
        minPrice = ZERO

        // Maximum Price
        if (orderBook[selectedOutcome] && orderBook[selectedOutcome][oppositeSide] && orderBook[selectedOutcome][oppositeSide].length) {
          maxPrice = orderBook[selectedOutcome][oppositeSide][0].price.minus(precision)
        } else {
          maxPrice = ONE
        }
      } else {
        // Minimum Price
        if (orderBook[selectedOutcome] && orderBook[selectedOutcome][oppositeSide] && orderBook[selectedOutcome][oppositeSide].length) {
          minPrice = orderBook[selectedOutcome][oppositeSide][0].price.plus(precision)
        } else {
          minPrice = ZERO
        }

        // Maximum Price
        maxPrice = ONE
      }
    }

    this.setState({ minPrice, maxPrice })
  }

  sortOrderBook(orderBook) {
    const { updateNewMarket } = this.props
    const orderBookSorted = Object.keys(orderBook).reduce((p, outcome) => {
      if (p[outcome] == null) p[outcome] = {}

      // Filter Orders By Type
      orderBook[outcome].forEach((order) => {
        if (p[outcome][order.type] == null) p[outcome][order.type] = []
        p[outcome][order.type].push({ price: order.price, quantity: order.quantity })
      })

      // Sort Order By Price
      Object.keys(p[outcome]).forEach((type) => {
        if (type === BID) p[outcome][type] = p[outcome][type].sort((a, b) => b.price - a.price)
        if (type === ASK) p[outcome][type] = p[outcome][type].sort((a, b) => a.price - b.price)
      })

      return p
    }, {})

    updateNewMarket({ orderBookSorted })
  }

  updateSeries(orderBook) {
    const { updateNewMarket } = this.props
    const orderBookSeries = Object.keys(orderBook).reduce((p, outcome) => {
      if (p[outcome] == null) p[outcome] = {}

      Object.keys(orderBook[outcome]).forEach((type) => {
        if (p[outcome][type] == null) p[outcome][type] = []

        let totalQuantity = createBigNumber(0)

        orderBook[outcome][type].forEach((order) => {
          const matchedPriceIndex = p[outcome][type].findIndex(existing => existing[0] === order.price.toNumber())

          totalQuantity = totalQuantity.plus(order.quantity)

          if (matchedPriceIndex > -1) {
            p[outcome][type][matchedPriceIndex][1] = totalQuantity.toNumber()
          } else {
            p[outcome][type].push([order.price.toNumber(), totalQuantity.toNumber()])
          }
        })

        p[outcome][type].sort((a, b) => a[0] - b[0])
      })

      return p
    }, {})

    updateNewMarket({ orderBookSeries })
  }

  updateInitialLiquidityCosts(order, shouldReduce) {
    const {
      availableEth,
      newMarket,
      updateNewMarket,
    } = this.props
    const minPrice = newMarket.type === SCALAR ? newMarket.scalarSmallNum : 0
    const maxPrice = newMarket.type === SCALAR ? newMarket.scalarBigNum : 1
    const shareBalances = newMarket.outcomes.map(outcome => 0)
    let outcome
    let initialLiquidityEth
    let initialLiquidityGas

    switch (newMarket.type) {
      case CATEGORICAL:
        newMarket.outcomes.forEach((outcomeName, index) => {
          if (this.state.selectedOutcome === outcomeName) outcome = index
        })
        break
      case SCALAR:
        outcome = this.state.selectedOutcome
        break
      default:
        outcome = 1
    }

    const orderInfo = {
      orderType: order.type === BID ? 0 : 1,
      outcome,
      shares: order.quantity,
      price: order.price,
      tokenBalance: availableEth,
      minPrice,
      maxPrice,
      marketCreatorFeeRate: newMarket.settlementFee,
      reportingFeeRate: 0,
      shareBalances,
      singleOutcomeOrderBook: newMarket.orderBook[outcome] || {},
    }
    const action = augur.trading.simulateTrade(orderInfo)
    // NOTE: Fees are going to always be 0 because we are only opening orders, and there is no costs associated with opening orders other than the escrowed ETH and the gas to put the order up.
    if (shouldReduce) {
      initialLiquidityEth = newMarket.initialLiquidityEth.minus(action.tokensDepleted)
      initialLiquidityGas = newMarket.initialLiquidityGas.minus(NEW_ORDER_GAS_ESTIMATE)
    } else {
      initialLiquidityEth = newMarket.initialLiquidityEth.plus(action.tokensDepleted)
      initialLiquidityGas = newMarket.initialLiquidityGas.plus(NEW_ORDER_GAS_ESTIMATE)
    }

    updateNewMarket({ initialLiquidityEth, initialLiquidityGas })
  }

  validateForm(orderQuantityRaw, orderPriceRaw) {
    const {
      availableEth,
      newMarket,
    } = this.props
    const tickSize = createBigNumber(newMarket.tickSize)
    const sanitizeValue = (value, type) => {
      if (value == null) {
        if (type === 'quantity') {
          return this.state.orderQuantity
        }
        return this.state.orderPrice
      } else if (!(BigNumber.isBigNumber(value)) && value !== '') {
        return createBigNumber(value)
      }

      return value
    }

    const orderQuantity = sanitizeValue(orderQuantityRaw, 'quantity')
    const orderPrice = sanitizeValue(orderPriceRaw)

    const errors = {
      quantity: [],
      price: [],
    }
    let isOrderValid

    // Validate Quantity
    if (orderQuantity !== '' && orderPrice !== '' && orderPrice.times(orderQuantity).plus(newMarket.initialLiquidityEth).gt(createBigNumber(availableEth))) {
      // Done this way so both inputs are in err
      errors.quantity.push('Insufficient funds')
      errors.price.push('Insufficient funds')
    } else if (orderQuantity !== '' && orderQuantity.lte(createBigNumber(0))) {
      errors.quantity.push('Quantity must be positive')
    } else if (orderPrice !== '') {
      const bids = getValue(newMarket.orderBookSorted[this.state.selectedOutcome], `${BID}`)
      const asks = getValue(newMarket.orderBookSorted[this.state.selectedOutcome], `${ASK}`)

      if (orderPrice.mod(tickSize).gt('0')) {
        errors.price.push(`Price must be a multiple of ${tickSize}`)
      }
      if (newMarket.type !== SCALAR) {
        if (this.state.selectedNav === BID && asks && asks.length && orderPrice.gte(asks[0].price)) {
          errors.price.push(`Price must be less than best ask price of: ${asks[0].price.toNumber()}`)
        } else if (this.state.selectedNav === ASK && bids && bids.length && orderPrice.lte(bids[0].price)) {
          errors.price.push(`Price must be greater than best bid price of: ${bids[0].price.toNumber()}`)
        } else if (orderPrice.gte(this.state.maxPrice)) {
          errors.price.push('Price must be less than 1')
        } else if (orderPrice.lt(this.state.minPrice)) {
          errors.price.push('Price must be greater than 0')
        }
      } else if (this.state.selectedNav === BID && asks && asks.length && orderPrice.gte(asks[0].price)) {
        errors.price.push(`Price must be less than best ask price of: ${asks[0].price.toNumber()}`)
      } else if (this.state.selectedNav === ASK && bids && bids.length && orderPrice.lte(bids[0].price)) {
        errors.price.push(`Price must be greater than best bid price of: ${bids[0].price.toNumber()}`)
      } else if (orderPrice.gte(this.state.maxPrice)) {
        errors.price.push(`Price must be less than ${this.state.maxPrice.toNumber()}`)
      } else if (orderPrice.lte(this.state.minPrice)) {
        errors.price.push(`Price must be greater than ${this.state.minPrice.toNumber()}`)
      }
    }

    if (this.state.selectedOutcome === '' || orderQuantity === '' || orderPrice === '' || errors.quantity.length || errors.price.length) {
      isOrderValid = false
    } else {
      isOrderValid = true
    }
    let orderEstimate = ''
    if (isOrderValid) {
      const minPrice = newMarket.type === SCALAR ? newMarket.scalarSmallNum : 0
      const maxPrice = newMarket.type === SCALAR ? newMarket.scalarBigNum : 1
      const shareBalances = newMarket.outcomes.map(outcome => 0)
      const outcome = this.props.newMarket.type === CATEGORICAL ? newMarket.outcomes.indexOf(this.state.selectedOutcome) : this.state.selectedOutcome
      const orderType = this.state.selectedNav === BID ? 0: 1
      const orderInfo = {
        orderType,
        outcome,
        shares: orderQuantity,
        price: orderPrice,
        tokenBalance: availableEth,
        minPrice,
        maxPrice,
        marketCreatorFeeRate: newMarket.settlementFee,
        reportingFeeRate: 0,
        shareBalances,
        singleOutcomeOrderBook: newMarket.orderBook[outcome] || {},
      }
      const action = augur.trading.simulateTrade(orderInfo)
      if (createBigNumber(action.tokensDepleted, 10).lt(tickSize)) {
        errors.price.push(`Est. Cost of trade must be at least ${tickSize}`)
        isOrderValid = false
      }
      orderEstimate = `${action.tokensDepleted} ETH`
    }

    this.setState({
      errors,
      isOrderValid,
      orderQuantity,
      orderPrice,
      orderEstimate,
    })
  }

  updateOrderEstimate(orderEstimate) {
    this.setState({ orderEstimate })
  }

  formatOrderValue(orderValue) {
    return orderValue !== '' ? createBigNumber(this.state.orderQuantity, 10).toString() : orderValue
  }

  render() {
    const {
      isMobileSmall,
      newMarket,
      validateNumber,
      keyPressed,
    } = this.props
    const s = this.state

    const errors = Array.from(new Set([...s.errors.quantity, ...s.errors.price]))
    return (
      <ul className={StylesForm.CreateMarketForm__fields}>
        <li className={Styles.CreateMarketLiquidity__settlement}>
          <label htmlFor="cm__input--settlement" className={Styles.CreateMarketLiquidity__settlementLabel}>
            <span>Market Creator Fee</span>
          </label>
          <div>
            <input
              id="cm__input--settlement"
              type="number"
              value={newMarket.settlementFee}
              placeholder="0"
              onChange={e => validateNumber('settlementFee', e.target.value, 'market creator fee', 0, 100, 2)}
              onKeyPress={e => keyPressed(e)}
            />
            <span className={Styles.CreateMarketLiquidity__settlementFeePercent}>%</span>
          </div>
          { newMarket.validations[newMarket.currentStep].settlementFee.length &&
            <span className={[`${StylesForm['CreateMarketForm__error--bottom']}`]}>{InputErrorIcon} { newMarket.validations[newMarket.currentStep].settlementFee }</span>
          }
        </li>
        <li>
          <label>
            <span>Add Order for Initial Liquidity</span>
          </label>
          <p>Recommended for adding liquidity to market.</p>
        </li>
        <li className={Styles.CreateMarketLiquidity__order}>
          <div className={Styles['CreateMarketLiquidity__order-form']}>
            <ul className={Styles['CreateMarketLiquidity__order-form-header']}>
              <li className={classNames({ [`${Styles.active}`]: s.selectedNav === BID })}>
                <button
                  onClick={() => {
                    this.setState({ selectedNav: BID }, () => this.validateForm(this.formatOrderValue(this.state.orderQuantity), this.formatOrderValue(this.state.orderPrice)))
                  }}
                >
                  Buy
                </button>
              </li>
              <li className={classNames({ [`${Styles.active}`]: s.selectedNav === ASK })}>
                <button
                  onClick={() => {
                    this.setState({ selectedNav: ASK }, () => this.validateForm(this.formatOrderValue(this.state.orderQuantity), this.formatOrderValue(this.state.orderPrice)))
                  }}
                >
                  Sell
                </button>
              </li>
            </ul>
            <ul className={Styles['CreateMarketLiquidity__order-form-body']}>
              { newMarket.type === CATEGORICAL &&
                <li>
                  <label>Outcome</label>
                  <InputDropdown
                    className={Styles['CreateMarketLiquidity__outcomes-categorical']}
                    label="Choose an Outcome"
                    default={s.selectedOutcome || ''}
                    options={newMarket.outcomes.filter(outcome => outcome !== '')}
                    onChange={(value) => {
                      this.setState({ selectedOutcome: value }, () => {
                        this.validateForm()
                      })
                    }}
                    isMobileSmall={isMobileSmall}
                  />
                </li>
              }
              <li>
                <label htmlFor="cm__input--quantity">Quantity</label>
                <input
                  className={classNames({ [`${StylesForm.error}`]: s.errors.quantity.length })}
                  id="cm__input--quantity"
                  type="number"
                  step={10**-PRECISION}
                  placeholder="0.0000 Shares"
                  value={BigNumber.isBigNumber(s.orderQuantity) ? s.orderQuantity.toNumber() : s.orderQuantity}
                  onChange={e => this.validateForm(e.target.value, undefined)}
                  onKeyPress={e => keyPressed(e)}
                />
              </li>
              <li>
                <label htmlFor="cm__input--limit-price">Limit Price</label>
                <input
                  className={classNames({ [`${StylesForm.error}`]: s.errors.price.length })}
                  id="cm__input--limit-price"
                  type="number"
                  step={newMarket.tickSize}
                  placeholder={`${newMarket.tickSize} ETH`}
                  value={BigNumber.isBigNumber(s.orderPrice) ? s.orderPrice.toNumber() : s.orderPrice}
                  onChange={e => this.validateForm(undefined, e.target.value)}
                  onKeyPress={e => keyPressed(e)}
                />
              </li>
              <li>
                <label>Est. Cost</label>
                <div className={Styles['CreateMarketLiquidity__order-est']}>{ s.orderEstimate }</div>
              </li>
              <li>
                { errors.map((error, i) => <p key={i} className={StylesForm.error}>{error}</p>) }
              </li>
              <li className={Styles['CreateMarketLiquidity__order-add']}>
                <button
                  disabled={!s.isOrderValid}
                  onClick={this.handleAddOrder}
                >Add Order
                </button>
              </li>
            </ul>
          </div>
          <div className={Styles['CreateMarketLiquidity__order-graph']}>
            <CreateMarketFormLiquidityCharts
              excludeCandlestick
              selectedOutcome={s.selectedOutcome}
              updateSelectedOrderProperties={() => {}}
            />
          </div>
        </li>
      </ul>
    )
  }
}
