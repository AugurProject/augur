import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { BigNumber } from 'utils/wrapped-big-number'

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
  }

  constructor(props) {
    super(props)

    this.state = {
      orderType: LIMIT,
      orderPrice: '',
      orderQuantity: '',
      orderEstimate: '',
      marketOrderTotal: '',
      marketQuantity: '',
      selectedNav: BUY,
      currentPage: 0,
    }

    this.prevPage = this.prevPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.updateState = this.updateState.bind(this)
    this.clearOrderForm = this.clearOrderForm.bind(this)
    this.updateOrderEstimate = this.updateOrderEstimate.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.selectedOutcome || !nextProps.selectedOutcome.trade) return
    const nextTotalCost = new BigNumber(nextProps.selectedOutcome.trade.totalCost.value)
    if (`${nextTotalCost.abs().toString()} ETH` !== this.state.orderEstimate) {
      const orderEstimate = (isNaN(nextTotalCost) || nextTotalCost.abs().eq(0)) ? '' : `${nextTotalCost.abs().toString()} ETH`
      this.setState({
        orderEstimate,
      })
    }

    // Updates from chart clicks
    if (!isEqual(this.props.selectedOrderProperties, nextProps.selectedOrderProperties)) this.setState({ ...nextProps.selectedOrderProperties })
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
  }

  clearOrderForm() {
    this.props.clearTradeInProgress(this.props.market.id)
    this.setState({
      orderPrice: '',
      orderQuantity: '',
      orderEstimate: '',
      marketOrderTotal: '',
      marketQuantity: '',
      currentPage: 0,
    })
  }

  updateOrderEstimate(orderEstimate) {
    this.setState({
      orderEstimate,
    })
  }

  render() {
    const s = this.state
    const p = this.props

    const lastPrice = getValue(p, 'selectedOutcome.lastPrice.formatted')

    return (
      <section className={Styles.TradingWrapper}>
        { p.isMobile &&
          <div className={Styles['TradingWrapper__mobile-header']}>
            <button
              className={Styles['TradingWrapper__mobile-header-close']}
              onClick={p.toggleForm}
            >{ Close }
            </button>
            <span className={Styles['TradingWrapper__mobile-header-outcome']}>{ p.selectedOutcome.name }</span>
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
            { p.initialMessage &&
              <p className={Styles['TradingWrapper__initial-message']}>{ p.initialMessage }</p>
            }
            { p.initialMessage && p.isLogged && p.availableFunds && p.availableFunds.lte(0) &&
              <Link className={Styles['TradingWrapper__button--add-funds']} to={makePath(ACCOUNT_DEPOSIT)}>Add Funds</Link>
            }
            { !p.initialMessage &&
              <MarketTradingForm
                market={p.market}
                marketType={getValue(p, 'market.marketType')}
                maxPrice={getValue(p, 'market.maxPrice')}
                minPrice={getValue(p, 'market.minPrice')}
                availableFunds={p.availableFunds}
                selectedNav={s.selectedNav}
                orderType={s.orderType}
                orderPrice={s.orderPrice}
                orderQuantity={s.orderQuantity}
                orderEstimate={s.orderEstimate}
                marketOrderTotal={s.marketOrderTotal}
                marketQuantity={s.marketQuantity}
                selectedOutcome={p.selectedOutcome}
                nextPage={this.nextPage}
                updateState={this.updateState}
                isMobile={p.isMobile}
              />
            }
          </div>
        }
        { s.currentPage === 1 &&
          <MarketTradingConfirm
            market={p.market}
            selectedNav={s.selectedNav}
            orderType={s.orderType}
            orderPrice={s.orderPrice}
            orderQuantity={s.orderQuantity}
            orderEstimate={s.orderEstimate}
            marketOrderTotal={s.marketOrderTotal}
            marketQuantity={s.marketQuantity}
            selectedOutcome={p.selectedOutcome}
            prevPage={this.prevPage}
            trade={p.selectedOutcome.trade}
            isMobile={p.isMobile}
            clearOrderForm={this.clearOrderForm}
            showOrderPlaced={p.showOrderPlaced}
          />
        }
      </section>
    )
  }
}

export default MarketTradingWrapper
