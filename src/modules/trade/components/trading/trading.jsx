import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import MarketTradingWrapper from 'modules/trade/components/trading--wrapper/trading--wrapper'
import { Check, Close } from 'modules/common/components/icons'
import { isEqual } from 'lodash'
import makePath from 'modules/routes/helpers/make-path'

import { BigNumber } from 'utils/create-big-number'

import { ACCOUNT_DEPOSIT } from 'modules/routes/constants/views'

import Styles from 'modules/trade/components/trading/trading.styles'

class MarketTrading extends Component {
  static propTypes = {
    availableFunds: PropTypes.instanceOf(BigNumber).isRequired,
    clearTradeInProgress: PropTypes.func,
    isLogged: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    market: PropTypes.object.isRequired,
    selectedOrderProperties: PropTypes.object.isRequired,
    selectedOutcome: PropTypes.string,
    updateSelectedOrderProperties: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      showForm: false,
      showOrderPlaced: false,
      selectedOutcome: props.selectedOutcome !== null && props.market.outcomes ? props.market.outcomes.find(outcome => outcome.id === props.selectedOutcome) : null,
    }

    this.toggleForm = this.toggleForm.bind(this)
    this.toggleShowOrderPlaced = this.toggleShowOrderPlaced.bind(this)
    this.showOrderPlaced = this.showOrderPlaced.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const {
      market,
      selectedOutcome,
    } = this.props
    if (
      (
        !isEqual(selectedOutcome, nextProps.selectedOutcome) ||
        !isEqual(market.outcomes, nextProps.market.outcomes)
      ) &&
      (nextProps.market && nextProps.market.outcomes)
    ) {
      if (nextProps.selectedOutcome !== null) {
        this.setState({
          selectedOutcome: nextProps.market.outcomes.find(outcome => outcome.id === nextProps.selectedOutcome),
        })
      } else {
        this.setState({ selectedOutcome: null })
      }
    }
  }

  toggleForm() {
    this.setState({ showForm: !this.state.showForm })
  }

  toggleShowOrderPlaced() {
    this.setState({ showOrderPlaced: !this.state.showOrderPlaced })
  }

  showOrderPlaced() {
    this.setState({ showOrderPlaced: true })
    // automatically close the order placed ribbon after 3 seconds.
    setTimeout(() => this.setState({ showOrderPlaced: false }), 3000)
  }

  render() {
    const {
      availableFunds,
      clearTradeInProgress,
      isLogged,
      isMobile,
      market,
      selectedOrderProperties,
    } = this.props
    const s = this.state

    const hasFunds = availableFunds && availableFunds.gt(0)
    const hasSelectedOutcome = s.selectedOutcome !== null

    let initialMessage = ''

    switch (true) {
      case !isLogged:
        initialMessage = 'Log in to trade.'
        break
      case isLogged && !hasFunds:
        initialMessage = 'Add funds to begin trading.'
        break
      case isLogged && hasFunds && !hasSelectedOutcome:
        initialMessage = 'Select an outcome to begin placing an order.'
        break
      default:
        initialMessage = false
    }

    return (
      <section className={Styles.Trading}>
        { (!isMobile || s.showForm) &&
          <MarketTradingWrapper
            market={market}
            isLogged={isLogged}
            selectedOutcome={s.selectedOutcome}
            selectedOrderProperties={selectedOrderProperties}
            initialMessage={initialMessage}
            isMobile={isMobile}
            toggleForm={this.toggleForm}
            showOrderPlaced={this.showOrderPlaced}
            availableFunds={availableFunds}
            clearTradeInProgress={clearTradeInProgress}
            updateSelectedOrderProperties={this.props.updateSelectedOrderProperties}
          />
        }
        { isMobile && hasSelectedOutcome && initialMessage &&
          <div className={Styles['Trading__initial-message']}>
            <p>{ initialMessage }</p>
            {!hasFunds &&
              <Link
                to={makePath(ACCOUNT_DEPOSIT)}
              >
                <span className={Styles['Trading__deposit-button']}>Add Funds</span>
              </Link>
            }
          </div>
        }
        { isMobile && hasSelectedOutcome && !initialMessage && !s.showForm && // this needs to be changed to use p.selectedOutcome (should only show on mobile when an outcome has been selected)
          <div className={Styles['Trading__button--trade']}>
            <button onClick={this.toggleForm}>Trade</button>
          </div>
        }
        { s.showOrderPlaced &&
          <div className={Styles['Trading__button--order-placed']}>
            <span>{ Check } Order placed!</span>
            <button onClick={e => this.toggleShowOrderPlaced()}>{ Close }</button>
          </div>
        }
      </section>
    )
  }
}

export default MarketTrading
