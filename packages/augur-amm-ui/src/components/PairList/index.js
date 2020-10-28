import React, { useState, useEffect, useMemo } from 'react'
import { useMedia } from 'react-use'
import dayjs from 'dayjs'
import LocalLoader from '../LocalLoader'
import utc from 'dayjs/plugin/utc'
import { Box } from 'rebass'
import styled from 'styled-components'
import { Divider } from '../../components'
import { withRouter } from 'react-router-dom'
import TokenLogo from '../TokenLogo'
import { RowFixed, AutoRow } from '../Row'
import { ButtonLight, ButtonPrimary } from '../ButtonStyled'
import { useLPTokenBalances } from '../../state/wallet/hooks'
import { TYPE, StyledInternalLink } from '../../Theme'
import { greaterThanZero } from '../../utils'
import { useTokenDayPriceData } from '../../contexts/TokenData'
import { useToken } from '../../hooks/Tokens'
import { calculateLiquidity, formattedNum } from '../../utils'
import { BigNumber as BN } from 'bignumber.js'

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
  grid-gap: 0.25rem;
  grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 1.5fr;
  grid-template-areas: 'name';
  padding: 0 0.75rem;

  > * {
    justify-content: flex-end;

    :first-child {
      justify-content: flex-start;
      text-align: left;
      width: 20px;
    }
  }

  @media screen and (max-width: 800px) {
    padding: 0 0.75rem;
    grid-template-columns: 0.5fr 1fr 1fr 1fr 1.5fr;
    grid-template-areas: ' name';
  }

  @media screen and (min-width: 1080px) {
    padding: 0 0.75rem;
    grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 1fr 1.5fr;
    grid-template-areas: ' name';
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 1fr 1.5fr;
    grid-template-areas: ' name';
  }
`

const ListWrapper = styled.div``

const SORT_FIELD = {
  LIQ: 0,
  VOL: 1,
  VOL_7DAYS: 3,
  FEES: 4,
  APY: 5
}

function PairList({ allExchanges, color, disbaleLinks, marketId, maxItems = 10 }) {
  const below600 = useMedia('(max-width: 600px)')
  const below740 = useMedia('(max-width: 740px)')
  const below800 = useMedia('(max-width: 800px)')
  const below1080 = useMedia('(max-width: 1080px)')
  const [userTokenBalances, loading] = useLPTokenBalances()

  const ListItem = ({ ammExchange, index }) => {
    const [hasLPTokens, setHasLpTokens] = useState(false)
    const cashData = useTokenDayPriceData()
    const cashToken = useToken(ammExchange.cash)

    useEffect(() => {
      if (userTokenBalances) {
        setHasLpTokens(greaterThanZero(userTokenBalances[ammExchange.id]))
      }
    }, [userTokenBalances, ammExchange])
    // calculate USD value from eth price
    let liquidityUSD = 0;
    let yesVolumeUSD = "0";
    let noVolumeUSD = "0";
    if (ammExchange?.liquidity && cashToken?.decimals && cashData[ammExchange.cash]?.priceUSD) {
      const collUSD = String(cashData[ammExchange.cash].priceUSD)
      const liq = calculateLiquidity(Number(cashToken?.decimals), String(ammExchange.liquidity), collUSD)
      liquidityUSD = formattedNum(String(liq), true)
      const yesPrice = new BN(ammExchange.percentageYes).div(100)
      const noPrice = new BN(ammExchange.percentageNo).div(100)
      const yesVolUSD =  (new BN(ammExchange.volumeYes).div(new BN(10).pow(18))).times(yesPrice).times(collUSD)
      const noVolUSD = (new BN(ammExchange.volumeNo).div(new BN(10).pow(18))).times(noPrice).times(collUSD)
      yesVolumeUSD = formattedNum(yesVolUSD, true)
      noVolumeUSD = formattedNum(noVolUSD, true)
    }

    if (ammExchange) {
      return (
        <DashGrid style={{ height: '48px', alignItems: 'center' }} disbaleLinks={disbaleLinks} focus={true}>
          <TokenLogo size={below600 ? 16 : 18} tokenInfo={ammExchange.cash} margin={!below740} />
          <TYPE.header area="name" fontWeight="500">
            {Number(ammExchange.percentageNo).toFixed(2)}
          </TYPE.header>
          <TYPE.header area="name" fontWeight="500">
            {Number(ammExchange.percentageYes).toFixed(2)}
          </TYPE.header>
          <TYPE.header area="name" fontWeight="500">
            {liquidityUSD}
          </TYPE.header>
          <TYPE.header area="name" fontWeight="500">
            {noVolumeUSD}
          </TYPE.header>
          <TYPE.header area="name" fontWeight="500">
            {yesVolumeUSD}
          </TYPE.header>
          <TYPE.header area="name" fontWeight="500">
            <RowFixed style={{ flexFlow: 'row nowrap', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <StyledInternalLink disabled={!hasLPTokens} to={`/remove/${marketId}/${ammExchange.id}`}>
                <ButtonLight disabled={!hasLPTokens} textAlign="center">
                  Remove
                </ButtonLight>
              </StyledInternalLink>
              <StyledInternalLink to={`/add/${marketId}/${ammExchange.cash}/${ammExchange.id}`}>
                <ButtonLight textAlign="center">Add</ButtonLight>
              </StyledInternalLink>
              <StyledInternalLink
                disabled={!ammExchange && !ammExchange.id}
                to={`/swap/${marketId}/${ammExchange.cash}/${ammExchange.id}`}
              >
                <ButtonPrimary disabled={!ammExchange && !ammExchange.id} textAlign="center">
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

  const exchangeList = allExchanges.map((exchange, index) => {
    return (
      exchange && (
        <div key={index}>
          <ListItem key={index} ammExchange={exchange} />
          <Divider />
        </div>
      )
    )
  })

  return (
    <ListWrapper>
      {allExchanges.length > 0 ? (
        <>
          <DashGrid
            center={true}
            disbaleLinks={disbaleLinks}
            style={{ height: 'fit-content', padding: '0 1.125rem 1rem 1.125rem' }}
          >
            <TYPE.header area="collateral"></TYPE.header>
            <TYPE.header area="YesPercent">Yes %</TYPE.header>
            <TYPE.header area="NoPercent">No %</TYPE.header>
            <TYPE.header area="liquidity">Liquidity</TYPE.header>
            <TYPE.header area="volumeYes">Yes Vol (24h)</TYPE.header>
            <TYPE.header area="volumeNo">No Vol (24h)</TYPE.header>
            <TYPE.header area="uniswap"></TYPE.header>
          </DashGrid>
          <Divider />
          <List p={0}>{!exchangeList ? <LocalLoader /> : exchangeList}</List>
        </>
      ) : (
        <AutoRow justify={'center'}>
          <TYPE.light>No Exchanges Created</TYPE.light>
        </AutoRow>
      )}
    </ListWrapper>
  )
}

export default withRouter(PairList)
