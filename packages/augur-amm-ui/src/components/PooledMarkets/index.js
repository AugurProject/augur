import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { Box, Flex, Text } from 'rebass'
import { Divider } from '..'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import { formatTime, formatToDisplayValue } from '../../utils'
import { useMedia } from 'react-use'
import { withRouter } from 'react-router-dom'
import { TYPE } from '../../Theme'
import { BasicLink } from '../Link'
import { useAmmMarkets } from '../../contexts/Markets'
import TokenLogo from '../TokenLogo'

dayjs.extend(utc)

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 2em;
`

const Arrow = styled.div`
  color: ${({ theme }) => theme.primary1};
  opacity: ${props => (props.faded ? 0.3 : 1)};
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
  grid-template-columns: 0.5fr 45% 1fr 1fr;
  grid-template-areas: 'name balance status timestamp';
  padding: 0 1.125rem;

  > * {
    justify-content: flex-end;

    &:first-child {
      justify-content: flex-start;
      text-align: left;
    }

    &:nth-child(2) {
      justify-content: flex-start;
      text-align: left;
    }
  }

  @media screen and (min-width: 1080px) {
    display: grid;
    grid-gap: 0.5em;
    grid-template-columns: 0.25fr 2fr 1fr 1fr 1fr;
    grid-template-areas: 'currency name balance status timestamp';
  }

  @media screen and (max-width: 816px) {
    display: grid;
    grid-gap: 0.5em;
    grid-template-columns: 0.25fr 70% 1fr;
    grid-template-areas: 'currency description balance';
  }

  @media screen and (max-width: 680px) {
    display: grid;
    grid-gap: 0.5em;
    grid-template-columns: 80% 1fr;
    grid-template-areas: 'description balance';
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
  text-align: left;
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

function PooledMarketList({ balances, itemMax = 20 }) {
  // page state
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [darkMode] = useDarkModeManager()

  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.STATUS)

  const markets = useAmmMarkets(balances)
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

  const ListItem = ({ item }) => {
    return (
      <DashGrid style={{ height: '48px' }} focus={true}>
        {!below680 && <TokenLogo tokenInfo={item?.shareToken?.cash?.id} />}
        <DataText style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
          <BasicLink style={{ width: '100%', fontWeight: '400' }} to={'/market/' + item.id} key={item.id}>
            {item?.description}
          </BasicLink>
        </DataText>
        <DataText area="balance">{formatToDisplayValue(item.balance, item?.cash?.decimals)}</DataText>
        {!below800 && (
          <DataText area="status">
            <span
              style={
                !darkMode
                  ? {}
                  : item?.status === 'TRADING'
                  ? { color: '#7DFFA8' }
                  : item?.status === 'DISPUTING'
                  ? { color: '#F1E700' }
                  : item?.status === 'REPORTING'
                  ? { color: '#F1E700' }
                  : item?.status === 'FINALIZED'
                  ? { color: '#F12B00' }
                  : {}
              }
            >
              {item.status}
            </span>
          </DataText>
        )}
        {!below800 && <DataText area="timestamp">{formatTime(item?.endTimestamp)}</DataText>}
      </DashGrid>
    )
  }

  return (
    <ListWrapper>
      <DashGrid center={true} style={{ height: 'fit-content', padding: '0 1.125rem 1rem 1.125rem' }}>
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
        <Flex alignItems="center">
          <Text
            area="Balance"
            onClick={e => {
              setSortedColumn(SORT_FIELD.STATUS)
              setSortDirection(sortedColumn !== SORT_FIELD.STATUS ? true : !sortDirection)
            }}
          >
            Balance
          </Text>
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
                <ListItem key={index} index={(page - 1) * itemMax + index + 1} item={item} />
                <Divider />
              </div>
            )
          })}
      </List>
      {maxPage > 1 && (
        <PageButtons>
          <div onClick={() => setPage(page === 1 ? page : page - 1)}>
            <Arrow faded={page === 1 ? true : false}>←</Arrow>
          </div>
          <TYPE.body>{'Page ' + page + ' of ' + maxPage}</TYPE.body>
          <div onClick={() => setPage(page === maxPage ? page : page + 1)}>
            <Arrow faded={page === maxPage ? true : false}>→</Arrow>
          </div>
        </PageButtons>
      )}
    </ListWrapper>
  )
}

export default withRouter(PooledMarketList)
