import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { Box, Flex, Text } from 'rebass'
import { Divider } from '..'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import { formatTime, formattedNum, calculateLiquidity } from '../../utils'
import { useMedia } from 'react-use'
import { withRouter } from 'react-router-dom'
import { TYPE } from '../../Theme'
import { BasicLink } from '../Link'
import TokenLogo from '../TokenLogo'
import { useTokenDayPriceData } from '../../contexts/TokenData'
import { useCashTokens } from '../../state/wallet/hooks'

dayjs.extend(utc)

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 2em;
`

const Arrow = styled.div<{ faded: boolean }>`
  color: ${({ theme }) => theme.primary1};
  opacity: ${faded => (faded ? 0.3 : 1)};
  padding: 0 20px;
  user-select: none;
  :hover {
    cursor: pointer;
  }
`

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 0.5em;
  grid-template-columns: 0.5fr 50% 1fr 0.5fr 0.5fr 1fr 1fr;
  grid-template-areas: 'logo description liquidity noPercent yesPercent status timestamp';
  padding: 0 1.125rem;

  > * {
    justify-content: flex-end;

    &:first-child {
      justify-content: flex-start;
      text-align: left;
      width: 100px;
    }
  }

  @media screen and (min-width: 1080px) {
    display: grid;
    grid-gap: 0.5em;
    grid-template-columns: 0.5fr 5fr 1fr 0.5fr 0.5fr 1fr 1fr;
    grid-template-areas: 'logo description liquidity noPercent yesPercent status timestamp';
  }

  @media screen and (max-width: 816px) {
    display: grid;
    grid-gap: 0.5em;
    grid-template-columns: 0.25fr 50% 1fr 1fr;
    grid-template-areas: 'currency description noPercent yesPercent';
  }

  @media screen and (max-width: 680px) {
    display: grid;
    grid-gap: 0.5em;
    grid-template-columns: 80% 1fr 1fr;
    grid-template-areas: 'description noPercent yesPercent';
  }
`

const ListWrapper = styled.div``

const ClickableText = styled(Text)`
  text-align: end;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  user-select: none;
  color: ${({ theme }) => theme.text1};

  @media screen and (max-width: 640px) {
    font-size: 0.85rem;
  }
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.text1};

  & > * {
    font-size: 14px;
  }

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`

const SORT_FIELD = {
  LIQ: 'totalLiquidityUSD',
  VOL: 'oneDayVolumeUSD',
  SYMBOL: 'symbol',
  NAME: 'name',
  PRICE: 'priceUSD',
  CHANGE: 'priceChangeUSD',
  DESCRIPTION: 'description',
  STATUS: 'status',
  ENDTIMESTAMP: 'endTimestamp'
}

