import { withRouter } from 'react-router-dom'
import React, { useEffect } from 'react'
import PooledMarketList from '../components/PooledMarkets'
import Panel from '../components/Panel'
import { useAllMarketData } from '../contexts/Markets'
// import { formattedNum, formattedPercent } from '../utils'
import { ThemedBackground } from '../Theme'
import { transparentize } from 'polished'
import { PageWrapper, ContentWrapper } from '../components'
import { useLPTokenBalances } from '../state/wallet/hooks'
import { useActiveWeb3React } from '../hooks'

function UserPoolsPage() {
  const { markets } = useAllMarketData()
  const { account } = useActiveWeb3React()

  const amms = markets ? markets.reduce((p, m) => (m.amms.length > 0 ? [...p, ...m.amms.map(a => a.id)] : p), []) : []
  const [userTokenBalances, loading] = useLPTokenBalances(account, amms)

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
