import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import { formattedNum } from '../../utils'
import { useMedia } from 'react-use'
import { withRouter } from 'react-router-dom'
import { TYPE } from '../../Theme'
import { BasicLink } from '../Link'
import { RowFixed } from '../Row'
import { getCashInfo } from '../../contexts/Application'

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

const MarketCardTop = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1rem;

  > div:first-of-type {
    width: 40px;
    height: 40px;
  }

  > div:last-of-type {
    max-width: 250px;
    min-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const MarketCardBottom = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 1rem;

  > div:first-of-type {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    > div:last-of-type {
      padding: 0.25rem;
      font-weight: bold;
    }
  }

  > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  > div:last-of-type {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`

function groupByThree([a,b,c,...rest]){
  if (rest.length === 0) return [[a,b,c].filter(x => x!==undefined)]
  // tslint:disable-next-line: ban-ts-ignore
  // @ts-ignore
  return [[a,b,c]].concat(groupByThree(rest))
}

function MarketList({ markets, itemMax = 15 }) {
  // page state
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [darkMode] = useDarkModeManager()

  // sorting
  const [filteredList, setFilteredList] = useState(markets)
  const below1196 = useMedia('(max-width: 1196px)')

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
      .slice(itemMax * (page - 1), page * itemMax)
    setFilteredList(filteredMarkets)
  }, [markets, itemMax, page])


  const marketsGroupByThree = groupByThree(filteredList)

  if (!marketsGroupByThree) {
    return null;
  }

  const marketCard = (marketData, index) => {
    const cashtoken = getCashInfo(marketData.cash)

    const augurLogo = (
      <svg width='40' height='40' viewBox='0 0 55 56' fill='none'><ellipse cx='27.4717' cy='28' rx='27.4717' ry='28' fill='#0E0E21'></ellipse><path d='M41.3111 33.9471L38.2766 28.78C38.1621 28.589 37.9174 28.5306 37.7301 28.6473L35.7574 29.9365C35.5804 30.0532 35.5232 30.2919 35.6325 30.4776L37.3657 33.4272C37.4178 33.5174 37.3917 33.6394 37.3033 33.6977L27.1953 40.3025C27.1328 40.3449 27.0495 40.3449 26.9871 40.3025L16.8738 33.6977C16.7854 33.6394 16.7593 33.5227 16.8114 33.4272L18.5446 30.4776C18.6539 30.2919 18.5967 30.0532 18.4197 29.9365L16.447 28.6473C16.2597 28.5253 16.015 28.5837 15.9005 28.78L12.866 33.9471C12.6474 34.3184 12.7619 34.7959 13.1159 35.024L26.6643 43.8728C26.9194 44.0426 27.2525 44.0426 27.5076 43.8728L41.056 35.024C41.4152 34.7959 41.5245 34.3184 41.3111 33.9471Z' fill='white'></path><path d='M18.0291 25.9045L20.0018 27.1936C20.1892 27.3156 20.4338 27.2573 20.5483 27.061L26.9192 16.2016C26.9972 16.0743 27.1794 16.0743 27.2523 16.2016L33.6283 27.061C33.7429 27.252 33.9875 27.3103 34.1749 27.1936L36.1475 25.9045C36.3245 25.7878 36.3818 25.5491 36.2725 25.3634L28.6576 12.3873C28.5119 12.1485 28.2621 12 27.9862 12H26.1905C25.9146 12 25.6596 12.1485 25.519 12.3873L17.9042 25.3634C17.7949 25.5491 17.8522 25.7878 18.0291 25.9045Z' fill='#2AE7A8'></path></svg>
    );

    const cardImageSource = cashtoken
    ? <img style={{ borderRadius: '50%' }} width='100%' height='100%' alt='Token Logo' src={require(`../../assets/${cashtoken.asset}`)} />
    : augurLogo;

    return (
      <TYPE.boxed m='1.5rem' key={index} style={below1196 ? {
        background: darkMode ? 'none' : 'rgba(255,255,255,0.4)',
        boxShadow: '0 3px 11px rgba(0,0,0,.04)',
      } : {
        height:' 185px',
        width: '385px',
        maxHeight:' 185px',
        maxWidth: '385px',
        background: darkMode ? 'none' : 'rgba(255,255,255,0.4)',
        boxShadow: '0 3px 11px rgba(0,0,0,.04)',
      }}>
        <BasicLink style={{
          width: '100%',
          fontWeight: '400',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }} to={'/token/' + marketData?.id} key={marketData?.id}>

        <MarketCardTop>
            <div>{cardImageSource}</div>
            <div>{marketData?.description}</div>
        </MarketCardTop>


        <MarketCardBottom>
            <div>
              <div>Liquidity</div>
              <div>${formattedNum((Number(marketData?.amm?.liquidity)).toFixed(2))}</div>
            </div>

            <div>
              <div>Yes</div>
              <div style={{
                color: darkMode ? 'rgb(125, 255, 168)' : '#2172E5',
                padding: '0.25rem',
                fontWeight: 'bold'
              }}>{formattedNum(marketData?.amm?.priceYes.toFixed(2))}</div>
            </div>

            <div>
              <div>No</div>
              <div style={{
                color: darkMode ? 'rgb(125, 255, 168)' : '#2172E5',
                padding: '0.25rem',
                fontWeight: 'bold' }}>{formattedNum(marketData?.amm?.priceNo.toFixed(2))}</div>
            </div>
          </MarketCardBottom>
        </BasicLink>
      </TYPE.boxed>
    );
  };

  return (
    <div>
      {marketsGroupByThree.map((filteredList, index) => (
        <RowFixed
          key={index}
          style={
            below1196 ? {
              flexFlow: 'column',
              alignItems: 'stretch',
              justifyContent: 'flex-start'
            } : {
              flexFlow: 'row',
              justifyContent: 'center'
          }}
        >
          {filteredList.map((market, index) => marketCard(market, index))}
        </RowFixed>
      ))}

      <PageButtons>
        <div onClick={() => setPage(page === 1 ? page : page - 1)}>
          <Arrow faded={page === 1 ? true : false}>←</Arrow>
        </div>
        <TYPE.body>{'Page ' + page + ' of ' + maxPage}</TYPE.body>
        <div onClick={() => setPage(page === maxPage ? page : page + 1)}>
          <Arrow faded={page === maxPage ? true : false}>→</Arrow>
        </div>
      </PageButtons>

    </div>
  )
}

export default withRouter(MarketList)
