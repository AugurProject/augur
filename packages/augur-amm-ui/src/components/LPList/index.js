import React, { useState, useEffect } from 'react'
import { useMedia } from 'react-use'
import dayjs from 'dayjs'
import LocalLoader from '../LocalLoader'
import utc from 'dayjs/plugin/utc'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'

import { CustomLink } from '../Link'
import { Divider } from '..'
import { withRouter } from 'react-router-dom'
import { formattedNum } from '../../utils'
import { TYPE } from '../../Theme'
import DoubleTokenLogo from '../DoubleLogo'
import { RowFixed } from '../Row'

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
  grid-gap: 1em;
  grid-template-columns: 10px 1.5fr 1fr 1fr;
  grid-template-areas: 'number name pair value';
  padding: 0 4px;

  > * {
    justify-content: flex-end;
  }

  @media screen and (max-width: 1080px) {
    grid-template-columns: 10px 1.5fr 1fr 1fr;
    grid-template-areas: 'number name pair value';
  }

  @media screen and (max-width: 600px) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: 'name pair value';
  }
`

const ListWrapper = styled.div``

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.text1};
  & > * {
    font-size: 14px;
  }

  @media screen and (max-width: 600px) {
    font-size: 13px;
  }
`

function LPList({ lps, disbaleLinks, maxItems = 10 }) {
  const below600 = useMedia('(max-width: 600px)')
  const below800 = useMedia('(max-width: 800px)')

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const ITEMS_PER_PAGE = maxItems

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [lps])

  useEffect(() => {
    if (lps) {
      let extraPages = 1
      if (Object.keys(lps).length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(Object.keys(lps).length / ITEMS_PER_PAGE) + extraPages)
    }
  }, [ITEMS_PER_PAGE, lps])

  const ListItem = ({ lp, index }) => {
    return (
      <DashGrid style={{ height: '48px' }} disbaleLinks={disbaleLinks} focus={true}>
        {!below600 && (
          <DataText area="number" fontWeight="500">
            {index}
          </DataText>
        )}
        <DataText area="name" fontWeight="500" justifyContent="flex-start">
          <CustomLink style={{ marginLeft: below600 ? 0 : '1rem', whiteSpace: 'nowrap' }} to={'/account/' + lp.user.id}>
            {below800 ? lp.user.id.slice(0, 4) + '...' + lp.user.id.slice(38, 42) : lp.user.id}
          </CustomLink>
        </DataText>

        {/* {!below1080 && (
          <DataText area="type" justifyContent="flex-end">
            {lp.type}
          </DataText>
        )} */}

        <DataText>
          <CustomLink area="pair" to={'/pair/' + lp.pairAddress}>
            <RowFixed>
              {!below600 && <DoubleTokenLogo token0={lp.token0} token1={lp.token1} size={16} margin={true} />}
              {lp.pairName}
            </RowFixed>
          </CustomLink>
        </DataText>
        <DataText area="value">{formattedNum(lp.usd, true)}</DataText>
      </DashGrid>
    )
  }

  const lpList =
    lps &&
    lps.slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE).map((lp, index) => {
      return (
        <div key={index}>
          <ListItem key={index} index={(page - 1) * 10 + index + 1} lp={lp} />
          <Divider />
        </div>
      )
    })

  return (
    <ListWrapper>
      <DashGrid center={true} disbaleLinks={disbaleLinks} style={{ height: 'fit-content', padding: ' 0 0 1rem 0' }}>
        {!below600 && (
          <Flex alignItems="center" justifyContent="flex-start">
            <TYPE.main area="number">#</TYPE.main>
          </Flex>
        )}
        <Flex alignItems="center" justifyContent="flex-start">
          <TYPE.main area="name">Account</TYPE.main>
        </Flex>
        {/* {!below1080 && (
          <Flex alignItems="center" justifyContent="flexEnd">
            <TYPE.main area="type">Type</TYPE.main>
          </Flex>
        )} */}
        <Flex alignItems="center" justifyContent="flexEnd">
          <TYPE.main area="pair">Pair</TYPE.main>
        </Flex>
        <Flex alignItems="center" justifyContent="flexEnd">
          <TYPE.main area="value">Value</TYPE.main>
        </Flex>
      </DashGrid>
      <Divider />
      <List p={0}>{!lpList ? <LocalLoader /> : lpList}</List>
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

export default withRouter(LPList)