function MarketList({ markets, itemMax = 10 }) {
  // page state
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [darkMode] = useDarkModeManager()

  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.STATUS)

  const below680 = useMedia('(max-width: 680px)')
  const below800 = useMedia('(max-width: 816px)')

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [])

  useEffect(() => {
    if (markets) {
      let extraPages = 1
      if (markets.length % itemMax === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(markets.length / itemMax) + extraPages)
    }
  }, [markets, itemMax])

  const filteredList = useMemo(() => {
    return markets
      .sort((a, b) => {
        if (sortedColumn === SORT_FIELD.SYMBOL || sortedColumn === SORT_FIELD.NAME) {
          return a[sortedColumn] > b[sortedColumn] ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
        }
        return parseFloat(a[sortedColumn]) > parseFloat(b[sortedColumn])
          ? (sortDirection ? -1 : 1) * 1
          : (sortDirection ? -1 : 1) * -1
      })
      .slice(itemMax * (page - 1), page * itemMax)
  }, [markets, itemMax, page, sortDirection, sortedColumn])

  const ListItem = ({ marketData, index }) => {
    const ammExchange = marketData?.amm
    const [cashTokens, loading] = useCashTokens()
    const cashData = useTokenDayPriceData()
    let liquidityUSD = '-'
    if (ammExchange?.liquidity && cashTokens && cashData?.[marketData?.cash] && cashData?.[marketData?.cash]?.priceUSD) {
      const cashToken = cashTokens[marketData.cash]
      const displayUsd = calculateLiquidity(
        Number(cashToken?.decimals),
        String(ammExchange?.liquidity),
        String(cashData[marketData?.cash]?.priceUSD)
      )
      liquidityUSD = String(formattedNum(String(displayUsd), true))
    }

    return (
      <DashGrid style={{ height: '48px', alignContent: 'center' }} >
        {!below680 && <TokenLogo tokenInfo={marketData?.cash} />}
        <DataText style={{ justifyContent: 'flex-start', alignItems: 'center', textAlign: 'left' }}>
          <BasicLink style={{ width: '100%', fontWeight: '400' }} to={'/token/' + marketData?.id} key={marketData?.id}>
            {marketData.description}
          </BasicLink>
        </DataText>
        {!below680 && <DataText area="liquidity">{liquidityUSD}</DataText>}
        <DataText area="noPercent">{marketData.amm ? Number(marketData.amm.percentageNo).toFixed(2) : '-'}</DataText>
        <DataText area="yesPercent">{marketData.amm ? Number(marketData.amm.percentageYes).toFixed(2) : '-'}</DataText>
        {!below800 && (
          <DataText area="status">
            <span
              style={
                !darkMode
                  ? {}
                  : marketData.status === 'TRADING'
                  ? { color: '#7DFFA8' }
                  : marketData.status === 'DISPUTING'
                  ? { color: '#F1E700' }
                  : marketData.status === 'REPORTING'
                  ? { color: '#F1E700' }
                  : marketData.status === 'FINALIZED'
                  ? { color: '#F12B00' }
                  : {}
              }
            >
              {marketData.status}
            </span>
          </DataText>
        )}
        {!below800 && <DataText area="timestamp">{formatTime(marketData.endTimestamp)}</DataText>}
      </DashGrid>
    )
  }

  return (
    <ListWrapper>
      <DashGrid style={{ height: 'fit-content', padding: '0 1.125rem 1rem 1.125rem' }}>
        {!below680 && (
          <Flex alignItems="center">
            <Text area="Currency">Currency</Text>
          </Flex>
        )}
        <Flex alignItems="center" justifyContent="flex-start">
          <ClickableText
            color="text"
            area="name"
            fontWeight="500"
            onClick={e => {
              setSortedColumn(SORT_FIELD.DESCRIPTION)
              setSortDirection(sortedColumn !== SORT_FIELD.DESCRIPTION ? true : !sortDirection)
            }}
          >
            {below680 ? 'Symbol' : 'Description'}{' '}
            {sortedColumn === SORT_FIELD.DESCRIPTION ? (!sortDirection ? '↑' : '↓') : ''}
          </ClickableText>
        </Flex>
        {!below680 && (
          <Flex alignItems="center">
            <Text area="liquidity">Liquidity</Text>
          </Flex>
        )}
        <Flex alignItems="center">
          <Text area="No Percent">{below680 ? 'No' : 'No %'}</Text>
        </Flex>
        <Flex alignItems="center">
          <Text area="Yes Percent">{below680 ? 'Yes' : 'Yes %'}</Text>
        </Flex>
        {!below800 && (
          <Flex alignItems="center">
            <ClickableText
              area="status"
              onClick={e => {
                setSortedColumn(SORT_FIELD.STATUS)
                setSortDirection(sortedColumn !== SORT_FIELD.STATUS ? true : !sortDirection)
              }}
            >
              Status {sortedColumn === SORT_FIELD.STATUS ? (!sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
        )}
        {!below800 && (
          <Flex alignItems="center">
            <ClickableText
              area="timestamp"
              onClick={e => {
                setSortedColumn(SORT_FIELD.ENDTIMESTAMP)
                setSortDirection(sortedColumn !== SORT_FIELD.ENDTIMESTAMP ? true : !sortDirection)
              }}
            >
              Market Ends
              {sortedColumn === SORT_FIELD.ENDTIMESTAMP ? (!sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
        )}
      </DashGrid>
      <Divider />
      <List p={0}>
        {filteredList &&
          filteredList.map((item, index) => {
            return (
              <div key={index}>
                <ListItem key={index} index={(page - 1) * itemMax + index + 1} marketData={item} />
                <Divider />
              </div>
            )
          })}
      </List>
      <PageButtons>
        <div onClick={() => setPage(page === 1 ? page : page - 1)}>
          <Arrow faded={page === 1 ? true : false}>←</Arrow>
        </div>
        <TYPE.body>{'Page ' + page + ' of ' + maxPage}</TYPE.body>
        <div onClick={() => setPage(page === maxPage ? page : page + 1)}>
          <Arrow faded={page === maxPage ? true : false}>→</Arrow>
        </div>
      </PageButtons>
    </ListWrapper>
  )
}

export default withRouter(MarketList)
