import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

import { AutoRow, RowFlat } from '../components/Row'
import { AutoColumn } from '../components/Column'
import MarketList from '../components/MarketList'
import Search from '../components/Search'
import GlobalStats from '../components/GlobalStats'
import { Text } from 'rebass'
import { useMedia } from 'react-use'
import Panel from '../components/Panel'
import { useMarketsByAMM, useMarketCashAddresses } from '../contexts/Markets'
import { RowBetween } from '../components/Row'
import { PageWrapper, ContentWrapper } from '../components'
import TokenLogo from '../components/TokenLogo'

const ClickableText = styled(Text)`
  text-align: end;
  &:hover {
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
    opacity: ${({ disabled }) => (disabled ? '1' : '0.6')};
  }
  user-select: none;
  color: ${({ theme }) => theme.text1};

  @media screen and (max-width: 640px) {
    font-size: 0.85rem;
  }
`

const ListOptions = styled(AutoRow)`
  height: 40px;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;

  @media screen and (max-width: 640px) {
    font-size: 1rem;
  }
`

function GlobalPage() {
  // get data for lists and totals
  const markets = useMarketsByAMM()
  const cashes = useMarketCashAddresses()

  // breakpoints
  const below800 = useMedia('(max-width: 800px)')
  const [cashFilter, setCashFilter] = useState(null)
  const [filteredMarkets, setFilteredMarkets] = useState(markets)
  // scrolling refs

  const updateCashFilter = cash => {
    setCashFilter(cash)
    if (!cash) {
      return setFilteredMarkets(markets)
    }
    const newMarkets = markets.filter(m => m.cash === cash) || []
    setFilteredMarkets(newMarkets)
  }

  useEffect(() => {
    setFilteredMarkets(markets)
  },[markets.length])

  useEffect(() => {
    document.querySelector('body').scrollTo({
      behavior: 'smooth',
      top: 0
    })
  }, [])

  return (
    <PageWrapper>
      <ContentWrapper>
        <div>
          <AutoColumn gap="24px" style={{ paddingBottom: below800 ? '0' : '24px' }}>
            <Search />
            <GlobalStats />
          </AutoColumn>
          <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
            <RowBetween>
              <ClickableText
                style={{ opacity: cashFilter === null ? '1' : '0.4' }}
                fontSize={'1.125rem'}
                onClick={() => updateCashFilter(null)}
              >
                All Markets
              </ClickableText>
              <RowFlat>
                {cashes &&
                  cashes.map(cash => (
                    <ClickableText disabled={cash === cashFilter} key={cash} onClick={() => updateCashFilter(cash)}>
                      <TokenLogo
                        tokenInfo={cash}
                        size={'20px'}
                        showSymbol
                        style={{ paddingRight: '1rem', opacity: cash === cashFilter ? '1' : '0.4' }}
                      />
                    </ClickableText>
                  ))}
              </RowFlat>
            </RowBetween>
          </ListOptions>

          <Panel style={{ marginTop: '6px', padding: '1.125rem 0 ' }}>
            <MarketList markets={filteredMarkets || []} />
          </Panel>
        </div>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default withRouter(GlobalPage)
