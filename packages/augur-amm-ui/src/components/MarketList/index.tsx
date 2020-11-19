import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { Box, Flex, Text } from 'rebass'
import { Divider } from '..'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import { formatTime, formattedNum } from '../../utils'
import { useMedia } from 'react-use'
import { withRouter } from 'react-router-dom'
import { TYPE } from '../../Theme'
import { BasicLink } from '../Link'
import TokenLogo from '../TokenLogo'

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
  grid-template-columns: 0.5fr 50% 1fr 1fr 0.5fr 0.5fr 1fr 1fr;
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
    grid-template-columns: 0.5fr 5fr 1fr 1fr 0.5fr 0.5fr 1fr 1fr;
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
  NAME: 'description',
  PRICE: 'priceUSD',
  CHANGE: 'priceChangeUSD',
  DESCRIPTION: 'description',
  STATUS: 'status',
  ENDTIMESTAMP: 'endTimestamp',
  LIQUIDITY: 'liquidity',
  VOL_24_HR: 'volume24hr'
}

function MarketList({ markets, itemMax = 15 }) {
  // page state
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [darkMode] = useDarkModeManager()

  // sorting
  const [sortedData, setSortedData] = useState({ sortedColumn: SORT_FIELD.STATUS, sortDirection: -1 })
  const [filteredList, setFilteredList] = useState(markets)
  const below680 = useMedia('(max-width: 680px)')
  const below816 = useMedia('(max-width: 816px)')

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
    setPage(1)
  }, [markets, itemMax])

  useEffect(() => {
    const filteredMarkets = markets
      .sort((a, b) => {
        if (sortedData.sortedColumn === SORT_FIELD.NAME || sortedData.sortedColumn === SORT_FIELD.STATUS) {
          return a[sortedData.sortedColumn] > b[sortedData.sortedColumn] ? sortedData.sortDirection : sortedData.sortDirection * -1
        }
        if (sortedData.sortedColumn === SORT_FIELD.LIQUIDITY) {
          if (!a?.amm?.liquidity) return sortedData.sortDirection;
          if (!b?.amm?.liquidity) return sortedData.sortDirection * -1;
          return a?.amm?.liquidity > b?.amm?.liquidity ? sortedData.sortDirection : sortedData.sortDirection * -1
        }
        if (sortedData.sortedColumn === SORT_FIELD.VOL_24_HR) {
          if (!a?.amm?.volume24hrUSD) return sortedData.sortDirection;
          if (!b?.amm?.volume24hrUSD) return sortedData.sortDirection * -1;
          return a?.amm?.volume24hrUSD > b?.amm?.volume24hrUSD ? sortedData.sortDirection : sortedData.sortDirection * -1
        }
        if (sortedData.sortedColumn === SORT_FIELD.ENDTIMESTAMP) {
          return a.endTimestamp > b.endTimestamp ? sortedData.sortDirection : sortedData.sortDirection * -1
        }
        return parseFloat(a[sortedData.sortedColumn]) > parseFloat(b[sortedData.sortedColumn])
          ? sortedData.sortDirection
          : sortedData.sortDirection * -1
      })
      .slice(itemMax * (page - 1), page * itemMax)
    setFilteredList(filteredMarkets)
  }, [markets, itemMax, page, sortedData])

  const ListItem = ({ marketData, index }) => {

    return (
      <DashGrid style={{ height: '48px', alignContent: 'center' }} >
        {!below680 && <TokenLogo tokenInfo={marketData?.cash} size={'18px'}/>}
        <DataText style={{ justifyContent: 'flex-start', alignItems: 'center', textAlign: 'left' }}>
          <BasicLink style={{ width: '100%', fontWeight: '400' }} to={'/token/' + marketData?.id} key={marketData?.id}>
            {marketData.description}
          </BasicLink>
        </DataText>
        {!below816 && <DataText area="liquidity">{marketData.amm ? formattedNum(marketData.amm.liquidityUSD, true) : '-'}</DataText>}
        {!below816 && <DataText area="volume24hr">{marketData.amm ? formattedNum(marketData.amm.volume24hrUSD, true) : '-'}</DataText>}
        <DataText area="yesPercent">{marketData.amm ? Number(marketData.amm.priceYes).toFixed(2) : '-'}</DataText>
        <DataText area="noPercent">{marketData.amm ? Number(marketData.amm.priceNo).toFixed(2) : '-'}</DataText>
        {!below816 && (
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
        {!below816 && <DataText area="timestamp">{formatTime(marketData.endTimestamp)}</DataText>}
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
              const direction = (sortedData.sortedColumn !== SORT_FIELD.DESCRIPTION ? -1 : sortedData.sortDirection * -1)
              setSortedData({ sortedColumn: SORT_FIELD.DESCRIPTION, sortDirection: direction })
            }}
          >
            {below816 ? 'Symbol' : 'Description'}{' '}
            {sortedData.sortedColumn === SORT_FIELD.DESCRIPTION ? (sortedData.sortDirection === 1 ? '↑' : '↓') : ''}
          </ClickableText>
        </Flex>
        {!below816 && (
          <Flex alignItems="center">
            <ClickableText
              area="liquidity"
              onClick={e => {
                const direction = (sortedData.sortedColumn !== SORT_FIELD.LIQUIDITY ? -1 : sortedData.sortDirection * -1)
                setSortedData({ sortedColumn: SORT_FIELD.LIQUIDITY, sortDirection: direction })
              }}
            >
              Liquidity {sortedData.sortedColumn === SORT_FIELD.LIQUIDITY ? (sortedData.sortDirection === 1 ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
        )}
        {!below816 && (
          <Flex alignItems="center">
            <ClickableText
              area="volume 24hr"
              onClick={e => {
                const direction = (sortedData.sortedColumn !== SORT_FIELD.VOL_24_HR ? -1 : sortedData.sortDirection * -1)
                setSortedData({ sortedColumn: SORT_FIELD.VOL_24_HR, sortDirection: direction })
              }}
            >
              24hr Volume {sortedData.sortedColumn === SORT_FIELD.VOL_24_HR ? (sortedData.sortDirection === 1 ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
        )}
        <Flex alignItems="center">
          <Text area="No Price">Yes</Text>
        </Flex>
        <Flex alignItems="center">
          <Text area="Yes Price">No</Text>
        </Flex>
        {!below816 && (
          <Flex alignItems="center">
            <ClickableText
              area="status"
              onClick={e => {
                const direction = (sortedData.sortedColumn !== SORT_FIELD.STATUS ? -1 : sortedData.sortDirection * -1)
                setSortedData({ sortedColumn: SORT_FIELD.STATUS, sortDirection: direction })
              }}
            >
              Status {sortedData.sortedColumn === SORT_FIELD.STATUS ? (sortedData.sortDirection === 1 ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
        )}
        {!below816 && (
          <Flex alignItems="center">
            <ClickableText
              area="timestamp"
              onClick={e => {
                const direction = (sortedData.sortedColumn !== SORT_FIELD.ENDTIMESTAMP ? 1 : sortedData.sortDirection * -1)
                setSortedData({ sortedColumn: SORT_FIELD.ENDTIMESTAMP, sortDirection: direction })
              }}
            >
              Market Ends
              {sortedData.sortedColumn === SORT_FIELD.ENDTIMESTAMP ? (sortedData.sortDirection === 1 ? '↑' : '↓') : ''}
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
