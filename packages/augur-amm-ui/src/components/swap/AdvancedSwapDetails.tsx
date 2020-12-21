import { TokenAmount } from '@uniswap/sdk'
import React, { useContext, useMemo } from 'react'
import { ThemeContext } from 'styled-components'
import { TradeInfo } from '../../hooks/Trades'
import { TYPE } from '../../Theme'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { computePriceImpact } from '../../utils/prices'

export function TradeSummary({ trade, minAmount, outputAmount }: { trade: TradeInfo; minAmount: string, outputAmount: TokenAmount }) {
  const theme = useContext(ThemeContext)

  const { priceImpactWithoutFee, slippageAdjustedAmounts } = useMemo(() => computePriceImpact(trade, minAmount, outputAmount), [
    trade,
    minAmount,
    outputAmount
  ])

  return (
    <>
      <AutoColumn style={{ padding: '0 20px' }}>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              {'Minimum received'}
            </TYPE.black>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed>
            <TYPE.black color={theme.text1} fontSize={14}>
              {slippageAdjustedAmounts}
            </TYPE.black>
            <TYPE.black fontSize={14} marginLeft={'4px'}>
              {trade?.currencyOut?.symbol}
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
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>

        {/*<RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              Liquidity Provider Fee
            </TYPE.black>
            <QuestionHelper text="A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive." />
          </RowFixed>
          <TYPE.black fontSize={14} color={theme.text1}>
            {breakdown.realizedLPFee ? `${breakdown.realizedLPFee} ${trade.inputAmount.currency.symbol}` : '-'}
          </TYPE.black>
        </RowBetween>*/}
      </AutoColumn>
    </>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: TradeInfo
  allowedSlippage?: number
  minAmount?: string
  outputAmount?: TokenAmount
}

export function AdvancedSwapDetails({ trade, minAmount, outputAmount }: AdvancedSwapDetailsProps) {

  return (
    <AutoColumn gap="md">
      {trade && minAmount && (
        <TradeSummary trade={trade} minAmount={minAmount} outputAmount={outputAmount} />
      )}
    </AutoColumn>
  )
}
