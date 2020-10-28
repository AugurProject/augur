import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { RowFixed, RowBetween } from '../Row'
import { useMedia } from 'react-use'
import { useGlobalData, useEthPrice } from '../../contexts/GlobalData'
import { calculateLiquidity, formattedNum, localNumber } from '../../utils'
import { useCashTokens } from '../../state/wallet/hooks'
import UniPrice from '../UniPrice'
import { TYPE } from '../../Theme'
import { useTotalLiquidity } from '../../contexts/Markets'
import { useTokenDayPriceData } from '../../contexts/TokenData'
import { BigNumber as BN } from 'bignumber.js'

const Header = styled.div`
  width: 100%;
  position: sticky;
  top: 0;
`
/*
const Medium = styled.span`
  font-weight: 500;
`
*/
export default function GlobalStats() {
  //  const below1295 = useMedia('(max-width: 1295px)')
  //  const below1180 = useMedia('(max-width: 1180px)')
  //  const below1024 = useMedia('(max-width: 1024px)')
  //  const below400 = useMedia('(max-width: 400px)')
  const below816 = useMedia('(max-width: 816px)')

  const [showPriceCard] = useState(false)
  const [globalLiquidity, setGlobalLiquidity] = useState("0")
  const [cashTokens, loading] = useCashTokens()
  const cashData = useTokenDayPriceData()
  const { oneDayVolumeUSD, oneDayTxns } = useGlobalData()
  const [ethPrice] = useEthPrice()
  const formattedEthPrice = ethPrice ? formattedNum(ethPrice, true) : '-'
  const liquidities = useTotalLiquidity()

  useEffect(() => {
    if (!loading) {
      const total = Object.keys(liquidities).reduce((p, cash) => {
        return p.plus(new BN(calculateLiquidity(Number(cashTokens[cash]?.decimals), String(liquidities[cash]), String(cashData[cash]?.priceUSD))))
      }, new BN(0))

      const liq = formattedNum(String(total), true);
      setGlobalLiquidity(String(liq))
    }
  }, [loading, liquidities, cashData, cashTokens, setGlobalLiquidity])

  return (
    <Header>
      <RowBetween>
        <RowFixed
          style={
            below816 ? { flexFlow: 'column', alignItems: 'stretch', justifyContent: 'flex-start' } : { flexFlow: 'row' }
          }
        >
          <TYPE.boxed mb={'0.5rem'} mr={'0.25rem'}>
            <TYPE.boxedRow>
              <span>ETH price: </span>
            </TYPE.boxedRow>
            <TYPE.boxedRow>
              <TYPE.largeHeader>{formattedEthPrice}</TYPE.largeHeader>
              {showPriceCard && <UniPrice />}
            </TYPE.boxedRow>
          </TYPE.boxed>
          <TYPE.boxed mb={'0.5rem'} mr={'0.25rem'}>
            <TYPE.boxedRow>Total Liquidity</TYPE.boxedRow>
            <TYPE.boxedRow>
              <TYPE.largeHeader>{loading ? '-' : globalLiquidity}</TYPE.largeHeader>
            </TYPE.boxedRow>
          </TYPE.boxed>
          <TYPE.boxed mb={'0.5rem'} mr={'0.25rem'}>
            <TYPE.boxedRow>Volume (24 hrs): </TYPE.boxedRow>
            <TYPE.boxedRow>
              <TYPE.largeHeader>${localNumber(oneDayVolumeUSD)}</TYPE.largeHeader>
            </TYPE.boxedRow>
          </TYPE.boxed>
          <TYPE.boxed mb={'0.5rem'}>
            <TYPE.boxedRow>Transactions (24 hrs):</TYPE.boxedRow>
            <TYPE.boxedRow>
              <TYPE.largeHeader>{oneDayTxns}</TYPE.largeHeader>
            </TYPE.boxedRow>
          </TYPE.boxed>
        </RowFixed>
      </RowBetween>
    </Header>
  )
}
