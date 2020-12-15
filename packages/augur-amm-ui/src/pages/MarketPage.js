import React, { useState } from 'react'
import 'feather-icons'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import Panel from '../components/Panel'
import TokenLogo from '../components/TokenLogo'
import AmmExchangeList from '../components/AmmExchangeList'
import Loader from '../components/LocalLoader'
import { RowBetween, RowFixed, RowStart, AutoRow } from '../components/Row'
import { AutoColumn } from '../components/Column'
import TxnList from '../components/TxnList'
import { formattedNum, formattedPercent, localNumber, calculateLiquidity, calculateTotalVolume } from '../utils'
import { useTokenData, useTokenDayPriceData } from '../contexts/TokenData'
import { TYPE, StyledInternalLink } from '../Theme'
import { useColor } from '../hooks'
import { useMedia } from 'react-use'
import { useEffect } from 'react'
import { ContentWrapper } from '../components'
import FormattedName from '../components/FormattedName'
import {
  useMarketNonExistingAmms,
  useMarketAmmExchanges,
  useMarketCashTokens,
  useMarketVolumeByCash,
  useMarketDataRefresher,
  useAmmMarketTransactions
} from '../contexts/Markets'
import { ButtonOutlined } from '../components/ButtonStyled'
import PairChart from '../components/PairChart'
import { BigNumber as BN } from 'bignumber.js'
import { useBlockNumber } from '../state/application/hooks'

const DashboardWrapper = styled.div`
  width: 100%;
`

const PanelWrapper = styled.div`
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: max-content;
  gap: 6px;
  display: inline-grid;
  width: 100%;
  align-items: start;
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      grid-column: 1 / 4;
    }

    > * {
      &:first-child {
        width: 100%;
      }
    }
  }
`

const WarningGrouping = styled.div`
  opacity: ${({ disabled }) => disabled && '0.4'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
`

