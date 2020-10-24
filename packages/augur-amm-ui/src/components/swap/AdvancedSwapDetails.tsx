import { JSBI, Percent, Trade, TradeType } from '@uniswap/sdk'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useAugurClient } from '../../contexts/Application'
import { TradeInfo } from '../../hooks/Trades'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { TYPE, ExternalLink } from '../../Theme'
import { estimateTrade } from '../../utils'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'

function TradeSummary({ trade, allowedSlippage }: { trade: TradeInfo; allowedSlippage: number }) {
  const theme = useContext(ThemeContext)
  const [breakdown, setBreakdown] = useState({
    priceImpactWithoutFee: new Percent(JSBI.BigInt(0)),
    realizedLPFee: "-",
    slippageAdjustedAmounts: {
      [Field.OUTPUT]: "-",
      [Field.INPUT]: "-"
    }
  })
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const augurClient = useAugurClient()

  useEffect(() => {
    const estimate = (augurClient, trade) => estimateTrade(augurClient, trade).then(result => {
      console.log('Trade Summary', result)

      const breakdown = {
        priceImpactWithoutFee: new Percent(JSBI.BigInt(0)),
        realizedLPFee: "0",
        slippageAdjustedAmounts: {
          [Field.OUTPUT]: "0",
          [Field.INPUT]: "0"
        }
      }
      setBreakdown(breakdown)
    })
    if (Boolean(trade)) {
      estimate(augurClient, trade)
    }
  }, [trade, augurClient, setBreakdown, allowedSlippage])

  return (
    <>
      <AutoColumn style={{ padding: '0 20px' }}>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              {isExactIn ? 'Minimum received' : 'Maximum sold'}
            </TYPE.black>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed>
            <TYPE.black color={theme.text1} fontSize={14}>
              {isExactIn
                ? breakdown.slippageAdjustedAmounts[Field.OUTPUT]
                : breakdown.slippageAdjustedAmounts[Field.INPUT]
              }
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              Price Impact
            </TYPE.black>
            <QuestionHelper text="The difference between the market price and estimated price due to trade size." />
          </RowFixed>
          <FormattedPriceImpact priceImpact={breakdown.priceImpactWithoutFee} />
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              Liquidity Provider Fee
            </TYPE.black>
            <QuestionHelper text="A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive." />
          </RowFixed>
          <TYPE.black fontSize={14} color={theme.text1}>
            {breakdown.realizedLPFee ? `${breakdown.realizedLPFee} ${trade.inputAmount.currency.symbol}` : '-'}
          </TYPE.black>
        </RowBetween>
      </AutoColumn>
    </>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: TradeInfo
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext)

  const [allowedSlippage] = useUserSlippageTolerance()

  return (
    <AutoColumn gap="md">
      {trade && (
        <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
      )}
    </AutoColumn>
  )
}
