import React from 'react'
import PropTypes from 'prop-types'
import { BUY_UP, BUY_DOWN, SELL_UP, SELL_DOWN, NONE } from 'modules/trade/constants/types'
import Styles from 'modules/market/components/common/outcome-trading-indicator/outcome-trading-indicator.style'

export default function OutcomeTradingIndicator({ tradingIndicator }) {
  const indicatorArray = {}
  indicatorArray[BUY_UP] = Styles.TradingIndicator_arrow_buy_up
  indicatorArray[BUY_DOWN] = Styles.TradingIndicator_arrow_buy_down
  indicatorArray[SELL_UP] = Styles.TradingIndicator_arrow_sell_up
  indicatorArray[SELL_DOWN] = Styles.TradingIndicator_arrow_sell_down
  indicatorArray[NONE] = ''

  const indicatorStyle = indicatorArray[tradingIndicator]

  return (
    <span
      className={indicatorStyle}
    />
  )
}

OutcomeTradingIndicator.propTypes = {
  tradingIndicator: PropTypes.string.isRequired,
}
