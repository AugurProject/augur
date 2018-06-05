import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { BigNumber, createBigNumber } from 'utils/create-big-number'

import MarketTradingForm from 'modules/trade/components/trading--form/trading--form'
import MarketTradingConfirm from 'modules/trade/components/trading--confirm/trading--confirm'
import { Close } from 'modules/common/components/icons'

import makePath from 'modules/routes/helpers/make-path'
import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'

import getValue from 'utils/get-value'
import { isEqual } from 'lodash'

import { BUY, SELL, LIMIT } from 'modules/transactions/constants/types'
import { ACCOUNT_DEPOSIT } from 'modules/routes/constants/views'

import Styles from 'modules/trade/components/trading--wrapper/trading--wrapper.styles'

class MarketTradingWrapper extends Component {
  static propTypes = {
    market: PropTypes.object.isRequired,
    isLogged: PropTypes.bool.isRequired,
    selectedOrderProperties: PropTypes.object.isRequired,
    initialMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    availableFunds: PropTypes.instanceOf(BigNumber).isRequired,
    isMobile: PropTypes.bool.isRequired,
    toggleForm: PropTypes.func.isRequired,
    showOrderPlaced: PropTypes.func.isRequired,
    clearTradeInProgress: PropTypes.func.isRequired,
    selectedOutcome: PropTypes.object,
    updateSelectedOrderProperties: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      orderType: LIMIT,
      orderPrice: '',
      orderQuantity: '',
      orderEthEstimate: '',
      orderShareEstimate: '',
      marketOrderTotal: '',
      marketQuantity: '',
      selectedNav: BUY,
      currentPage: 0,
      doNotCreateOrders: false,
    }

    this.prevPage = this.prevPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.updateState = this.updateState.bind(this)
    this.clearOrderForm = this.clearOrderForm.bind(this)
    this.updateOrderEthEstimate = this.updateOrderEthEstimate.bind(this)
    this.updateOrderShareEstimate = this.updateOrderShareEstimate.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { selectedOrderProperties } = this.props
    if (!nextProps.selectedOutcome || !nextProps.selectedOutcome.trade) {
      this.setState({ currentPage: 0 })
      return
    }
    if (this.props.selectedOutcome === null) return this.clearOrderForm()
    if (this.props.selectedOutcome && this.props.selectedOutcome.name !== nextProps.selectedOutcome.name) {
      return this.clearOrderForm()
    }
    const nextTotalCost = createBigNumber(nextProps.selectedOutcome.trade.totalCost.formattedValue)
    const nextShareCost = createBigNumber(nextProps.selectedOutcome.trade.shareCost.formattedValue)

    if (`${nextTotalCost.abs().toString()} ETH` !== this.state.orderEthEstimate) {
      const orderEthEstimate = (isNaN(nextTotalCost) || nextTotalCost.abs().eq(0)) ? '0 ETH' : `${nextTotalCost.abs().toString()} ETH`
      this.setState({
        orderEthEstimate,
      })
    }

    if (nextShareCost + ' ETH' !== this.state.orderShareEstimate) {
      // const orderShareEstimate = nextProps.selectedOutcome.trade.shareCost.toString() + ' Shares'
      const orderShareEstimate = (isNaN(nextShareCost) || nextShareCost.abs().eq(0)) ? '0 Shares' : `${nextShareCost.abs().toString()} Shares`
      this.setState({
        orderShareEstimate,
      })
    }

