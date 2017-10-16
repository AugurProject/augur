/* eslint react/no-array-index-key: 0 */  // due to potential for dup orders

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import BigNumber from 'bignumber.js'
import Highcharts from 'highcharts'
import noData from 'highcharts/modules/no-data-to-display'
// import { augur, constants } from 'services/augurjs';

import ComponentNav from 'modules/common/components/component-nav'
import Input from 'modules/common/components/input/input'
import CreateMarketFormInputNotifications from 'modules/create-market/components/create-market-form-input-notifications'

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'
import { NEW_MARKET_ORDER_BOOK } from 'modules/create-market/constants/new-market-creation-steps'
import { BUY, SELL } from 'modules/transactions/constants/types'
import { CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'

import getValue from 'utils/get-value'
import debounce from 'utils/debounce'

export default class CreateMarketFormOrderBook extends Component {
  static propTypes = {
    isValid: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    currentStep: PropTypes.number.isRequired,
    outcomes: PropTypes.array.isRequired,
    orderBook: PropTypes.object.isRequired,
    orderBookSorted: PropTypes.object.isRequired,
    orderBookSeries: PropTypes.object.isRequired,
    scalarSmallNum: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(BigNumber)
    ]).isRequired,
    scalarBigNum: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(BigNumber)
    ]).isRequired,
    initialLiquidityEth: PropTypes.instanceOf(BigNumber).isRequired,
    initialLiquidityGas: PropTypes.instanceOf(BigNumber).isRequired,
    initialLiquidityFees: PropTypes.instanceOf(BigNumber).isRequired,
    availableEth: PropTypes.string.isRequired,
    updateValidity: PropTypes.func.isRequired,
    addOrderToNewMarket: PropTypes.func.isRequired,
    removeOrderFromNewMarket: PropTypes.func.isRequired,
    updateNewMarket: PropTypes.func.isRequired
  }

  static defaultProps = {
    availableEth: '0'
  };

  constructor(props) {
    super(props)

    this.navItems = {
      [BUY]: {
        label: 'Bid'
      },
      [SELL]: {
        label: 'Ask'
      }
    }

    this.state = {
      errors: {
        quantity: [],
        price: []
      },
      isOrderValid: false,
      selectedOutcome: props.outcomes[0],
      selectedNav: Object.keys(this.navItems)[0],
      orderPrice: '',
      orderQuantity: '',
      quantityFocused: false,
      priceFocused: false,
      minPrice: new BigNumber(0),
      maxPrice: new BigNumber(1)
    }

    this.handleAutoFocus = this.handleAutoFocus.bind(this)
    this.updateChart = debounce(this.updateChart.bind(this))
    this.updatePriceBounds = this.updatePriceBounds.bind(this)
    this.handleAddOrder = this.handleAddOrder.bind(this)
    this.handleAddOrderViaEnter = this.handleAddOrderViaEnter.bind(this)
    this.handleRemoveOrder = this.handleRemoveOrder.bind(this)
    this.updateSeries = this.updateSeries.bind(this)
    this.sortOrderBook = this.sortOrderBook.bind(this)
    this.updateInitialLiquidityCosts = this.updateInitialLiquidityCosts.bind(this)
    this.validateForm = this.validateForm.bind(this)
  }

  componentDidMount() {
    noData(Highcharts)

    this.orderBookPreviewChart = new Highcharts.Chart('order_book_preview_chart_form', {
      chart: {
        width: 0,
        height: 0
      },
      lang: {
        noData: 'No orders to display'
      },
      yAxis: {
        title: {
          text: 'Shares'
        }
      },
      xAxis: {
        title: {
          text: 'Price'
        }
      },
      series: [
        {
          type: 'area',
          name: 'Bids',
          step: 'right',
          data: []
        },
        {
          type: 'area',
          name: 'Asks',
          step: 'left',
          data: []
        }
      ],
      credits: {
        enabled: false
      }
    })

    window.addEventListener('resize', this.updateChart)
    window.addEventListener('keypress', this.handleAddOrderViaEnter)
  }

  componentWillReceiveProps(nextProps) {
    if (newMarketCreationOrder[nextProps.currentStep] === NEW_MARKET_ORDER_BOOK && !nextProps.isValid) nextProps.updateValidity(true, true)

    if (this.props.outcomes !== nextProps.outcomes) this.setState({ selectedOutcome: nextProps.outcomes[0] })
    if (this.props.orderBook !== nextProps.orderBook) this.sortOrderBook(nextProps.orderBook)
    if (this.props.orderBookSorted !== nextProps.orderBookSorted) this.updateSeries(nextProps.orderBookSorted)
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.type !== nextProps.type ||
      this.props.scalarSmallNum !== nextProps.scalarSmallNum ||
      this.props.scalarBigNum !== nextProps.scalarBigNum ||
      this.props.orderBookSorted !== nextProps.orderBookSorted ||
      this.state.selectedSide !== nextState.selectedSide ||
      this.state.selectedNav !== nextState.selectedNav ||
      this.state.selectedOutcome !== nextState.selectedOutcome
    ) {
      this.updatePriceBounds(nextProps.type, nextState.selectedOutcome, nextState.selectedNav, nextProps.orderBookSorted, nextProps.scalarSmallNum, nextProps.scalarBigNum)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if ((newMarketCreationOrder[this.props.currentStep] === NEW_MARKET_ORDER_BOOK && prevProps.currentStep !== this.props.currentStep) ||
      prevProps.orderBookSeries !== this.props.orderBookSeries ||
      prevState.selectedOutcome !== this.state.selectedOutcome
    ) {
      this.updateChart()
    }

    if (prevProps.currentStep !== this.props.currentStep &&
      this.props.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_ORDER_BOOK)
    ) {
      this.handleAutoFocus()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateChart)
  }

  updateChart() {
    if (this.orderBookChart) {
      const bidSeries = getValue(this.props.orderBookSeries[this.state.selectedOutcome], `${BUY}`) || []
      const askSeries = getValue(this.props.orderBookSeries[this.state.selectedOutcome], `${SELL}`) || []
      let width

      if (window.getComputedStyle(this.orderBookChart).getPropertyValue('--adjust-width').indexOf('true') !== -1) {
        width = this.orderBookForm.clientWidth - 40 // 20px horizontal padding
      } else {
        width = this.orderBookPreview.clientWidth * 0.60
      }

      this.orderBookPreviewChart.update({
        title: {
          text: `${this.props.type === CATEGORICAL ? ''+this.state.selectedOutcome+': ' : ''}Depth Chart`
        },
        chart: {
          width,
          height: 400
        }
      }, false)

      this.orderBookPreviewChart.series[0].setData(bidSeries, false)
      this.orderBookPreviewChart.series[1].setData(askSeries, false)

      this.orderBookPreviewChart.redraw()
    }
  }

  updatePriceBounds(type, selectedOutcome, selectedSide, orderBook, scalarSmallNum, scalarBigNum) {
    const oppositeSide = selectedSide === BUY ? SELL : BUY
    const ZERO = new BigNumber(0)
    const ONE = new BigNumber(1)
    const precision = new BigNumber(10**-8)
    let minPrice
    let maxPrice

    if (selectedOutcome != null) {
      if (type === SCALAR) {
        if (selectedSide === BUY) {
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
      } else if (selectedSide === BUY) {
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

  handleAddOrder() {
    this.props.addOrderToNewMarket({
      outcome: this.state.selectedOutcome,
      type: this.state.selectedNav,
      price: this.state.orderPrice,
      quantity: this.state.orderQuantity
    })

    this.updateInitialLiquidityCosts({ type: this.state.selectedNav, price: this.state.orderPrice, quantity: this.state.orderQuantity })

    // Clear Inputs + Reset Form
    this.setState({ orderPrice: '', orderQuantity: '' }, () => {
      this.validateForm()
      this.handleAutoFocus()
      this.props.updateValidity(true)
    })
  }

  handleAddOrderViaEnter(e) {
    if (this.state.isOrderValid && e.keyCode === 13) this.handleAddOrder()
  }

  handleAutoFocus() {
    this.defaultFormToFocus.getElementsByTagName('input')[0].focus()
  }

  handleRemoveOrder(type, orderToRemove, i) {
    const orderToRemoveIndex = this.props.orderBook[this.state.selectedOutcome].findIndex(order => orderToRemove.price === order.price && orderToRemove.quantity === order.quantity)

    this.props.removeOrderFromNewMarket({ outcome: this.state.selectedOutcome, index: orderToRemoveIndex })

    this.updateInitialLiquidityCosts(this.props.orderBook[this.state.selectedOutcome][orderToRemoveIndex], true)
  }

  sortOrderBook(orderBook) {
    const orderBookSorted = Object.keys(orderBook).reduce((p, outcome) => {
      if (p[outcome] == null) p[outcome] = {}

      // Filter Orders By Type
      orderBook[outcome].forEach((order) => {
        if (p[outcome][order.type] == null) p[outcome][order.type] = []
        p[outcome][order.type].push({ price: order.price, quantity: order.quantity })
      })

      // Sort Order By Price
      Object.keys(p[outcome]).forEach((type) => {
        if (type === BUY) p[outcome][type] = p[outcome][type].sort((a, b) => b.price - a.price)
        if (type === SELL) p[outcome][type] = p[outcome][type].sort((a, b) => a.price - b.price)
      })

      return p
    }, {})

    this.props.updateNewMarket({ orderBookSorted })
  }

  updateSeries(orderBook) {
    const orderBookSeries = Object.keys(orderBook).reduce((p, outcome) => {
      if (p[outcome] == null) p[outcome] = {}

      Object.keys(orderBook[outcome]).forEach((type) => {
        if (p[outcome][type] == null) p[outcome][type] = []

        let totalQuantity = new BigNumber(0)

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

    this.props.updateNewMarket({ orderBookSeries })
  }

  updateInitialLiquidityCosts(order, shouldReduce) {
    let initialLiquidityEth
    let initialLiquidityGas
    let initialLiquidityFees
    let action

    // TODO replace getBidAction/getShortAskAction w/ new simulation
    if (order.type === BUY) {
      // action = augur.trading.simulation.getBidAction(order.quantity, order.price, makerFee, gasPrice);
    } else {
      // action = augur.trading.simulation.getShortAskAction(order.quantity, order.price, makerFee, gasPrice);
    }

    if (shouldReduce) {
      initialLiquidityEth = this.props.initialLiquidityEth.minus(order.price.times(order.quantity))
      initialLiquidityGas = this.props.initialLiquidityGas.minus(new BigNumber(action.gasEth))
      initialLiquidityFees = this.props.initialLiquidityFees.minus(new BigNumber(action.feeEth))
    } else {
      initialLiquidityEth = this.props.initialLiquidityEth.plus(order.quantity.times(order.price))
      initialLiquidityGas = this.props.initialLiquidityGas.plus(new BigNumber(action.gasEth))
      initialLiquidityFees = this.props.initialLiquidityFees.plus(new BigNumber(action.feeEth))
    }

    this.props.updateNewMarket({ initialLiquidityEth, initialLiquidityGas, initialLiquidityFees })
  }

  validateForm(orderQuantityRaw, orderPriceRaw) {
    const sanitizeValue = (value, type) => {
      if (value == null) {
        if (type === 'quantity') {
          return this.state.orderQuantity
        }
        return this.state.orderPrice
      } else if (!(value instanceof BigNumber) && value !== '') {
        return new BigNumber(value)
      }

      return value
    }

    const orderQuantity = sanitizeValue(orderQuantityRaw, 'quantity')
    const orderPrice = sanitizeValue(orderPriceRaw)

    const errors = {
      quantity: [],
      price: []
    }
    let isOrderValid

    // Validate Quantity
    if (orderQuantity !== '' && orderPrice !== '' && orderPrice.times(orderQuantity).plus(this.props.initialLiquidityEth).greaterThan(new BigNumber(this.props.availableEth))) {
      // Done this way so both inputs are in err
      errors.quantity.push('Insufficient funds')
      errors.price.push('Insufficient funds')
    } else if (orderQuantity !== '' && orderQuantity.lessThanOrEqualTo(new BigNumber(0))) {
      errors.quantity.push('Quantity must be positive')
    } else if (orderPrice !== '') {
      const bids = getValue(this.props.orderBookSorted[this.state.selectedOutcome], `${BUY}`)
      const asks = getValue(this.props.orderBookSorted[this.state.selectedOutcome], `${SELL}`)

      if (this.props.type !== SCALAR) {
        if (this.state.selectedNav === BUY && asks && asks.length && orderPrice.greaterThanOrEqualTo(asks[0].price)) {
          errors.price.push(`Price must be less than best ask price of: ${asks[0].price.toNumber()}`)
        } else if (this.state.selectedNav === SELL && bids && bids.length && orderPrice.lessThanOrEqualTo(bids[0].price)) {
          errors.price.push(`Price must be greater than best bid price of: ${bids[0].price.toNumber()}`)
        } else if (orderPrice.greaterThan(this.state.maxPrice)) {
          errors.price.push('Price cannot exceed 1')
        } else if (orderPrice.lessThan(this.state.minPrice)) {
          errors.price.push('Price cannot be below 0')
        }
      } else if (this.state.selectedNav === BUY && asks && asks.length && orderPrice.greaterThanOrEqualTo(asks[0].price)) {
        errors.price.push(`Price must be less than best ask price of: ${asks[0].price.toNumber()}`)
      } else if (this.state.selectedNav === SELL && bids && bids.length && orderPrice.lessThanOrEqualTo(bids[0].price)) {
        errors.price.push(`Price must be greater than best bid price of: ${bids[0].price.toNumber()}`)
      } else if (orderPrice.greaterThan(this.state.maxPrice)) {
        errors.price.push(`Price cannot exceed ${this.state.maxPrice.toNumber()}`)
      } else if (orderPrice.lessThan(this.state.minPrice)) {
        errors.price.push(`Price cannot be below ${this.state.minPrice.toNumber()}`)
      }
    }

    if (orderQuantity === '' || orderPrice === '' || errors.quantity.length || errors.price.length) {
      isOrderValid = false
    } else {
      isOrderValid = true
    }

    this.setState({
      errors,
      isOrderValid,
      orderQuantity,
      orderPrice
    })
  }

  render() {
    const p = this.props
    const s = this.state

    const errors = Array.from(new Set([...s.errors.quantity, ...s.errors.price]))

    const bids = getValue(p.orderBookSorted[s.selectedOutcome], `${BUY}`)
    const asks = getValue(p.orderBookSorted[s.selectedOutcome], `${SELL}`)

    return (
      <article
        ref={(orderBookForm) => { this.orderBookForm = orderBookForm }}
        className={`create-market-form-part create-market-form-order-book ${p.className || ''}`}
      >
        <div className="create-market-form-part-content">
          <div className="create-market-form-part-input" >
            <aside>
              <h3>Initial Liquidity</h3>
              <h4>optional</h4>
              <span>Use this form to add initial liquidity for your market.</span>
            </aside>
            <div className="vertical-form-divider" />
            <form
              onSubmit={e => e.preventDefault()}
            >
              <div className="order-book-actions">
                {p.type === CATEGORICAL &&
                  <div className="order-book-outcomes-table">
                    <div className="order-book-outcomes-header">
                      <span>Outcomes</span>
                    </div>
                    <div className="order-book-outcomes">
                      {p.outcomes.map(outcome => (
                        <div
                          key={outcome}
                          className={`order-book-outcome-row ${s.selectedOutcome === outcome ? 'selected' : ''}`}
                        >
                          <button
                            className="unstyled"
                            onClick={() => {
                              this.setState({ selectedOutcome: outcome })
                            }}
                          >
                            <span>{outcome}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                }
                <div
                  className={classNames('order-book-entry-container', {
                    'order-entry-only': p.type !== CATEGORICAL
                  })}
                >
                  <div
                    className="order-book-entry"
                    onSubmit={(e) => {
                      e.preventDefault()

                      this.handleAddOrder()
                    }}
                  >
                    <ComponentNav
                      fullWidth
                      navItems={this.navItems}
                      selectedNav={s.selectedNav}
                      updateSelectedNav={selectedNav => this.setState({ selectedNav })}
                    />
                    <div
                      ref={(defaultFormToFocus) => { this.defaultFormToFocus = defaultFormToFocus }}
                      className="order-book-entry-inputs"
                    >
                      <Input
                        key="order-entry-quantity"
                        className={classNames({ 'input-error': s.errors.quantity.length })}
                        type="number"
                        placeholder="Quantity"
                        value={s.orderQuantity}
                        isIncrementable
                        incrementAmount={0.1}
                        min={0}
                        onFocus={() => this.setState({ quantityFocused: true })}
                        onBlur={() => this.setState({ quantityFocused: false })}
                        updateValue={quantity => this.validateForm(quantity, undefined)}
                        onChange={quantity => this.validateForm(quantity, undefined)}
                      />
                      <span>@</span>
                      <Input
                        key="order-entry-price"
                        className={classNames({ 'input-error': s.errors.price.length })}
                        type="number"
                        placeholder="Price"
                        value={s.orderPrice}
                        isIncrementable
                        incrementAmount={0.1}
                        min={s.minPrice}
                        max={s.maxPrice}
                        onFocus={() => this.setState({ priceFocused: true })}
                        onBlur={() => this.setState({ priceFocused: false })}
                        updateValue={price => this.validateForm(undefined, price)}
                        onChange={price => this.validateForm(undefined, price)}
                      />
                    </div>
                    <CreateMarketFormInputNotifications
                      errors={errors}
                    />
                    <button
                      type="button"
                      className={classNames({ disabled: !s.isOrderValid })}
                      onClick={s.isOrderValid && this.handleAddOrder}
                    >
                      Add Order
                    </button>
                  </div>
                </div>
              </div>
              <div
                ref={(orderBookPreview) => { this.orderBookPreview = orderBookPreview }}
                className="order-book-preview"
              >
                <div
                  ref={(orderBookChart) => { this.orderBookChart = orderBookChart }}
                  id="order_book_preview_chart_form"
                />
                <div className="order-book-preview-table">
                  <div className="order-book-preview-table-header">
                    <span>Bid Qty</span>
                    <span>Bid</span>
                    <span>Ask</span>
                    <span>Ask Qty</span>
                  </div>
                  <div className="order-book-preview-table-content">
                    <ul className="order-book-preview-table-bids">
                      {bids ?
                        bids.map((bid, i) => (
                          <li
                            key={i}
                          >
                            <button
                              className="unstyled table-cells"
                              onClick={(e) => {
                                const target = e.currentTarget
                                target.classList.add('display-order-removal-button')
                                setTimeout(() => {
                                  target.classList.remove('display-order-removal-button')
                                }, 2000)
                              }}
                            >
                              <span>
                                {`${bid.quantity}`}
                              </span>
                              <span>
                                {`${bid.price}`}
                              </span>
                            </button>
                            <button
                              className="unstyled remove-order"
                              onClick={() => this.handleRemoveOrder(BUY, bid, i)}
                            >
                              <i className="fa fa-trash" />
                            </button>
                          </li>
                      )) :
                        <span>No Bids</span>
                      }
                    </ul>
                    <ul className="order-book-preview-table-asks">
                      {asks ?
                        asks.map((ask, i) => (
                          <li
                            key={i}
                          >
                            <button
                              className="unstyled table-cells"
                              onClick={(e) => {
                                const target = e.currentTarget
                                target.classList.add('display-order-removal-button')
                                setTimeout(() => {
                                  target.classList.remove('display-order-removal-button')
                                }, 2000)
                              }}
                            >
                              <span>
                                {`${ask.price}`}
                              </span>
                              <span>
                                {`${ask.quantity}`}
                              </span>
                            </button>
                            <button
                              className="unstyled remove-order"
                              onClick={() => this.handleRemoveOrder(SELL, ask, i)}
                            >
                              <i className="fa fa-trash" />
                            </button>
                          </li>
                        )) :
                        <span>No Asks</span>
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </article>
    )
  }
}
