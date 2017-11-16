import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import BigNumber from 'bignumber.js'

import MarketTradingWrapper from 'modules/market/components/market-trading--wrapper/market-trading--wrapper'

import makePath from 'modules/routes/helpers/make-path'

import getValue from 'utils/get-value'

import { BUY, SELL, MARKET, LIMIT } from 'modules/transactions/constants/types'
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { ACCOUNT_DEPOSIT } from 'modules/routes/constants/views'

import FormStyles from 'modules/common/less/form'
import Styles from 'modules/market/components/market-trading/market-trading.styles'

class MarketTrading extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showForm: false,
    }
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <section className={Styles.Trading}>
        { (!p.isMobile || (p.isMobile && s.showForm)) &&
          <MarketTradingWrapper
            market={p.market}
            isLogged={p.isLogged}
            selectedOutcomes={p.selectedOutcomes}
            selectedOutcome={p.selectedOutcome}
          />
        }
        { p.isMobile && p.selectedOutcomes.length > 0 && // this needs to be changed to use p.selectedOutcome (should only show on mobile when an outcome has been selected)
          <button
            className={Styles['Trading__button--trade']}
            onClick={e => this.setState({ showForm: true })}
          >Trade</button>
        }
      </section>
    )
  }
}

export default MarketTrading
