import React from 'react'

import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'

import getValue from 'utils/get-value'

const OutcomeTradeSummary = (p) => {
  const tradingFees = getValue(p, 'tradeOrder.tradingFees')
  const feePercent = getValue(p, 'tradeOrder.feePercent')
  const gasFees = getValue(p, 'tradeOrder.gasFees')
  const potentialEthProfit = getValue(p, 'trade.potentialEthProfit')
  const potentialProfitPercent = getValue(p, 'trade.potentialProfitPercent')
  const potentialEthLoss = getValue(p, 'trade.potentialEthLoss')
  const potentialLossPercent = getValue(p, 'trade.potentialLossPercent')
  const totalCost = getValue(p, 'trade.totalCost')

  return (
    <article className="outcome-trade-summary">
      {potentialEthProfit && potentialProfitPercent &&
        <div className="outcome-trade-summary-group">
          <span>Potential Profit:</span>
          <span><ValueDenomination formatted={potentialEthProfit.formatted} /> <span>ETH ({potentialProfitPercent.formatted}%)</span></span>
        </div>
      }
      {potentialEthLoss && potentialLossPercent &&
        <div className="outcome-trade-summary-group">
          <span>Potential Loss:</span>
          <span><ValueDenomination formatted={potentialEthLoss.formatted} /> <span>ETH ({potentialLossPercent.formatted}%)</span></span>
        </div>
      }
      {tradingFees && feePercent &&
        <div className="outcome-trade-summary-group">
          <span>Fees:</span>
          <span><ValueDenomination formatted={tradingFees.formatted} /> <span>ETH ({feePercent.formatted}%)</span></span>
        </div>
      }
      {gasFees &&
        <div className="outcome-trade-summary-group">
          <span>Gas:</span>
          <span><ValueDenomination formatted={gasFees.formatted} /><span>ETH</span></span>
        </div>
      }
      {totalCost &&
        <div className="outcome-trade-summary-group">
          <span>Total:</span>
          <span><ValueDenomination formatted={totalCost.formatted} /><span>ETH</span></span>
        </div>
      }
    </article>
  )
}

export default OutcomeTradeSummary
