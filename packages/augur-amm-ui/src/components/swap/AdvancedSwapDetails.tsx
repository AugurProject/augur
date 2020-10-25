import { ETHER, JSBI, Percent, TokenAmount, Trade, TradeType } from '@uniswap/sdk'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { TradeInfo } from '../../hooks/Trades'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { TYPE } from '../../Theme'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { BigNumber as BN } from 'bignumber.js'
import { BIPS_BASE } from '../../constants'

export function TradeSummary({ trade, allowedSlippage, minAmount }: { trade: TradeInfo; allowedSlippage: number, minAmount: string }) {
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

  useEffect(() => {
    console.log('minAmount', minAmount, 'allowedSlippage', allowedSlippage)
    if (minAmount) {
      const calcPrice = new BN(minAmount).div(new BN(String(trade.inputAmount.raw)))
      // weird math to use Percent object
      const impact = (calcPrice.minus(new BN(trade.executionPrice.toSignificant(6)))).div(calcPrice).abs().times(100).toFixed(0)
      const adjMinAmount = String(new BN(minAmount).div(new BN(10).pow(new BN(trade.currencyOut.decimals))).toFixed(8))

      const breakdown = {
          priceImpactWithoutFee: new Percent(JSBI.BigInt(impact), BIPS_BASE),
          realizedLPFee: "0", // ignore this for now
          slippageAdjustedAmounts: {
            [Field.OUTPUT]: `${adjMinAmount}`,
            [Field.INPUT]: "0"
          }
        }
        setBreakdown(breakdown)
    }
  }, [trade, setBreakdown, allowedSlippage, minAmount])

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
}

export function AdvancedSwapDetails({ trade, minAmount }: AdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext)

  const [allowedSlippage] = useUserSlippageTolerance()

  return (
    <AutoColumn gap="md">
      {trade && minAmount && (
        <TradeSummary trade={trade} minAmount={minAmount} allowedSlippage={allowedSlippage} />
      )}
    </AutoColumn>
  )
}
