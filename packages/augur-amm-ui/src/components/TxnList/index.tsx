import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { formatTime, formattedNum, urls, formatShares } from '../../utils'
import { useMedia } from 'react-use'
import { RowFixed, RowBetween } from '../Row'

import LocalLoader from '../LocalLoader'
import { Box, Flex, Text } from 'rebass'
import Link from '../Link'
import { Divider, EmptyCard } from '..'
import DropdownSelect from '../DropdownSelect'
import { TYPE } from '../../Theme'
import { BigNumber as BN } from 'bignumber.js'

dayjs.extend(utc)

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 0.5em;
`

const Arrow = styled.div<{ faded }>`
  color: #2f80ed;
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

const DashGrid = styled.div<{ center }>`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 100px 1fr 1fr;
  grid-template-areas: 'txn value time';

  > * {
    justify-content: flex-end;
    width: 100%;

    &:first-child {
      justify-content: flex-start;
      text-align: left;
      width: 100px;
    }
  }

  @media screen and (min-width: 500px) {
    > * {
      &:first-child {
        width: 180px;
      }
    }
  }

  @media screen and (min-width: 780px) {
    max-width: 1320px;
    grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 'txn value amountToken amountOther time';

    > * {
      &:first-child {
        width: 180px;
      }
    }
  }

  @media screen and (min-width: 1080px) {
    max-width: 1320px;
    grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 'txn value amountToken amountOther collateral time';
  }
`

const ClickableText = styled(Text)`
  color: ${({ theme }) => theme.text1};
  user-select: none;
  text-align: end;

  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }

  @media screen and (max-width: 640px) {
    font-size: 14px;
  }
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: right;
  color: ${({ theme }) => theme.text1};

  & > * {
    font-size: 1em;
  }

  @media screen and (max-width: 40em) {
    font-size: 0.85rem;
  }
`

const SortText = styled.button<{ active }>`
  cursor: pointer;
  font-weight: ${({ active, theme }) => (active ? 500 : 400)};
  margin-right: 0.75rem !important;
  border: none;
  background-color: transparent;
  font-size: 1rem;
  padding: 0px;
  color: ${({ active, theme }) => (active ? theme.text1 : theme.text3)};
  outline: none;

  @media screen and (max-width: 600px) {
    font-size: 14px;
  }
`

const SORT_FIELD = {
  VALUE: 'amountUSD',
  AMOUNT0: 'token0Amount',
  AMOUNT1: 'token1Amount',
  TIMESTAMP: 'timestamp'
}

const TXN_TYPE = {
  ALL: 'All',
  SWAP: 'Swaps',
  ENTER: 'Enter',
  EXIT: 'Exit',
  ADD: 'Adds',
  REMOVE: 'Removes'
}

const ITEMS_PER_PAGE = 10

function processTransactions(allExchanges, cashData, cashTokens) {
  const displayValue = (num, decimals) => {
    return new BN(num).div(new BN(10).pow(Number(decimals)))
  }
  const calcCash = (num, decimals, price) => {
    const displayVal = displayValue(num, decimals)
    return displayVal.times(new BN(price))
  }
  let txns = []
  if (allExchanges.length > 0) {
    return allExchanges.map(e => {
      const price = e?.cash?.address ? cashData[e?.cash?.address]?.priceUSD : 1
      const symbol = e?.cash?.address ? cashData[e?.cash?.address]?.symbol : 'cash'
      const decimals = cashTokens ? cashTokens[e.cash.address]?.decimals : 18
      const enters = (e.enters || []).map(mint => ({
        hash: mint.tx_hash,
        timestamp: mint.timestamp || 0,
        type: TXN_TYPE.ENTER,
        token0Amount: String(displayValue(mint.cash, decimals)),
        token1Amount: (mint.noShares !== "0" ? formatShares(mint.noShares, decimals) : formatShares(mint.yesShares, decimals)),
        token0Symbol: symbol,
        token1Symbol: mint.noShares !== "0" ? 'No Shares' : 'Yes Shares',
        amountUSD: String(calcCash(mint.cash, decimals, price)),
        account: mint.sender?.id,
      }))

      const exits = (e.exits || []).map(burn => ({
        hash: burn.tx_hash,
        timestamp: burn.timestamp || 0,
        type: TXN_TYPE.EXIT,
        token0Amount: burn.noShares ? formatShares(burn.noShares, decimals) : formatShares(burn.yesShares, decimals),
        token1Amount: String(displayValue(burn.cash, decimals)),
        token0Symbol: burn.noShares ? 'No Shares' : 'Yes Shares',
        token1Symbol: symbol,
        amountUSD: String(calcCash(burn.cash, decimals, price)),
        account: burn.sender?.id,
      }))

      const adds = (e.addLiquidity || []).map(additions => ({
        hash: additions.tx_hash,
        timestamp: additions.timestamp || 0,
        type: TXN_TYPE.ADD,
        token0Amount: formatShares(additions.noShares, decimals),
        token1Amount: formatShares(additions.yesShares, decimals),
        token0Symbol: 'No Shares',
        token1Symbol: 'Yes Shares',
        amountUSD: String(calcCash(additions.cash, decimals, price)),
        account: additions.sender?.id,
      }))


      const removes = (e.removeLiquidity || []).map(removals => ({
        hash: removals.tx_hash,
        timestamp: removals.timestamp || 0,
        type: TXN_TYPE.REMOVE,
        token0Amount: formatShares(removals.noShares, decimals),
        token1Amount: formatShares(removals.yesShares, decimals),
        token0Symbol: 'No Shares',
        token1Symbol: 'Yes Shares',
        amountUSD: String(calcCash(removals.cash, decimals, price)),
        account: removals.sender?.id,
      }))

      const swaps = (e.swaps || []).map(swap => {
        const netToken0 = swap.yesShares - swap.noShares
        const netToken1 = swap.noShares - swap.yesShares

        const hash = swap.tx_hash
        const timestamp = swap.timestamp || 0
        const type = TXN_TYPE.SWAP

        const amountUSD = String(calcCash(swap.cash, decimals, price))
        const cashAmount = swap.cash ? String(displayValue(swap.cash, decimals)) : '';

        let newTxn = {
          hash,
          timestamp,
          type,
          amountUSD,
          cashAmount,
          token0Symbol: 'No Shares',
          token1Symbol: 'Yes Shares',
          token0Amount: Math.abs(netToken0),
          token1Amount: Math.abs(netToken1),
          account: swap.sender?.id,
        }

        if (netToken1 < 0) {
          newTxn = {
            hash,
            timestamp,
            type,
            amountUSD,
            cashAmount,
            token0Symbol: 'No Shares',
            token1Symbol: 'Yes Shares',
            token0Amount: Math.abs(netToken1),
            token1Amount: Math.abs(netToken0),
            account: swap.sender?.id,
          }
        }
        return newTxn;
      })

      return [...enters, ...exits, ...swaps, ...adds, ...removes];
    }).flat()
  }
  return []
}

