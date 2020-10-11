import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
// import { Box } from 'rebass'
import styled from 'styled-components'

import { AutoRow } from '../components/Row'
import { AutoColumn } from '../components/Column'
import TopMarketList from '../components/MarketList'
import Search from '../components/Search'
import GlobalStats from '../components/GlobalStats'
import { Text } from 'rebass'
// import { useGlobalData } from '../contexts/GlobalData'
import { useMedia } from 'react-use'
import Panel from '../components/Panel'
import { useAllMarketData, useMarketCashes } from '../contexts/Markets'
// import { formattedNum, formattedPercent } from '../utils'
import { ThemedBackground, TYPE } from '../Theme'
import { transparentize } from 'polished'
import { RowBetween } from '../components/Row'
import { PageWrapper, ContentWrapper } from '../components'
import TokenLogo from '../components/TokenLogo'


function UserPoolsPage() {
  // get data for lists and totals
  const { markets } = useAllMarketData()
  const cashes = useMarketCashes()
  // const { totalLiquidityUSD, oneDayVolumeUSD, volumeChangeUSD, liquidityChangeUSD } = useGlobalData()

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
    const newMarkets = markets.reduce((p, m) => {
      if (!m.amms || m.amms.length === 0) return p
      if (m.amms.find(m => m.shareToken.cash.id === cash)) {
        return [...p, m]
      }
      return p
    }, [])
    setFilteredMarkets(newMarkets)
  }

  useEffect(() => {
    document.querySelector('body').scrollTo({
      behavior: 'smooth',
      top: 0
    })
  }, [])

  return (
    <PageWrapper>
      <ThemedBackground backgroundColor={transparentize(0.8, '#ff007a')} />
      <ContentWrapper>
        <div>
          <Panel style={{ marginTop: '6px', padding: '1.125rem 0 ' }}>
            <TopMarketList markets={filteredMarkets || []} />
          </Panel>
        </div>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default withRouter(UserPoolsPage)
