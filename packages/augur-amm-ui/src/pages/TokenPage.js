import React, { useState } from 'react'
import 'feather-icons'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import Panel from '../components/Panel'
import TokenLogo from '../components/TokenLogo'
import PairList from '../components/PairList'
import Loader from '../components/LocalLoader'
import { RowBetween, RowFixed, RowStart } from '../components/Row'
import { AutoColumn } from '../components/Column'
import TxnList from '../components/TxnList'
import { formattedNum, formattedPercent, localNumber, calculateLiquidity } from '../utils'
import { useTokenData, useTokenDayPriceData } from '../contexts/TokenData'
import { TYPE, StyledInternalLink } from '../Theme'
import { useColor } from '../hooks'
import { useMedia } from 'react-use'
import { useEffect } from 'react'
import { PageWrapper, ContentWrapper } from '../components'
import FormattedName from '../components/FormattedName'
import { useMarketNonExistingAmms, useMarketAmmExchanges, useMarketCashTokens } from '../contexts/Markets'
import { ButtonOutlined } from '../components/ButtonStyled'
import { BigNumber as BN } from 'bignumber.js'

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

function TokenPage({ marketId }) {
  const {
    id,
    name,
    symbol,
    priceUSD,
    oneDayVolumeUSD,
    volumeChangeUSD,
    oneDayVolumeUT,
    volumeChangeUT,
    priceChangeUSD,
    oneDayTxns
  } = useTokenData(marketId)
  const cashes = useMarketNonExistingAmms(marketId)
  const [totalLiquidity, setTotalLiquidity] = useState('0')
  const cashTokens = useMarketCashTokens()
  const cashData = useTokenDayPriceData()
  const allExchanges = useMarketAmmExchanges(marketId)

  useEffect(() => {
    document.querySelector('body').scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (allExchanges && allExchanges.length > 0) {
      const total = (allExchanges || []).reduce((p, e) => {
        const cashToken = cashTokens?.[e.cash]
        const liq = calculateLiquidity(
          Number(cashToken?.decimals),
          String(e?.liquidity),
          String(cashData?.[e.cash]?.priceUSD)
        )
        return p.plus(liq)
      }, new BN(0))
      setTotalLiquidity(formattedNum(String(total), true))
    }
  }, [allExchanges, cashData, cashTokens, setTotalLiquidity])
  // detect color from token
  const backgroundColor = useColor(id, symbol)

  // price
  const price = priceUSD ? formattedNum(priceUSD, true) : ''
  const priceChange = priceChangeUSD ? formattedPercent(priceChangeUSD) : ''

  // volume
  const volume =
    oneDayVolumeUSD || oneDayVolumeUSD === 0
      ? formattedNum(oneDayVolumeUSD === 0 ? oneDayVolumeUT : oneDayVolumeUSD, true)
      : oneDayVolumeUSD === 0
      ? '$0'
      : '-'

  // mark if using untracked volume
  const [usingUtVolume, setUsingUtVolume] = useState(false)
  useEffect(() => {
    setUsingUtVolume(oneDayVolumeUSD === 0 ? true : false)
  }, [oneDayVolumeUSD])


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
    <PageWrapper>
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
                      <StyledInternalLink key={cash} to={`/add/${marketId}/${cash}/undefined`}>
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
                {below1080 && price && (
                  <Panel>
                    <AutoColumn gap="20px">
                      <RowBetween>
                        <TYPE.main>Price</TYPE.main>
                        <div />
                      </RowBetween>
                      <RowBetween align="flex-end">
                        {' '}
                        <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                          {price}
                        </TYPE.main>
                        <TYPE.main>{priceChange}</TYPE.main>
                      </RowBetween>
                    </AutoColumn>
                  </Panel>
                )}
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
                      <TYPE.main>Volume (24hrs) {usingUtVolume}</TYPE.main>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                        {volume}
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
              {marketId && allExchanges ? (
                <PairList color={backgroundColor} marketId={marketId} allExchanges={allExchanges} />
              ) : (
                <Loader />
              )}
            </Panel>
            <RowBetween mt={40} mb={'1rem'}>
              <TYPE.main fontSize={'1.125rem'}>Transactions</TYPE.main> <div />
            </RowBetween>
            <Panel rounded>
              {allExchanges && allExchanges.length > 0 ? (
                <TxnList color={backgroundColor} allExchanges={allExchanges} cashData={cashData} cashTokens={cashTokens} />
              ) : (
                <Loader />
              )}
            </Panel>
          </DashboardWrapper>
        </WarningGrouping>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default withRouter(TokenPage)