function getTransactionType(event, symbol0, symbol1) {
  const formattedS0 = symbol0?.length > 8 ? symbol0.slice(0, 7) + '...' : symbol0
  const formattedS1 = symbol1?.length > 8 ? symbol1.slice(0, 7) + '...' : symbol1
  switch (event) {
    case TXN_TYPE.ADD:
      return 'Add Liquidity'
    case TXN_TYPE.REMOVE:
      return 'Remove Liquidity'
    case TXN_TYPE.ENTER:
      return `Swap ${symbol1} for Shares`
    case TXN_TYPE.EXIT:
      return `Swap Shares for ${symbol0}`
    case TXN_TYPE.SWAP:
      return 'Swap ' + formattedS0 + ' for ' + formattedS1
    default:
      return ''
  }
}

// @TODO rework into virtualized list
function TxnList({ allExchanges, color, cashTokens, cashData }) {
  // page state
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.TIMESTAMP)
  const [txFilter, setTxFilter] = useState(TXN_TYPE.ALL)
  const [transactions, setTransactions] = useState([])
  const [filteredList, setFilteredList] = useState([])

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [allExchanges])

  // parse the txns and format for UI
  useEffect(() => {
    let newTxns = []
    if (allExchanges && cashTokens && cashData) {
      newTxns = processTransactions(allExchanges, cashData, cashTokens)
    }
    setTransactions(newTxns)
  }, [allExchanges, cashTokens, cashData])

  useEffect(() => {
    const filtered = transactions
      .filter(item => {
        if (txFilter !== TXN_TYPE.ALL) {
          if (txFilter === TXN_TYPE.SWAP) {
            return [TXN_TYPE.ENTER, TXN_TYPE.EXIT, TXN_TYPE.SWAP].includes(item.type)
          }
          return item.type === txFilter
        }
        return true
      })

    let extraPages = 1
    if (filtered.length % ITEMS_PER_PAGE === 0) {
      extraPages = 0
    }
    if (filtered.length === 0) {
      setMaxPage(1)
    } else {
      setMaxPage(Math.floor(filtered.length / ITEMS_PER_PAGE) + extraPages)
    }

    const filteredList =
      filtered &&
      filtered
        .sort((a, b) => {
          return parseFloat(a[sortedColumn]) > parseFloat(b[sortedColumn])
            ? (sortDirection ? -1 : 1) * 1
            : (sortDirection ? -1 : 1) * -1
        })
        .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
    setFilteredList(filteredList)
  }, [transactions, setFilteredList, txFilter, page, sortDirection, sortedColumn])

  useEffect(() => {
    setPage(1)
  }, [txFilter])

  const below1080 = useMedia('(max-width: 1080px)')
  const below780 = useMedia('(max-width: 780px)')

  const ListItem = ({ item, index }) => {

    return (
      <DashGrid center={false} style={{ height: '48px' }}>
        <DataText area="txn" fontWeight="500">
          <Link color={color} external href={urls.showTransaction(item.hash)}>
            {getTransactionType(item.type, item.token1Symbol, item.token0Symbol)}
          </Link>
        </DataText>
        <DataText area="value">{formattedNum(item.amountUSD, true)}</DataText>
        {!below780 && (
          <>
            <DataText area="amountToken">{formattedNum(item.token0Amount) + ' ' + item.token0Symbol} </DataText>
            <DataText area="amountOther">{formattedNum(item.token1Amount) + ' ' + item.token1Symbol} </DataText>
          </>
        )}
        {!below1080 && <DataText area="account">
        <Link color={color} external href={'https://etherscan.io/address/' + item.account}>
              {item.account && item.account.slice(0, 6) + '...' + item.account.slice(38, 42)}
            </Link>
          </DataText>}
        <DataText area="time">{formatTime(item.timestamp)}</DataText>
      </DashGrid>
    )
  }

  return (
    <>
      <DashGrid center={true} style={{ height: 'fit-content', padding: '0 0 1rem 0' }}>
        {below780 ? (
          <RowBetween area="txn">
            <DropdownSelect options={TXN_TYPE} active={txFilter} setActive={setTxFilter} />
          </RowBetween>
        ) : (
            <RowFixed area="txn" gap="10px" pl={4}>
              <SortText
                onClick={() => {
                  setTxFilter(TXN_TYPE.ALL)
                }}
                active={txFilter === TXN_TYPE.ALL}
              >
                All
            </SortText>
              <SortText
                onClick={() => {
                  setTxFilter(TXN_TYPE.SWAP)
                }}
                active={txFilter === TXN_TYPE.SWAP}
              >
                Swaps
            </SortText>
              <SortText
                onClick={() => {
                  setTxFilter(TXN_TYPE.ADD)
                }}
                active={txFilter === TXN_TYPE.ADD}
              >
                Adds
            </SortText>
              <SortText
                onClick={() => {
                  setTxFilter(TXN_TYPE.REMOVE)
                }}
                active={txFilter === TXN_TYPE.REMOVE}
              >
                Removes
              </SortText>
            </RowFixed>
          )}

        <Flex alignItems="center">
          <ClickableText
            color="textDim"
            area="value"
            onClick={e => {
              setSortedColumn(SORT_FIELD.VALUE)
              setSortDirection(sortedColumn !== SORT_FIELD.VALUE ? true : !sortDirection)
            }}
          >
            Total Value {sortedColumn === SORT_FIELD.VALUE ? (!sortDirection ? '↑' : '↓') : ''}
          </ClickableText>
        </Flex>
        {!below780 && (
          <Flex alignItems="center">
            <ClickableText
              area="amountToken"
              color="textDim"
              onClick={() => {
                setSortedColumn(SORT_FIELD.AMOUNT0)
                setSortDirection(sortedColumn !== SORT_FIELD.AMOUNT0 ? true : !sortDirection)
              }}
            >
              {'Token Amount'}
              {sortedColumn === SORT_FIELD.AMOUNT0 ? (sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
        )}
        <>
          {!below780 && (
            <Flex alignItems="center">
              <ClickableText
                area="amountOther"
                color="textDim"
                onClick={() => {
                  setSortedColumn(SORT_FIELD.AMOUNT1)
                  setSortDirection(sortedColumn !== SORT_FIELD.AMOUNT1 ? true : !sortDirection)
                }}
              >
                {'Token Amount'}
                {sortedColumn === SORT_FIELD.AMOUNT1 ? (sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>
          )}
          {!below1080 && (
            <Flex alignItems="center">
              <TYPE.body area="Account">Account</TYPE.body>
            </Flex>
          )}
          <Flex alignItems="center">
            <ClickableText
              area="time"
              color="textDim"
              onClick={() => {
                setSortedColumn(SORT_FIELD.TIMESTAMP)
                setSortDirection(sortedColumn !== SORT_FIELD.TIMESTAMP ? true : !sortDirection)
              }}
            >
              Time {sortedColumn === SORT_FIELD.TIMESTAMP ? (!sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
        </>
      </DashGrid>
      <Divider />
      <List p={0}>
        {!filteredList ? (
          <LocalLoader />
        ) : filteredList.length === 0 ? (
          <EmptyCard>No recent transactions found.</EmptyCard>
        ) : (
              filteredList.map((item, index) => {
                return (
                  <div key={index}>
                    <ListItem key={index} index={index + 1} item={item} />
                    <Divider />
                  </div>
                )
              })
            )}
      </List>
      <PageButtons>
        <div
          onClick={e => {
            setPage(page === 1 ? page : page - 1)
          }}
        >
          <Arrow faded={page === 1 ? true : false}>←</Arrow>
        </div>
        <TYPE.body>{'Page ' + page + ' of ' + maxPage}</TYPE.body>
        <div
          onClick={e => {
            setPage(page === maxPage ? page : page + 1)
          }}
        >
          <Arrow faded={page === maxPage ? true : false}>→</Arrow>
        </div>
      </PageButtons>
    </>
  )
}

export default TxnList
