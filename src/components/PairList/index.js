import React, { useState, useEffect } from 'react'
import { useMedia } from 'react-use'
import dayjs from 'dayjs'
import LocalLoader from '../LocalLoader'
import utc from 'dayjs/plugin/utc'
import { Box } from 'rebass'
import styled from 'styled-components'
import { userLPBalanceOf } from '../../utils/contractCalls'
//import { CustomLink } from '../Link'
import { Divider } from '../../components'
import { withRouter } from 'react-router-dom'
import DoubleTokenLogo from '../DoubleLogo'
import FormattedName from '../FormattedName'
import { TYPE, StyledInternalLink } from '../../Theme'
//import { Type } from 'react-feather'
import { RowFixed } from '../Row'
import { useAccountWeb3 } from '../../contexts/Account'
import { useConfig } from '../../contexts/Application'
import { useMarketAmm } from '../../contexts/Markets'
import { formatNumber, greaterThanZero } from '../../utils'
import { ButtonLight, ButtonPrimary } from '../ButtonStyled'

dayjs.extend(utc)

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 0.5em;
`

const Arrow = styled.div`
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
  grid-gap: 1em;
  grid-template-columns: 50px 1fr 1fr 1fr 1fr 1.5fr;
  grid-template-areas: 'name';
  padding: 0 1.125rem;

  > * {
    justify-content: flex-end;

    :first-child {
      justify-content: flex-start;
      text-align: left;
      width: 20px;
    }
  }

  @media screen and (max-width: 800px) {
    padding: 0 1.125rem;
    grid-template-columns: 50px 1fr 1fr 1fr 1.5fr;
    grid-template-areas: ' name';
  }

  @media screen and (min-width: 1080px) {
    padding: 0 1.125rem;
    grid-template-columns: 50px 1fr 1fr 1fr 1fr 1.5fr;
    grid-template-areas: ' name';
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: 50px 1fr 1fr 1fr 1fr 1.5fr;
    grid-template-areas: ' name';
  }