function MarketPage({ marketId }) {
  const { id, name, symbol, priceUSD, priceChangeUSD } = useTokenData(marketId)
  const cashes = useMarketNonExistingAmms(marketId)
  const [totalLiquidity, setTotalLiquidity] = useState('0')
  const cashTokens = useMarketCashTokens()
  const cashData = useTokenDayPriceData()
  const allExchanges = useMarketAmmExchanges(marketId)
  const volumes = useMarketVolumeByCash(marketId)
  const ammTransactions = useAmmMarketTransactions(marketId)
  const [oneDayTxns, setOneDayTxns] = useState(0)

  useEffect(() => {
    document.querySelector('body').scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (allExchanges && allExchanges.length > 0) {
      const total = (allExchanges || []).reduce((p, e) => {
        const cash = cashData[e?.cash?.address]
        const liq = calculateLiquidity(Number(cash?.decimals), String(e?.liquidity), String(cash?.priceUSD))
        return p.plus(liq)
      }, new BN(0))
      setTotalLiquidity(formattedNum(String(total), true))
    }
  }, [allExchanges?.length, cashData])

  const { updateIsDataClean } = useMarketDataRefresher()
  const latestBlock = useBlockNumber()
  useEffect(() => {
    updateIsDataClean(false)
  }, [latestBlock])


  useEffect(() => {
    const { totalDiff: tx } = ammTransactions;
    setOneDayTxns(tx)
  }, [ammTransactions ])

  // detect color from token
  const backgroundColor = useColor(id, symbol)

  // price
  const price = priceUSD ? formattedNum(priceUSD, true) : ''
  const priceChange = priceChangeUSD ? formattedPercent(priceChangeUSD) : ''

  const [volume, setVolume] = useState('-')

  useEffect(() => {
    let displayVolume = calculateTotalVolume(cashData, volumes)
    setVolume(displayVolume)
  }, [cashData, volumes])

  const below1080 = useMedia('(max-width: 1080px)')
  const below800 = useMedia('(max-width: 800px)')
  //const below600 = useMedia('(max-width: 600px)')

  // format for long symbol
  const LENGTH = below1080 ? 10 : 16
  const formattedSymbol = symbol?.length > LENGTH ? symbol.slice(0, LENGTH) + '...' : symbol

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0
    })
  }, [])

  return (
    <ContentWrapper>
      <WarningGrouping>
        <DashboardWrapper style={{ marginTop: below1080 ? '0' : '1rem' }}>
          <RowBetween style={{ flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'flex-start' }}>
            <RowFixed style={{ flexWrap: 'wrap' }}>
              <RowFixed style={{ flexFlow: 'row nowrap', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                <TYPE.main fontSize={below1080 ? '1.5rem' : '2rem'} fontWeight={500} style={{ margin: '0 1rem' }}>
                  <RowFixed gap="6px">
                    <FormattedName
                      text={name ? name + ' ' : ''}
                      maxCharacters={below800 ? 120 : 220}
                      style={{ marginRight: '6px', fontSize: '32px' }}
                    />
                    {formattedSymbol ? `(${formattedSymbol})` : ''}
                  </RowFixed>
                </TYPE.main>
                {!below1080 && (
                  <>
                    <TYPE.main fontSize={'1.5rem'} fontWeight={500} style={{ marginRight: '1rem' }}>
                      {price}
                    </TYPE.main>
                    {priceChange}
                  </>
                )}
              </RowFixed>
              <RowStart>
                {cashes &&
                  cashes.map(cash => (
                    <StyledInternalLink style={{ margin: '1rem 1rem 0 0' }} key={cash} to={`/add/${marketId}/${cash}/undefined`}>
                      <ButtonOutlined textAlign="center" style={{ alignItems: 'flex-end', borderRadius: '3px' }}>
                        <TokenLogo tokenInfo={cash} size={'18px'} style={{ paddingRight: '0.25rem' }} />
                        Create Liquidity
                      </ButtonOutlined>
                    </StyledInternalLink>
                  ))}
              </RowStart>
            </RowFixed>
          </RowBetween>

          <>
            <PanelWrapper style={{ marginTop: below1080 ? '0' : '1rem' }}>
              <Panel>
                <AutoColumn gap="20px">
                  <RowBetween>
                    <TYPE.main>Total Liquidity</TYPE.main>
                    <div />
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {totalLiquidity}
                    </TYPE.main>
                  </RowBetween>
                </AutoColumn>
              </Panel>
              <Panel>
                <AutoColumn gap="20px">
                  <RowBetween>
                    <TYPE.main>Volume</TYPE.main>
                    <div />
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {formattedNum(volume, true)}
                    </TYPE.main>
                  </RowBetween>
                </AutoColumn>
              </Panel>

              <Panel>
                <AutoColumn gap="20px">
                  <RowBetween>
                    <TYPE.main>Transactions (24hrs)</TYPE.main>
                    <div />
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {oneDayTxns ? localNumber(oneDayTxns) : oneDayTxns === 0 ? 0 : '-'}
                    </TYPE.main>
                  </RowBetween>
                </AutoColumn>
              </Panel>
              <Panel style={{ gridColumn: below1080 ? '1' : '2/4', gridRow: below1080 ? '' : '1/4' }}>
                <PairChart
                  marketId={marketId}
                  amms={allExchanges}
                  color={backgroundColor}
                />
              </Panel>
            </PanelWrapper>
          </>

          <span>
            <TYPE.main fontSize={'1.125rem'} style={{ marginTop: '3rem' }}>
              AMM Exchanges
            </TYPE.main>
          </span>
          <Panel
            rounded
            style={{
              marginTop: '1.5rem',
              padding: '1.125rem 0 '
            }}
          >
            {marketId && allExchanges && allExchanges.length > 0 ? (
              <AmmExchangeList color={backgroundColor} marketId={marketId} allExchanges={allExchanges} />
            ) : (
              <AutoRow justify={'center'}>
                <TYPE.light>No Exchanges</TYPE.light>
              </AutoRow>
            )}
          </Panel>
          <RowBetween mt={40} mb={'1rem'}>
            <TYPE.main fontSize={'1.125rem'}>Transactions</TYPE.main> <div />
          </RowBetween>
          <Panel rounded>
            {allExchanges && allExchanges.length > 0 ? (
              <TxnList
                color={backgroundColor}
                allExchanges={allExchanges}
                cashData={cashData}
                cashTokens={cashTokens}
              />
            ) : (
              <Loader />
            )}
          </Panel>
        </DashboardWrapper>
      </WarningGrouping>
    </ContentWrapper>
  )
}

export default withRouter(MarketPage)
