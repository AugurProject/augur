import React, { useMemo, useState } from 'react'
import { TokenAmount } from '@uniswap/sdk'
import { useContext } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { StyledBalanceMaxMini } from './styleds'
import { TradeInfo } from '../../hooks/Trades'
import { formatCurrencyAmount, formatCurrencyAmountDisplay, formattedNum } from '../../utils'
import BigNumber from 'bignumber.js'

interface TradePriceProps {
  trade?: TradeInfo
  estTokenAmount?: TokenAmount
}

export default function TradePrice({ trade, estTokenAmount }: TradePriceProps) {
  const theme = useContext(ThemeContext)

  const [priceRate, setPriceRate] = useState(null)
  const [showInverted, setShowInverted] = useState(false)

  useMemo(() => {
    if (!estTokenAmount) return setPriceRate(null)

    const displayInAmount = formatCurrencyAmount(trade.inputAmount);
    const displayEstimateAmount = formatCurrencyAmount(estTokenAmount);

    const OutPerIn = String(new BigNumber(String(displayInAmount)).div(new BigNumber(String(displayEstimateAmount))))
    const InPerOut = String(new BigNumber(String(displayEstimateAmount)).div(new BigNumber(String(displayInAmount))))

    const label = showInverted
      ? `${formattedNum(InPerOut)} ${trade.currencyOut.symbol} per ${trade.currencyIn.symbol}`
      : `${formattedNum(OutPerIn)} ${trade.currencyIn.symbol} per ${trade.currencyOut.symbol}`
    setPriceRate({ label })
  }, [trade, estTokenAmount, showInverted])

  return (
    <Text
      fontWeight={500}
      fontSize={14}
      color={theme.text2}
      style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}
    >
      {priceRate ? (
        <>
          {priceRate.label}
          <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
            <Repeat size={14} />
          </StyledBalanceMaxMini>
        </>
      ) : (
          '-'
        )}
    </Text>
  )
}