`

const ListWrapper = styled.div``

/*
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
*/

const SORT_FIELD = {
  LIQ: 0,
  VOL: 1,
  VOL_7DAYS: 3,
  FEES: 4,
  APY: 5
}

const FIELD_TO_VALUE = {
  [SORT_FIELD.LIQ]: 'trackedReserveUSD', // sort with tracked volume only
  [SORT_FIELD.VOL]: 'oneDayVolumeUSD',
  [SORT_FIELD.VOL_7DAYS]: 'oneWeekVolumeUSD',
  [SORT_FIELD.FEES]: 'oneDayVolumeUSD'
}

function PairList({ pairs, color, disbaleLinks, marketId, maxItems = 10 }) {
  const below600 = useMedia('(max-width: 600px)')
  const below740 = useMedia('(max-width: 740px)')
  const below800 = useMedia('(max-width: 800px)')
  const { address } = useAccountWeb3()
  const config = useConfig()
  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const ITEMS_PER_PAGE = maxItems

  // sorting
  const [sortDirection] = useState(true)
  const [sortedColumn] = useState(SORT_FIELD.LIQ)
  const [hasLPTokens, setHasLpTokens] = useState(false)

  useEffect(() => {
    const getHasLPTokens = async () => {
      // TODO get AMM exchange address from theGraph call
      const balance = await userLPBalanceOf(config.network, '', address)
      if (greaterThanZero(balance)) {
        setHasLpTokens(true)
      }
    }
    setMaxPage(1) // edit this to do modular
    setPage(1)
    getHasLPTokens()
  }, [config, address])

  useEffect(() => {
    if (pairs) {
      let extraPages = 1
      if (Object.keys(pairs).length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(Object.keys(pairs).length / ITEMS_PER_PAGE) + extraPages)
    }
  }, [ITEMS_PER_PAGE, pairs])

  const ListItem = ({ pairAddress, index }) => {
    const pairData = pairs[pairAddress]
    const amm = useMarketAmm(marketId, pairData.ammId)
    console.log(amm)
    if (pairData && pairData.token0 && pairData.token1) {
      return (
        <DashGrid style={{ height: '48px', alignItems: 'center' }} disbaleLinks={disbaleLinks} focus={true}>
          <DoubleTokenLogo
            size={below600 ? 16 : 24}
            token0={pairData.token0.id}
            token1={pairData.token1.id}
            margin={!below740}
          />
          <TYPE.header style={{ marginLeft: '20px', whiteSpace: 'nowrap' }}>
            <FormattedName
              text={pairData.token0.symbol + ' - ' + pairData.token1.symbol}
              maxCharacters={below600 ? 75 : 100}
              adjustSize={true}
              link={false}
            />
          </TYPE.header>
          <TYPE.header area="name" fontWeight="500">
            $0
          </TYPE.header>
          <TYPE.header area="name" fontWeight="500">
            $0
          </TYPE.header>
          {!below800 && (
            <TYPE.header area="name" fontWeight="500">
              $0
            </TYPE.header>
          )}
          <TYPE.header area="name" fontWeight="500">
            <RowFixed style={{ flexFlow: 'row nowrap', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <StyledInternalLink
                disabled={!hasLPTokens}
                to={`/remove/${marketId}/${pairData.token0.id}/${pairData.ammId}`}
              >
                <ButtonLight disabled={!hasLPTokens} textAlign="center">
                  Remove
                </ButtonLight>
              </StyledInternalLink>
              <StyledInternalLink to={`/add/${marketId}/${pairData.token0.id}/${pairData.ammId}`}>
                <ButtonLight textAlign="center">Add</ButtonLight>
              </StyledInternalLink>
              <StyledInternalLink
                disabled={!pairData.ammId}
                to={`/swap/${marketId}/${pairData.token0.id}/${pairData.ammId}`}
              >
                <ButtonPrimary disabled={!pairData.ammId} textAlign="center">
                  Trade
                </ButtonPrimary>
              </StyledInternalLink>
            </RowFixed>
          </TYPE.header>
        </DashGrid>
      )
    } else {
      return ''
    }
  }

  const pairList =
    pairs &&
    Object.keys(pairs)
      .sort((addressA, addressB) => {
        const pairA = pairs[addressA]
        const pairB = pairs[addressB]
        if (sortedColumn === SORT_FIELD.APY) {
          const apy0 = parseFloat(pairA.oneDayVolumeUSD * 0.003 * 356 * 100) / parseFloat(pairA.reserveUSD)
          const apy1 = parseFloat(pairB.oneDayVolumeUSD * 0.003 * 356 * 100) / parseFloat(pairB.reserveUSD)
          return apy0 > apy1 ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
        }
        return parseFloat(pairA[FIELD_TO_VALUE[sortedColumn]]) > parseFloat(pairB[FIELD_TO_VALUE[sortedColumn]])
          ? (sortDirection ? -1 : 1) * 1
          : (sortDirection ? -1 : 1) * -1
      })
      .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
      .map((pairAddress, index) => {
        return (
          pairAddress && (
            <div key={index}>
              <ListItem key={index} index={(page - 1) * ITEMS_PER_PAGE + index + 1} pairAddress={pairAddress} />
              <Divider />
            </div>
          )
        )
      })

  return (
    <ListWrapper>
      <DashGrid
        center={true}
        disbaleLinks={disbaleLinks}
        style={{ height: 'fit-content', padding: '0 1.125rem 1rem 1.125rem' }}
      >
        <TYPE.header area="uniswap"></TYPE.header>
        <TYPE.header area="uniswap"></TYPE.header>
        <TYPE.header area="uniswap">Liquidity</TYPE.header>
        <TYPE.header area="uniswap">Volume (24 hour)</TYPE.header>
        {!below800 && <TYPE.header area="uniswap">Volume (7 day)</TYPE.header>}
        <TYPE.header area="uniswap"></TYPE.header>
      </DashGrid>
      <Divider />
      <List p={0}>{!pairList ? <LocalLoader /> : pairList}</List>
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
    </ListWrapper>
  )
}

export default withRouter(PairList)
