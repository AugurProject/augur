import { withRouter } from 'react-router-dom'
import React, { useEffect } from 'react'
import PooledMarketList from '../components/PooledMarkets'
import Panel from '../components/Panel'
import { TYPE } from '../Theme'
import { PageWrapper, ContentWrapper } from '../components'
import { useLPTokenBalances } from '../state/wallet/hooks'
import { AutoRow } from '../components/Row'

function UserPoolsPage() {
  const [userTokenBalances, loading] = useLPTokenBalances()
  console.log('render user pool', JSON.stringify(userTokenBalances))

  useEffect(() => {
    document.querySelector('body').scrollTo({
      behavior: 'smooth',
      top: 0
    })
  }, [])

  return (
    <PageWrapper>
      <ContentWrapper>
        <Panel style={{ marginTop: '6px', padding: '1.125rem 0 ' }}>
          {Object.keys(userTokenBalances).length > 0 ? (
            <PooledMarketList balances={userTokenBalances} loading={loading} />
          ) : (
            <AutoRow justify={'center'}>
              <TYPE.light>No Liquidity Pools</TYPE.light>
            </AutoRow>
          )}
        </Panel>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default withRouter(UserPoolsPage)