    // Updates from chart clicks
    if (!isEqual(selectedOrderProperties, nextProps.selectedOrderProperties)) {
      this.setState({ ...nextProps.selectedOrderProperties })
    }
  }

  prevPage() {
    const newPage = this.state.currentPage <= 0 ? 0 : this.state.currentPage - 1
    this.setState({ currentPage: newPage })
  }

  nextPage() {
    const newPage = this.state.currentPage >= 1 ? 1 : this.state.currentPage + 1
    this.setState({ currentPage: newPage })
  }

  updateState(property, value) {
    this.setState({ [property]: value })
    this.props.updateSelectedOrderProperties({
      orderPrice: this.state.orderPrice,
      orderQuantity: this.state.orderQuantity,
      doNotCreateOrders: this.state.doNotCreateOrders,
      selectedNav: this.state.selectedNav,
      [property]: value,
    })
  }

  clearOrderForm() {
    const {
      clearTradeInProgress,
      market,
    } = this.props
    clearTradeInProgress(market.id)
    this.setState({
      orderPrice: '',
      orderQuantity: '',
      orderEthEstimate: '',
      orderShareEstimate: '',
      marketOrderTotal: '',
      marketQuantity: '',
      currentPage: 0,
      doNotCreateOrders: false,
    })
  }

  updateOrderEthEstimate(orderEthEstimate) {
    this.setState({
      orderEthEstimate,
    })
  }

  updateOrderShareEstimate(orderShareEstimate) {
    this.setState({
      orderShareEstimate,
    })
  }

  render() {
    const {
      availableFunds,
      initialMessage,
      isLogged,
      isMobile,
      market,
      selectedOutcome,
      showOrderPlaced,
      toggleForm,
    } = this.props
    const s = this.state

    const lastPrice = getValue(this.props, 'selectedOutcome.lastPrice.formatted')

    return (
      <section className={Styles.TradingWrapper}>
        { isMobile &&
          <div className={Styles['TradingWrapper__mobile-header']}>
            <button
              className={Styles['TradingWrapper__mobile-header-close']}
              onClick={toggleForm}
            >{ Close }
            </button>
            <span className={Styles['TradingWrapper__mobile-header-outcome']}>{ selectedOutcome.name }</span>
            <span className={Styles['TradingWrapper__mobile-header-last']}><ValueDenomination formatted={lastPrice} /></span>
          </div>
        }
        { s.currentPage === 0 &&
          <div>
            <ul className={Styles.TradingWrapper__header}>
              <li className={classNames({ [`${Styles.active}`]: s.selectedNav === BUY })}>
                <button onClick={() => this.setState({ selectedNav: BUY })}>Buy</button>
              </li>
              <li className={classNames({ [`${Styles.active}`]: s.selectedNav === SELL })}>
                <button onClick={() => this.setState({ selectedNav: SELL })}>Sell</button>
              </li>
            </ul>
            { initialMessage &&
              <p className={Styles['TradingWrapper__initial-message']}>{ initialMessage }</p>
            }
            { initialMessage && isLogged && availableFunds && availableFunds.lte(0) &&
              <Link className={Styles['TradingWrapper__button--add-funds']} to={makePath(ACCOUNT_DEPOSIT)}>Add Funds</Link>
            }
            { !initialMessage &&
              <MarketTradingForm
                market={market}
                marketType={getValue(this.props, 'market.marketType')}
                maxPrice={getValue(this.props, 'market.maxPrice')}
                minPrice={getValue(this.props, 'market.minPrice')}
                availableFunds={availableFunds}
                selectedNav={s.selectedNav}
                orderType={s.orderType}
                orderPrice={s.orderPrice}
                orderQuantity={s.orderQuantity}
                orderEthEstimate={s.orderEthEstimate}
                orderShareEstimate={s.orderShareEstimate}
                marketOrderTotal={s.marketOrderTotal}
                marketQuantity={s.marketQuantity}
                doNotCreateOrders={s.doNotCreateOrders}
                selectedOutcome={selectedOutcome}
                nextPage={this.nextPage}
                updateState={this.updateState}
                isMobile={isMobile}
              />
            }
          </div>
        }
        { s.currentPage === 1 && selectedOutcome &&
          <MarketTradingConfirm
            market={market}
            selectedNav={s.selectedNav}
            orderType={s.orderType}
            orderPrice={s.orderPrice}
            orderQuantity={s.orderQuantity}
            orderEthEstimate={s.orderEthEstimate}
            marketOrderTotal={s.marketOrderTotal}
            marketQuantity={s.marketQuantity}
            doNotCreateOrders={s.doNotCreateOrders}
            selectedOutcome={selectedOutcome}
            prevPage={this.prevPage}
            trade={selectedOutcome.trade}
            isMobile={isMobile}
            clearOrderForm={this.clearOrderForm}
            showOrderPlaced={showOrderPlaced}
          />
        }
      </section>
    )
  }
}

export default MarketTradingWrapper
