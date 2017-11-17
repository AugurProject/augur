import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import BigNumber from 'bignumber.js'

import MarketTradingForm from 'modules/market/components/market-trading--form/market-trading--form'
import MarketTradingConfirm from 'modules/market/components/market-trading--confirm/market-trading--confirm'
import { Close } from 'modules/common/components/icons/icons'

import makePath from 'modules/routes/helpers/make-path'
import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'

import getValue from 'utils/get-value'

import { BUY, SELL, LIMIT } from 'modules/transactions/constants/types'
import { ACCOUNT_DEPOSIT } from 'modules/routes/constants/views'

import Styles from 'modules/market/components/market-trading--wrapper/market-trading--wrapper.styles'

class MarketTradingWrapper extends Component {
  static propTypes = {
    market: PropTypes.object.isRequired,
    isLogged: PropTypes.bool.isRequired,
    selectedOutcomes: PropTypes.array.isRequired,
    selectedOutcome: PropTypes.object.isRequired,
    initialMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    isMobile: PropTypes.bool.isRequired,
    toggleForm: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      errors: {
        quantity: [],
        price: []
      },
      isOrderValid: true,
      orderType: LIMIT,
      orderPrice: '',
      orderQuantity: '',
      orderEstimate: '',
      selectedNav: BUY,
      currentPage: 0,
    }

    this.prevPage = this.prevPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.updateState = this.updateState.bind(this)
    this.validateForm = this.validateForm.bind(this)
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.orderQuantity !== nextState.orderQuantity || this.state.orderPrice !== nextState.orderPrice) {
      let orderEstimate = ''
      if (nextState.orderQuantity instanceof BigNumber && nextState.orderPrice instanceof BigNumber) {
        orderEstimate = `${nextState.orderQuantity.times(nextState.orderPrice).toNumber()} ETH`
      }
      this.setState({ orderEstimate })
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
  }

  validateForm(property, rawValue) { // needs actual validation
    let value = rawValue

    if (!(value instanceof BigNumber) && value !== '') {
        value = new BigNumber(value)
    }

    this.setState({ [property]: value })
  }

  render() {
    const s = this.state
    const p = this.props

    const hasFunds = getValue(p, 'market.tradeSummary.hasUserEnoughFunds')
    const lastPrice = getValue(p, 'selectedOutcome.lastPrice.formatted')

    return (
      <section className={Styles.TradingWrapper}>
        { p.isMobile &&
          <div className={Styles['TradingWrapper__mobile-header']}>
            <button
              className={Styles['TradingWrapper__mobile-header-close']}
              onClick={p.toggleForm}
            >{ Close }</button>
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
            { p.initialMessage && p.isLogged && !hasFunds &&
              <Link className={Styles['TradingWrapper__button--add-funds']} to={makePath(ACCOUNT_DEPOSIT)}>Add Funds</Link>
            }
            { !p.initialMessage &&
              <MarketTradingForm
                market={p.market}
                selectedNav={s.selectedNav}
                orderType={s.orderType}
                orderPrice={s.orderPrice}
                orderQuantity={s.orderQuantity}
                orderEstimate={s.orderEstimate}
                isOrderValid={s.isOrderValid}
                selectedOutcome={p.selectedOutcome}
                nextPage={this.nextPage}
                updateState={this.updateState}
                validateForm={this.validateForm}
                isMobile={p.isMobile}
                errors={s.errors}
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
            selectedOutcome={p.selectedOutcome}
            prevPage={this.prevPage}
            trade={p.selectedOutcome.trade}
          />
        }
      </section>
    )
  }
}

export default MarketTradingWrapper
