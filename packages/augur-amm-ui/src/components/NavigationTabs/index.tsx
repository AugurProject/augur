import React from 'react'
import styled from 'styled-components'
import { Link as HistoryLink } from 'react-router-dom'

import { ArrowLeft } from 'react-feather'
import { RowBetween } from '../Row'
import QuestionHelper from '../QuestionHelper'
import { AmmExchangeInfo, AmmMarket } from '../../constants'
import { getDisplaySymbol } from '../../utils'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
  color: ${({ theme }) => theme.text1};
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`

export function SwapPoolTabs({ token, amm }: { token: string, amm: AmmMarket }) {
  const cash = getDisplaySymbol(amm?.cash?.name)
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to={`/market/${token}`}>
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>Swap</ActiveText>
        <QuestionHelper
          text={
            `Swap ${cash} for market shares or vice versa. This allows for enter and exit market positions.`
          }
        />
      </RowBetween>
    </Tabs>
  )
}

export function AddRemoveTabs({ adding, creating, token }: { adding: boolean; creating: boolean; token: string }) {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to={`/market/${token}`}>
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>{creating ? 'Add Initial Liquidity' : adding ? 'Add Liquidity' : 'Remove Liquidity'}</ActiveText>
        <QuestionHelper
          text={
            adding
              ? 'When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.'
              : 'Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.'
          }
        />
      </RowBetween>
    </Tabs>
  )
}
