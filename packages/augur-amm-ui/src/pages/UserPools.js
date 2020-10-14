import { withRouter } from 'react-router-dom'
import React, { useEffect } from 'react'
import PooledMarketList from '../components/PooledMarkets'
import Panel from '../components/Panel'
import { ThemedBackground } from '../Theme'
import { transparentize } from 'polished'
import { PageWrapper, ContentWrapper } from '../components'
import { useLPTokenBalances } from '../state/wallet/hooks'

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
      <ThemedBackground backgroundColor={transparentize(0.8, '#ff007a')} />
      <ContentWrapper>
        <div>
          <Panel style={{ marginTop: '6px', padding: '1.125rem 0 ' }}>
            <PooledMarketList balances={userTokenBalances} loading={loading} />
          </Panel>
        </div>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default withRouter(UserPoolsPage)
