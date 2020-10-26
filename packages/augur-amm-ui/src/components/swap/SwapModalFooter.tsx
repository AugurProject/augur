import { JSBI } from '@uniswap/sdk'
import React, { useContext, useMemo, useState } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { TradeInfo } from '../../hooks/Trades'
import { TYPE } from '../../Theme'
import { formattedNum } from '../../utils'
import { computePriceImpact, formatExecutionPrice, warningSeverity } from '../../utils/prices'
import { ButtonError } from '../ButtonStyled'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'
import { BigNumber as BN } from 'bignumber.js'

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
  minAmount
}: {
  trade: TradeInfo
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
  minAmount: string
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const theme = useContext(ThemeContext)
  const { priceImpactWithoutFee, slippageAdjustedAmounts } = useMemo(() => computePriceImpact(trade, minAmount), [
    trade,
    minAmount
  ])
  const severity = warningSeverity(priceImpactWithoutFee)
  const [priceRate, setPriceRate] = useState(null)

  useMemo(() => {
    if (!minAmount) return setPriceRate(null)
    const receivedAmountDisplay = new BN(String(trade.inputAmount.raw)).div(new BN(minAmount))
    const InPerOut = receivedAmountDisplay
    const OutPerIn = new BN(minAmount).div(new BN(String(trade.inputAmount.raw)))
    const label = showInverted
      ? `${formattedNum(InPerOut.toFixed(6))} ${trade.currencyOut.symbol} per ${trade.currencyIn.symbol}`
      : `${formattedNum(OutPerIn.toFixed(6))} ${trade.currencyIn.symbol} per ${trade.currencyOut.symbol}`
    setPriceRate({ label })
  }, [trade, minAmount, showInverted])

  return (
    <>
      <AutoColumn gap="0px">
        <RowBetween align="center">
          <Text fontWeight={400} fontSize={14} color={theme.text2}>
            Price
          </Text>
          <Text
            fontWeight={500}
            fontSize={14}
            color={theme.text1}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px'
            }}
          >
            {priceRate ? (
              <>
                {priceRate.label}
                <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
                  <Repeat size={14} />
                </StyledBalanceMaxMini>
              </>
            ) : (
              ''
            )}
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              {'Minimum received'}
            </TYPE.black>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed>
            <TYPE.black fontSize={14}>{slippageAdjustedAmounts ?? '-'}</TYPE.black>
            <TYPE.black fontSize={14} marginLeft={'4px'}>
              {trade?.currencyOut?.symbol}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black color={theme.text2} fontSize={14} fontWeight={400}>
              Price Impact
            </TYPE.black>
            <QuestionHelper text="The difference between the market price and your price due to trade size." />
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
          <TYPE.black fontSize={14}>
            {realizedLPFee ? realizedLPFee?.toSignificant(6) + ' ' + trade.inputAmount.currency.symbol : '-'}
          </TYPE.black>
        </RowBetween>*/}
      </AutoColumn>

      <AutoRow>
        <ButtonError
          onClick={onConfirm}
          disabled={disabledConfirm}
          error={severity > 2}
          style={{ margin: '10px 0 0 0' }}
          id="confirm-swap-or-send"
        >
          <Text fontSize={20} fontWeight={500}>
            {severity > 2 ? 'Swap Anyway' : 'Confirm Swap'}
          </Text>
        </ButtonError>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
