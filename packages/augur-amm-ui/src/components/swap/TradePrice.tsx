import React, { useMemo, useState } from 'react'
import { TokenAmount } from '@uniswap/sdk'
import { useContext } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { StyledBalanceMaxMini } from './styleds'
import { TradeInfo } from '../../hooks/Trades'
import { formatCurrencyAmountDisplay, formattedNum } from '../../utils'
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
    const receivedAmountDisplay = String(new BigNumber(String(trade.inputAmount.raw)).div(new BigNumber(String(estTokenAmount.raw))))
    const sendAmountDisplay = String(new BigNumber(String(estTokenAmount.raw)).div(new BigNumber(String(trade.inputAmount.raw))))
    const OutPerIn = formatCurrencyAmountDisplay(receivedAmountDisplay, trade.inputAmount)
    const InPerOut = formatCurrencyAmountDisplay(sendAmountDisplay, estTokenAmount)

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
